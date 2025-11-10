const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BlockInfo = require('../models/BlockInfo');

// This creates the endpoint: GET /api/blocks/U-Block
router.get('/:name', auth, async (req, res) => {
  try {
    const block = await BlockInfo.findOne({ blockName: req.params.name });
    if (!block) {
      return res.status(404).json({ msg: 'Block information not found' });
    }
    res.json(block);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// This line is essential. Without it, the "handler must be a function" error occurs.
module.exports = router;