const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const BookAlert = require('../models/BookAlert');
const { sendNotificationEmail } = require('../services/emailService');

// @route   PUT /api/books/:id/status
// @desc    Admin updates a book's status (This is the trigger!)
router.put('/:id/status', async (req, res) => {
    const { status } = req.body; // e.g., "Available"
    const bookId = req.params.id;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        const oldStatus = book.status;
        
        // --- THIS IS THE TRIGGER ---
        // Check if the status is being changed TO "Available"
        if (status === 'Available' && oldStatus !== 'Available') {
            
            // 1. Update the book's status
            book.status = status;
            await book.save();

            // 2. CALL THE HELPER FUNCTION HERE
            await notifyWaitingUsers(bookId);
            
            res.json({ msg: 'Book status updated and notifications sent.' });

        } else {
            // If it's any other status change (e.g., Available -> Taken)
            book.status = status;
            await book.save();
            res.json({ msg: 'Book status updated.' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ... (You might have other book routes here, like GET /api/books)

// --- PASTE YOUR CODE SNIPPET HERE ---
// Helper function to find and email users (UPDATED)
async function notifyWaitingUsers(bookId) {
  // Find all active alerts for this book
  // We no longer need to populate 'user', just 'book'
  const alerts = await BookAlert.find({ book: bookId, isActive: true })
    .populate('book', 'title');

  if (alerts.length === 0) {
    console.log('No active alerts for this book.');
    return;
  }

  console.log(`Found ${alerts.length} users to notify...`);

  // Loop through each alert and send an email
  for (const alert of alerts) {
    // Check for alert.email (not alert.user)
    if (alert.email && alert.book) {
      // Send the email to the stored email address
      await sendNotificationEmail(alert.email, alert.book.title);
      
      // Deactivate the alert
      alert.isActive = false;
      await alert.save();
    }
  }
}

// THIS SHOULD BE AT THE VERY END OF THE FILE
module.exports = router;