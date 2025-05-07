const mongoose = require('mongoose');

const selfReviewSchema = new mongoose.Schema({
    appraisal: { type: mongoose.Schema.Types.ObjectId, ref: "Appraisal" },
    achievements: String,
    challenges: String,
    goalsCompleted: String,
    futurePlans: String,
    trainingNeeds: String,
    ratings: {
        productivity: { type: Number, min: 1, max: 5 },
        quality: { type: Number, min: 1, max: 5 },
        teamwork: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 },
        initiative: { type: Number, min: 1, max: 5 }
    },
    comments: String,
    submittedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('SelfReview', selfReviewSchema);