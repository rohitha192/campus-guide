import React, { useState } from 'react';
import './BookModal.css'; // Make sure to import this

const BookModal = ({ book, bookId, onClose }) => {
  // State to hold the user's email input
  const [email, setEmail] = useState('');
  
  // 'idle', 'loading', 'notified'
  const [notifyState, setNotifyState] = useState('idle');

  if (!book) {
    return null;
  }

  const handleNotifyClick = async () => {
    // 1. Simple email validation
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setNotifyState('loading');

    try {
      // 2. Call the backend with the bookId AND the email
      const response = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No Authorization token is needed now
        },
        body: JSON.stringify({ bookId: bookId, email: email })
      });

      if (response.ok) {
        setNotifyState('notified'); // Show success message
      } else {
        const data = await response.json();
        alert(data.msg || 'Error: Could not subscribe.');
        setNotifyState('idle'); // Reset on error
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Error: Connection failed.');
      setNotifyState('idle');
    }
  };

  const isAvailable = book.status === 'Available';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <img src={book.cover} alt={`${book.title} cover`} className="modal-book-cover" />
        <div className="modal-book-details">
          <h3>{book.title}</h3>
          <p><em>By {book.author}</em></p>
          <p>{book.description}</p>
          <hr />
          <p><strong>Status:</strong> <span className={`status ${isAvailable ? 'status-available' : 'status-unavailable'}`}>{book.status}</span></p>
          <p><strong>Location:</strong> <span className="location">{book.location}</span></p>
          
          {/* --- THIS IS THE NEW FEATURE --- */}
          {/* Show this section if the book is "Taken" */}
          {!isAvailable && (
            <div className="notify-section">
              {notifyState === 'notified' ? (
                <p className="notify-success">
                  Great! We'll email <strong>{email}</strong> when this book is available.
                </p>
              ) : (
                <>
                  <p>This book is taken. Enter your email to get an alert when it's available.</p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="notify-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={notifyState === 'loading'}
                  />
                  <button
                    onClick={handleNotifyClick}
                    className="notify-button"
                    disabled={notifyState === 'loading'}
                  >
                    {notifyState === 'loading' ? 'Subscribing...' : 'Notify Me'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookModal;