const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// @route   GET /api/dashboard/events
// @desc    Get events, with optional council filter
// @access  Private
router.get('/events', auth, async (req, res) => {
  try {
    const query = {};
    if (req.query.council) {
      query.council = req.query.council;
    }

    // --- THIS IS THE CHANGE ---
    // I have removed the startTime filter for testing
    const events = await Event.find(query).sort({ startTime: 1 });
    // --- END OF CHANGE ---

    // This will now find ALL events, even old ones
    res.json(events);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;