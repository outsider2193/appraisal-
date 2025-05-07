const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

// Register user
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, contactNumber, department, designation, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
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
            { id: existingUser._id, email: existingUser.email, role: existingUser.role },
            secretKey,
            { expiresIn: '10d' }
        );
        res.status(200).json({ message: "Login succesfull", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }

}

module.exports = { registerUser, loginUser }