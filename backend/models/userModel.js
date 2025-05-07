const mongoose = require('mongoose');
// const portfolioSchema = require("../models/portfolioModel")


const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    gender: String,
    contactNumber: String,
    department: String,
    designation: String,
    joiningDate: Date,
    role: {
        type: String,
        enum: ["employee", "manager", "hr"],
        default: "employee"
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    appraisals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appraisal" }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);