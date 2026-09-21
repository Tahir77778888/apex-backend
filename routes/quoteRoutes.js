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

        // 1. Database mein save karo
        const newQuote = new Quote({ name, phone });
        await newQuote.save();

        // 2. Web3Forms API se Email Bhejo (Render block bypass)
        try {
            const emailResponse = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: 'a67a05ec-f52a-409f-9bb7-87afc005c0d7', // <-- Apna key yahan paste karo
                    subject: '🚀 New Lead for Apex Construction!',
                    from_name: 'Apex Admin System',
                    // Niche ki details Web3Forms apne aap mast table design mein bhejega
                    Client_Name: name,
                    Client_Phone: phone,
                    System_Message: 'Please check the Admin Dashboard for more details.'
                })
            });

            const emailResult = await emailResponse.json();
            console.log("✅ Email API Status:", emailResult);
        } catch (emailError) {
            console.error("❌ Email API Error:", emailError);
        }

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