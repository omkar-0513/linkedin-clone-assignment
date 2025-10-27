// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For creating tokens
const User = require('../models/User'); // Import User model

const router = express.Router();

// --- REGISTER ROUTE: POST /api/auth/register ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create new user
        user = new User({ name, email, password });

        // 3. Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save the user to the database
        await user.save();

        // 5. Send a success response
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- LOGIN ROUTE: POST /api/auth/login ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Create a JWT token
        const payload = {
            user: {
                id: user.id, // This is the user's database ID
                name: user.name
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                // 4. Send the token and user info back
                res.json({ 
                    token,
                    user: { id: user.id, name: user.name, email: user.email }
                });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;