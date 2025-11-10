const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Taken'], required: true },
  category: { type: String, required: true },
  dept: { 
    type: String, 
    required: true,
    enum: ['EEE', 'ECE', 'Mechanical', 'Civil', 'CSE', 'Bioinformatics', 'Biomedical', 'Pharmacy', 'General']
  },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('book', BookSchema);