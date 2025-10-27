// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // No two users can share an email
    },
    password: {
        type: String,
        required: true
    }
});

// 'User' is the name of the model in our database
module.exports = mongoose.model('User', UserSchema);