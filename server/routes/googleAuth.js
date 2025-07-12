const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const RootUser = require("../models/rootuser");
const User = require("../models/User");
const fs = require("fs").promises;
const path = require("path");

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Google OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || "495171980207-d5n0p7v6ubb315cssm8d93pm31i3pqoi.apps.googleusercontent.com",
    process.env.GOOGLE_CLIENT_SECRET,
    // Redirect URI will be set dynamically based on request
);

// Handle Google OAuth callback
router.post("/google-callback", async (req, res) => {
    try {
        const { code, state, redirectUri } = req.body;

        console.log("Received Google OAuth callback:", { code: code?.substring(0, 20) + "...", state, redirectUri });

        if (!code) {
            return res.status(400).json({ error: "Authorization code is required" });
        }

        // Set the redirect URI for this specific request
        oauth2Client.redirectUri = redirectUri;

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        console.log("Tokens received:", {
            access_token: tokens.access_token?.substring(0, 20) + "...",
            refresh_token: !!tokens.refresh_token,
            scope: tokens.scope,
        });

        // Get user info from Google
        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        const { data: userInfo } = await oauth2.userinfo.get();

        console.log("Google user info:", {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
        });

        let user;
        let rootUser;

        // Handle both signup and login flows
        // First, always try to find existing user
        rootUser = await RootUser.findOne({
            $or: [{ gmail: userInfo.email }, { googleId: userInfo.id }],
        });

        if (rootUser) {
            console.log("Found existing user, processing as login");
            // Update Google ID if not set
            if (!rootUser.googleId) {
                rootUser.googleId = userInfo.id;
                rootUser.name = userInfo.name;
                rootUser.picture = userInfo.picture;
                rootUser.calendarConnected = true;
                await rootUser.save();
            }

            // Find associated User
            user = await User.findOne({ rootUser: rootUser._id });
            if (!user) {
                // Create User if it doesn't exist (edge case)
                user = new User({
                    name: userInfo.name,
                    breakfastTime: "08:00",
                    lunchTime: "13:00",
                    dinnerTime: "19:00",
                    rootUser: rootUser._id,
                });
                await user.save();
                console.log("Created missing user for existing rootUser:", user._id);
            }
        } else {
            console.log("Creating new user (signup flow)");
            // Create new root user
            rootUser = new RootUser({
                gmail: userInfo.email,
                phone: userInfo.phone || "", // Google doesn't always provide phone
                password: "google-oauth", // Placeholder for Google OAuth users
                googleId: userInfo.id,
                name: userInfo.name,
                picture: userInfo.picture,
                calendarConnected: true,
            });
            await rootUser.save();
            console.log("Created new root user:", rootUser._id);

            // Create associated User with default meal times
            user = new User({
                name: userInfo.name,
                breakfastTime: "08:00",
                lunchTime: "13:00",
                dinnerTime: "19:00",
                rootUser: rootUser._id,
            });
            await user.save();
            console.log("Created new user:", user._id);
        }

        // Save Google Calendar tokens
        const tokenPath = path.join(process.cwd(), "token.json");
        console.log("Attempting to save tokens to:", tokenPath);
        console.log("Token data to save:", {
            access_token: tokens.access_token?.substring(0, 20) + "...",
            refresh_token: !!tokens.refresh_token,
            client_id: oauth2Client._clientId?.substring(0, 20) + "...",
        });

        const credentials = {
            type: "authorized_user",
            client_id:
                process.env.GOOGLE_CLIENT_ID ||
                "495171980207-d5n0p7v6ubb315cssm8d93pm31i3pqoi.apps.googleusercontent.com",
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: tokens.refresh_token,
            access_token: tokens.access_token,
        };

        try {
            await fs.writeFile(tokenPath, JSON.stringify(credentials, null, 2));
            console.log("✅ Calendar tokens saved successfully to:", tokenPath);

            // Verify the file was created
            const fileStats = await fs.stat(tokenPath);
            console.log("📁 Token file size:", fileStats.size, "bytes");
        } catch (error) {
            console.error("❌ Error saving calendar tokens:", error);
            console.error("Error details:", {
                code: error.code,
                message: error.message,
                path: error.path,
            });
            // Don't fail the auth flow if token saving fails
        }

        // Generate JWT token (match format expected by autoLogin)
        const jwtToken = jwt.sign(
            {
                id: rootUser._id,
                email: userInfo.email,
                calendarAccess: true,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return success response
        res.json({
            success: true,
            token: jwtToken,
            user: {
                id: user._id,
                rootUserId: rootUser._id,
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
                calendarConnected: true,
                breakfastTime: user.breakfastTime,
                lunchTime: user.lunchTime,
                dinnerTime: user.dinnerTime,
            },
            calendarToken: tokens.access_token,
            message: "Authentication successful with calendar access",
        });
    } catch (error) {
        console.error("Google OAuth callback error:", error);
        res.status(500).json({
            error: "Authentication failed",
            details: error.message,
            step: "oauth_callback",
        });
    }
});

// Check authentication status
router.get("/status", async (req, res) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.json({ authenticated: false });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const rootUser = await RootUser.findById(decoded.id);
        const user = await User.findOne({ rootUser: decoded.id });

        if (!rootUser || !user) {
            return res.json({ authenticated: false });
        }

        // Check if calendar tokens exist
        const tokenPath = path.join(process.cwd(), "token.json");
        let calendarConnected = false;

        try {
            await fs.access(tokenPath);
            calendarConnected = true;
        } catch {
            calendarConnected = false;
        }

        res.json({
            authenticated: true,
            user: {
                id: user._id,
                rootUserId: rootUser._id,
                name: rootUser.name || user.name,
                email: rootUser.gmail,
                calendarConnected,
            },
        });
    } catch (error) {
        console.error("Auth status check error:", error);
        res.json({ authenticated: false });
    }
});

module.exports = router;
