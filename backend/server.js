require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Define ALL API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/books', require('./routes/books'));
app.use('/api/blocks', require('./routes/blocks'));
app.use('/api/queries', require('./routes/chat'));
app.use('/api/events', require('./routes/events'));

// --- ADD THIS LINE HERE ---
app.use('/api/alerts', require('./routes/alertRoutes')); 
// --- END OF FIX ---

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));