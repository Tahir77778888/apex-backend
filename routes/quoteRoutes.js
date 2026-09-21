const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// POST route - Frontend se form data receive aur save karega
router.post('/', async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: "Name and phone are required." });
        }

        // Sirf Database mein save karo (Email hum yahan se nahi bhejenge)
        const newQuote = new Quote({ name, phone });
        await newQuote.save();

        res.status(201).json({ message: "Quote request saved successfully!", quote: newQuote });
    } catch (error) {
        console.error("Error saving quote:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET route - Admin ke liye
router.get('/', async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: -1 });
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// PUT route - Status update ke liye
router.put('/:id', async (req, res) => {
    try {
        const updatedQuote = await Quote.findByIdAndUpdate(req.params.id, { status: 'Contacted' }, { new: true });
        res.status(200).json(updatedQuote);
    } catch (error) {
        res.status(500).json({ message: "Error updating status" });
    }
});

module.exports = router;