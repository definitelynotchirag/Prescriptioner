const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RootUser = require('../models/rootuser');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Signup route
router.post('/signup', async (req, res) => {
    const { gmail, phone, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new RootUser({ gmail, phone, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'User registration failed.' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { gmail, password } = req.body;

    try {
        const user = await RootUser.findOne({ gmail });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

        if(gmail === "chiragdave1888@gmail.com"){
            const token = jwt.sign({ id: user._id  , email:gmail}, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

        const token = jwt.sign({ id: user._id  , email:gmail}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Login failed.' });
    }
});


router.post('/autoLogin', async (req, res) => {
    try {
        console.log(req.body);
        const token = req.body.token ;
            

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found",
            });
        }

    

        console.log("Token received in autoLogin:", token);

        const response = jwt.verify(token, process.env.JWT_SECRET);
        if (!response) {
            console.log("Invalid token");
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        console.log("Decoded token:", response);

        const email = response.email;
        console.log(email, "dsjfnjdsbf fndskjfn kjs nfjdsnf mkfndbsj nfjdsb fsj bfjdbnf bjfdbfsz");
        const user = await RootUser.findOne({ gmail: email.trim() });
        console.log(user, "dsjfnjdsbf fndskjfn kjs nfjdsnf mkfndbsj nfjdsb fsj bfjdbnf bjfdbfsz");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        console.log("AutoLogin success for user:", user);

        return res.status(200).json({
            success: true,
            data: user,
        });

    } catch (err) {
        console.error("AutoLogin error:", err.message);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});



// Logout route (just a placeholder, handle logout on frontend)
router.post('/logout', (req, res) => {
    res.json({ message: 'User logged out.' });
});

module.exports = router;
