// backend/models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  locationName: { type: String, required: true },
  council: {
    type: String,
    enum: ['General', 'SAC', 'VSC', 'E-cell', 'NCC', 'UEAC', 'NSS', 'ARC'],
    default: 'General',
  },
});

// Force the collection name to 'events'
module.exports = mongoose.model('Event', EventSchema, 'events');
