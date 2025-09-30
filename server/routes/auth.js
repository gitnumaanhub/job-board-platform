const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, userType } = req.body;

        //check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //create user
        const user = new User({
            email: email.toLowerCase().trim(),
            password: password.trim(),
            name: name.trim(),
            userType: userType
        });
        await user.save();

        //generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '7d' }
        );
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                userType: user.userType
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
        });

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('===LOGIN ATTEMPT==');
        console.log('Email provided:', email)
        console.log('Password provided:', password);
        
        //check if user exists
         const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
         console.log('Found user:', user ? 'YES' : 'NO');
        if (!user) {
            console.log('No user found with the provided email');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('User details:', {
            id: user._id,
            email: user.email,
            name: user.name,
            hasPassword: !!user.password
        });
        //check password
        console.log('Checking password...');
        const isMatch = await user.correctPassword(password);
        console.log('Password check result:', isMatch);
        if (!isMatch) {
            console.log('Incorrect password');
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                userType: user.userType
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try{
    res.json({
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            userType: req.user.userType,
            profile: req.user.profile
        }
    });
} catch (err) {
    console.error('Fetch user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
}
});

module.exports = router;