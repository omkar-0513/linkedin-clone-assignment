// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db'); // Import database connection

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Middlewares ---
// Enable CORS so your frontend can make requests
app.use(cors());

// Allow express to parse JSON in request bodies
app.use(express.json());

// --- API Routes ---
// When a request comes to /api/auth, use the 'auth' routes
app.use('/api/auth', require('./routes/auth'));

// When a request comes to /api/posts, use the 'posts' routes
app.use('/api/posts', require('./routes/posts'));

// --- Start the Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});