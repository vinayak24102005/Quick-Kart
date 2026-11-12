const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Creates the login token the browser stores and sends with every request
const createToken = (userId) =>
    jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

// The user details that are safe to send to the browser (never the password)
const publicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email
});

// True only for a non-empty string (also blocks objects sent as "email")
const isText = (value) => typeof value === "string" && value.trim() !== "";

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!isText(name) || !isText(email) || !isText(password)) {
            res.status(400);
            throw new Error("Please fill in all fields");
        }
        if (password.length < 6) {
            res.status(400);
            throw new Error("Password must be at least 6 characters");
        }

        const cleanEmail = email.trim().toLowerCase();

        if (await User.findOne({ email: cleanEmail })) {
            res.status(400);
            throw new Error("An account with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            token: createToken(user._id),
            user: publicUser(user)
        });
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!isText(email) || !isText(password)) {
            res.status(400);
            throw new Error("Please fill in all fields");
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            res.status(400);
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400);
            throw new Error("Invalid credentials");
        }

        res.status(200).json({
            message: "User logged in successfully",
            token: createToken(user._id),
            user: publicUser(user)
        });
    } catch (err) {
        next(err);
    }
}

// Change name and/or password of the logged-in user (used by the Settings page)
const updateProfile = async (req, res, next) => {
    try {
        const { name, currentPassword, newPassword } = req.body;

        // Load the full user (req.user has no password on it)
        const user = await User.findById(req.user._id);

        if (name !== undefined) {
            if (!isText(name)) {
                res.status(400);
                throw new Error("Name can not be empty");
            }
            user.name = name.trim();
        }

        if (newPassword !== undefined) {
            if (!isText(currentPassword) || !(await bcrypt.compare(currentPassword, user.password))) {
                res.status(400);
                throw new Error("Current password is incorrect");
            }
            if (!isText(newPassword) || newPassword.length < 6) {
                res.status(400);
                throw new Error("New password must be at least 6 characters");
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: publicUser(user)
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { register, login, updateProfile };
