const mongoose = require('mongoose');

const recognitionSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    date: { type: Date, default: Date.now },
    category: {
        type: String,
        enum: ["performance", "innovation", "teamwork", "leadership", "other"],
        default: "performance"
    }
}, { timestamps: true });

module.exports = mongoose.model('Recognition', recognitionSchema);