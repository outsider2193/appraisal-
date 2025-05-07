const mongoose = require('mongoose');

const appraisalSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hr: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appraisalCycle: {
        type: String,
        enum: ["annual", "probation", "special"],
        default: "annual"
    },
    startDate: Date,
    dueDate: Date,
    status: {
        type: String,
        enum: ["pending", "self_review_completed", "manager_review_completed", "hr_review_completed", "completed"],
        default: "pending"
    },
    selfReview: { type: mongoose.Schema.Types.ObjectId, ref: "SelfReview" },
    managerReview: { type: mongoose.Schema.Types.ObjectId, ref: "ManagerReview" },
    hrReview: { type: mongoose.Schema.Types.ObjectId, ref: "HRReview" },
    finalRating: Number,
    finalComments: String
}, { timestamps: true });

module.exports = mongoose.model('Appraisal', appraisalSchema);