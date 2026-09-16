const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const nodemailer = require('nodemailer');

// Email Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// POST route - Frontend se form data receive aur save karega
router.post('/', async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: "Name and phone are required." });
        }

        const newQuote = new Quote({ name, phone });
        await newQuote.save();

        // Email Alert Bhejne ka Code
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Lead for Apex Construction! 🚀',
            text: `Hello Admin,\n\nYou have a new lead!\n\nName: ${name}\nPhone: ${phone}\n\nPlease check the Admin Dashboard.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email bhejte waqt error:", error);
            } else {
                console.log("Email sent successfully: " + info.response);
            }
        });

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