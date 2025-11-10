const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event'); // You will need to create this model

// @route   GET /api/events
// @desc    Get all events
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find all events and sort them by date (newest first)
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;