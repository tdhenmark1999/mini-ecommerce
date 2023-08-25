import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ error: "Email already exists!" });
        }

        const user = new User(req.body);
        await user.save();

        const token = jwt.sign({ userId: user._id }, 'SECRET_KEY', { expiresIn: '1d' });
        res.status(201).json({ token, userId: user._id });

    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, 'SECRET_KEY', { expiresIn: '1d' });
        res.status(200).json({ token, userId: user._id });

    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});


export default router;
