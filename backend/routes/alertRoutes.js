const express = require('express');
const router = express.Router();
const BookAlert = require('../models/BookAlert');
// We no longer need the authMiddleware for this route

// @route   POST /api/alerts/subscribe
// @desc    ANY user subscribes to a book alert with their email
router.post('/subscribe', async (req, res) => {
  // Get email from the body, not user ID from token
  const { bookId, email } = req.body; 

  // Simple validation
  if (!email || !bookId) {
    return res.status(400).json({ msg: 'Please provide both an email and a book ID.' });
  }

  try {
    // Check if an active alert already exists for this email and book
    let alert = await BookAlert.findOne({ email: email, book: bookId, isActive: true });

    if (alert) {
      return res.status(400).json({ msg: 'This email is already subscribed to alerts for this book.' });
    }

    // Create new alert subscription
    alert = new BookAlert({
      email: email, // Store the email string
      book: bookId,
      isActive: true
    });

    await alert.save();
    res.status(201).json({ msg: 'Successfully subscribed to alerts.' });

  } catch (err) {
    // Handle potential duplicate key error from the index
    if (err.code === 11000) {
       return res.status(400).json({ msg: 'This email is already subscribed to alerts for this book.' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;