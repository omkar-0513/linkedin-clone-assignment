// backend/models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // A link to the User model
        ref: 'User', // The model to link to
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets the time
    }
});

module.exports = mongoose.model('Post', PostSchema);