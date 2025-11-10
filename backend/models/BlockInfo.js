const mongoose = require('mongoose');

const BlockInfoSchema = new mongoose.Schema({
  blockName: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  faculty: [
    {
      name: { type: String },
      department: { type: String },
    }
  ],
  keyLocations: [String],
});

module.exports = mongoose.model('blockinfo', BlockInfoSchema);