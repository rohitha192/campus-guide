import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { studentId, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      // --- THIS IS THE FIXED LINE ---
      const res = await axios.post('https://campus-guide-backend.onrender.com/register', formData);
      // ------------------------------

      setMessage(res.data.msg);
      // Set a timer to redirect the user to the login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // This robust error handling prevents the "Cannot read properties of undefined" crash.
      if (err.response) {
        // The backend server responded with an error (e.g., student ID invalid, email taken).
        setMessage(err.response.data.msg);
      } else if (err.request) {
        // The request was sent, but no response was received (e.g., backend server is not running).
        setMessage('Network Error: Cannot connect to the server. Please ensure the backend is running.');
      } else {
        // A different error occurred while setting up the request.
        setMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    // This outer div with the "container" class is the property that centers the page.
    <div className="container">
      <div className="form-container">
        <h2>Vignan's University</h2>
        <h1>Register Account</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input type="text" name="studentId" value={studentId} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
  S         <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
A         </div>
          <input type="submit" value="Register" className="btn" />
        </form>
        {message && <p className="message">{message}</p>}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};
// This is a test comment

export default Register;