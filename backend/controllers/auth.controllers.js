const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            res.status(400);
            throw new Error("Please fill in all fields");
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
        next(error);
    }
}

const login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
    
        if(!email || !password) {
            res.status(400);
            throw new Error("Please fill in all fields");
        }
    
        const user =await User.findOne({ email });
        if(!user) {
            res.status(400);
            throw new Error("Invalid credentials");
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if(!isMatch) {
            res.status(400);
            throw new Error("Invalid credentials");
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
    
        return res.status(200).json(
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
    }catch(err){
        next(err);
    }
}

module.exports = { register, login };