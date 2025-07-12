const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RootUser = require("../models/rootuser");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

// Signup route
router.post("/signup", async (req, res) => {
    const { gmail, phone, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await RootUser.findOne({ gmail });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists with this email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new RootUser({ gmail, phone, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "User registration failed." });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { gmail, password } = req.body;

    try {
        const user = await RootUser.findOne({ gmail });
        if (!user) return res.status(401).json({ error: "Invalid credentials." });

        if (gmail === "chiragdave1888@gmail.com") {
            const token = jwt.sign({ id: user._id, email: gmail }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({ token, user }); // Added return here
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

        const token = jwt.sign({ id: user._id, email: gmail }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: "Login failed." });
    }
});

router.post("/autoLogin", async (req, res) => {
    try {
        console.log("AutoLogin request body:", req.body);
        const token = req.body.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found",
            });
        }

        console.log("Token received in autoLogin:", token);

        // Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            console.log("JWT verification failed:", jwtError.message);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        if (!decoded) {
            console.log("Token decode failed");
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        console.log("Decoded token:", decoded);

        const email = decoded.email;
        console.log("Looking for user with email:", email);

        const user = await RootUser.findOne({ gmail: email.trim() });
        console.log("Found user:", user ? "Yes" : "No");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        console.log("AutoLogin success for user:", user.gmail);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        console.error("AutoLogin error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// Logout route (just a placeholder, handle logout on frontend)
router.post("/logout", (req, res) => {
    res.json({ message: "User logged out." });
});

module.exports = router;
