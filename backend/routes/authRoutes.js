const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create(
            { 
                name,
                email, 
                password: hashedPassword 
            }
        );
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: "1h" 
            }
        );
        res.status(201).json(
            {
                message: "User registered successfully",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        )
    } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
        message: "Server error",
        error: error.message
    });
}
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user =await User.findOne({ email });
    if(!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: "1h" 
        }
    );

    res.status(200).json(
        {
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
    );
});

module.exports = router;