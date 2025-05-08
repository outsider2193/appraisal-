const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendWelcomeEmail = require("../middleware/mailMiddleware");

const secretKey = process.env.JWT_SECRET;


const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, contactNumber, department, designation, role } = req.body;

        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

     
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

    
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            gender,
            contactNumber,
            department,
            designation,
            role,
            joiningDate: new Date()
        });

        if (user) {
            await sendWelcomeEmail(user.email, user.firstName);
            res.status(201).json({
                success: true,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,

                }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found!" });
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });

        }
        const token = jwt.sign(
            { id: existingUser._id, 
              email: existingUser.email, 
              role: existingUser.role,
              firstName: existingUser.firstName,
              lastName: existingUser.lastName,
              gender: existingUser.gender,
              contactNumber: existingUser.contactNumber
            },
            secretKey,
            { expiresIn: '10d' }
        );
        res.status(200).json({ message: "Login succesfull", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.RESET_SECRET,
            { expiresIn: "15m" }
        );

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        // Set up transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send email
        await transporter.sendMail({
            from: `"Appraisal Tracker" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <h2>Hello ${user.firstName},</h2>
                <p>You requested a password reset.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" target="_blank">${resetLink}</a>
                <p>This link will expire in 15 minutes.</p>
            `
        });

        res.status(200).json({ message: "Password reset link sent to your email." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const decoded = jwt.verify(token, process.env.RESET_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};


module.exports = { registerUser, loginUser, forgotPassword, resetPassword }