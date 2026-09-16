const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);