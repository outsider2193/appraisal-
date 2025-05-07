const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    description: String,
    type: {
        type: String,
        enum: ["online", "workshop", "seminar", "certification", "other"],
        default: "online"
    },
    startDate: Date,
    completionDate: Date,
    status: {
        type: String,
        enum: ["planned", "in_progress", "completed"],
        default: "planned"
    },
    recommendedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    outcomes: String
}, { timestamps: true });

module.exports = mongoose.model('Training', trainingSchema);