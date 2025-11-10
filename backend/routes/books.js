const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');

// This creates the endpoint: GET /api/books/search?q=...
router.get('/search', auth, async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ msg: "Query parameter 'q' is required." });
    }
    const book = await Book.findOne({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
      ],
    });

    if (!book) {
      return res.json({ status: 'Not in Collection' });
    }
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// This line is essential.
module.exports = router;