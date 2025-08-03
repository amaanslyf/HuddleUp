import httpStatus from "http-status";
import  User  from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const payload = {
                id: user._id,
                username: user.username
            };

            //Sign the token with the secret key and set an expiration.
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            
            //Send the new JWT back to the client.
            return res.status(httpStatus.OK).json({ message: "Login successful", token });

        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error logging in" });
    }
};



const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            username,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(httpStatus.CREATED).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error creating user" });
    }
};

export  { login, register };
