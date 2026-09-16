const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware (Frontend se connect karne ke liye zaroori)
app.use(cors());
app.use(express.json());

// MongoDB Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/quotes', require('./routes/quoteRoutes'));

// Testing route (Render dashboard check karne ke liye)
app.get('/', (req, res) => {
    res.send('Apex Construction Backend is running!');
});

// Server Start (Render dynamic PORT provide karega)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});