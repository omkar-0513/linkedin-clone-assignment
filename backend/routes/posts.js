// backend/routes/posts.js
const express = require('express');
const auth = require('../middleware/auth'); // Import our auth middleware
const Post = require('../models/Post'); // Import Post model

const router = express.Router();

// --- CREATE A POST: POST /api/posts ---
// This route is protected. You must be logged in.
router.post('/', auth, async (req, res) => {
    try {
        const { text } = req.body;
        
        // req.user.id comes from the 'auth' middleware
        const newPost = new Post({
            text: text,
            user: req.user.id 
        });

        const post = await newPost.save();
        
        // Populate user info before sending back
        const populatedPost = await Post.findById(post._id).populate('user', ['name']);
        
        res.status(201).json(populatedPost);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- GET ALL POSTS: GET /api/posts ---
// This route is also protected.
router.get('/', auth, async (req, res) => {
    try {
        // Find all posts
        // .sort() gets the latest posts first
        // .populate() swaps the 'user' ID with the user's details
        const posts = await Post.find()
            .sort({ createdAt: -1 }) 
            .populate('user', ['name']); // Only get the 'name' field from the User
        
        res.json(posts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;