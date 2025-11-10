const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User'); // Make sure this path is correct

// @route   GET /api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    // This route is for getting the user's info AFTER they are logged in
    try {
        // Find user by ID, but don't return the password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Log in a user
// @access  Public
router.post('/login', async (req, res) => {
    // 1. Get studentId and password from the request body
    const { studentId, password } = req.body;

    try {
        // 2. Find the user in the database by their studentId
        //
        // --- THIS IS THE FIX ---
        // We must add .select('+password') here.
        // Otherwise, user.password will be 'undefined' if your model
        // has `select: false` on the password field.
        let user = await User.findOne({ studentId }).select('+password');

        // 3. If the user doesn't exist, send an error
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 4. Compare the plain-text password from the request
        //    with the hashed password in the database
        //    This line will no longer crash because user.password is now defined.
        const isMatch = await bcrypt.compare(password, user.password);

        // 5. If the passwords don't match, send an error
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 6. If everything is correct, create a JWT (token)
        const payload = {
            user: {
                id: user.id,
                role: user.role // Make sure your User model has a 'role'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Your secret key from your .env file
            { expiresIn: '5h' }, // Token expires in 5 hours
            (err, token) => {
                if (err) throw err;
                // 7. Send the token and role back to the frontend
                res.json({
                    token: token,
                    role: user.role
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- THIS LINE MUST BE AT THE END ---
// The extra line you had before this is now removed.
module.exports = router;