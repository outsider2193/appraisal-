const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    description: String,
    startDate: Date,
    targetDate: Date,
    status: {
        type: String,
        enum: ["not_started", "in_progress", "completed", "deferred"],
        default: "not_started"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    managerFeedback: String
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);