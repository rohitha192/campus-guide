import React, { useState } from 'react';
import './BookResultCard.css';

const BookResultCard = ({ book }) => {
  const [notifyState, setNotifyState] = useState('idle');
  const [email, setEmail] = useState('');

  // --- ADD THIS CONSOLE LOG ---
  // This will show you the exact data in your browser's console (F12)
  console.log('Book object received:', book); 

  if (!book) {
    return null;
  }

  // Check if the book's status is "Taken"
  const isAvailable = book.status === 'Available';

  const handleNotifyClick = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setNotifyState('loading');

    try {
      // This calls the same backend route we already built
      const response = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id, email: email }) // Assuming book has an 'id'
      });

      if (response.ok) {
        setNotifyState('notified');
      } else {
        const data = await response.json();
        alert(data.msg || 'Error: Could not subscribe.');
        setNotifyState('idle');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Error: Connection failed.');
      setNotifyState('idle');
    }
  };

  return (
    <div className="book-card">
      <div className="book-card-content">
        <img src={book.cover} alt={book.title} className="book-card-cover" />
        <div className="book-card-details">
          <h4>{book.title}</h4>
          <p>by {book.author}</p>
          <p>
            <strong>Status: </strong>
            <span className={isAvailable ? 'status-available' : 'status-unavailable'}>
              {isAvailable ? 'Available' : 'Not Available (Taken)'}
            </span>
          </p>
        </div>
      </div>

      {/* --- THIS IS THE FEATURE YOU ASKED FOR --- */}
      {/* If the book is NOT available, show this alert box */}
      {!isAvailable && (
        <div className="notify-section-card">
          {notifyState === 'notified' ? (
            <p className="notify-success">
              We'll email <strong>{email}</strong> when this book is available!
            </p>
          ) : (
            <>
              <p>To know when it's available, click OK and enter your mail.</p>
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
                {notifyState === 'loading' ? 'Sending...' : 'OK (Notify Me)'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookResultCard;