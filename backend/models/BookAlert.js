const mongoose = require('mongoose');

const bookAlertSchema = new mongoose.Schema({
  // --- CHANGE ---
  // Store the email directly as a string
  email: { 
    type: String, 
    required: true,
    trim: true, // Removes whitespace
    lowercase: true // Stores email in lowercase
  },
  book: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

// Add a compound index to prevent duplicate (email + book) subscriptions
bookAlertSchema.index({ email: 1, book: 1, isActive: 1 }, { unique: true });

module.exports = mongoose.model('BookAlert', bookAlertSchema);