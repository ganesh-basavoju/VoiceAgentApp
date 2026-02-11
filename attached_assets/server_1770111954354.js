require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("CRITICAL: MONGO_URI is not defined in .env file.");
    // We will not exit to allow the server to run, but DB features will fail.
} else {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// Basic Route
app.get('/', (req, res) => {
    res.send('Voice Transcription Backend is running');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
