const mongoose = require('mongoose');

const hrReviewSchema = new mongoose.Schema({
    appraisal: { type: mongoose.Schema.Types.ObjectId, ref: "Appraisal" },
    comments: String,
    finalRating: { type: Number, min: 1, max: 5 },
    promotionRecommendation: Boolean,
    salaryIncreasePercentage: Number,
    additionalRemarks: String,
    submittedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('HRReview', hrReviewSchema);