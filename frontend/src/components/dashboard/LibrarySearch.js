import React, { useState } from 'react';
import axios from 'axios';
import './LibrarySearch.css';

const LibrarySearch = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- 1. ADD NEW STATE for the alert form ---
  const [notifyState, setNotifyState] = useState('idle'); // 'idle', 'loading', 'notified'
  const [email, setEmail] = useState('');

  const handleBookSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setNotifyState('idle'); // Reset notify state on new search
    setEmail('');           // Reset email on new search
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'x-auth-token': token },
        params: { q: query } 
      };
      // This call is correct
      const res = await axios.get('http://localhost:5000/api/books/search', config);
      setResult(res.data);
    } catch (error) {
      console.error("Book search failed:", error);
      setResult({ status: 'Error' });
    } finally {
      setLoading(false);
    }
  };

  // --- 2. THIS FUNCTION IS NOW FIXED ---
  const handleNotifyClick = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setNotifyState('loading');

    try {
      // Calls the backend API route we built
      // We use result._id (assuming MongoDB) or result.id
      const bookId = result._id || result.id; 
      
      // --- THIS IS THE FIX ---
      // We add the full URL to your backend server to fix the connection error
      const response = await axios.post('http://localhost:5000/api/alerts/subscribe', {
        bookId: bookId, 
        email: email 
      });
      // --- END OF FIX ---

      if (response.status === 201) {
        setNotifyState('notified');
      } else {
        alert(response.data.msg || 'Error: Could not subscribe.');
        setNotifyState('idle');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Error: Connection failed.'); // This error will now be fixed
      setNotifyState('idle');
    }
  };

  // --- 3. THIS FUNCTION IS MODIFIED to show the form ---
  const renderResult = () => {
    if (loading) {
      return <p className="status">Searching...</p>;
    }
    if (!result) {
      return <p className="status">Search for a book by title or author.</p>;
    }

    switch (result.status) {
      case 'Available':
        return (
          <div className="book-result">
            <img src={result.imageUrl} alt={result.name} />
            <div className="book-info">
              <h4>{result.name}</h4>
              <p>by {result.author}</p>
              <p className="status available">Available</p>
            </div>
          </div>
        );

      case 'Taken':
      case 'Checked Out':
        return (
          <div className="book-result">
            <img src={result.imageUrl} alt={result.name} />
            <div className="book-info">
              <h4>{result.name}</h4>
              <p>by {result.author}</p>
              <p className="status unavailable">Not Available (Taken)</p>
            </div>
            
            {/* --- THIS IS THE NEW ALERT BOX --- */}
            <div className="notify-section-card">
              {notifyState === 'notified' ? (
                <p className="notify-success">
                  We'll email <strong>{email}</strong> when this book is available!
                </p>
              ) : (
                <>
                  <p>To know when it's available, enter your mail and click OK.</p>
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
          </div>
        );

      case 'Not in Collection':
        return <p className="status not-found">No such book in collection.</p>;
      default:
        return <p className="status error">Could not complete search.</p>;
    }
  };

  return (
    <div className="library-search-container">
      <h4>Search Library Catalog</h4>
      <form onSubmit={handleBookSearch} className="book-search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // This line is correct now
          placeholder="e.g., 'Dune'"
        />
        <button type="submit">Search</button>
      </form>
      <div className="search-results-container">
        {renderResult()}
      </div>
    </div>
  );
};

export default LibrarySearch;