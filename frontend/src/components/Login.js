import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ studentId: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { studentId, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      const res = await axios.post('https://campus-guide-backend-w02j.onrender.com', formData);
=======
      const res = await axios.post('https://campus-guide-backend.onrender.com', formData);
>>>>>>> e0f74f6 (Updated all API URLs to production)

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.role);

      // REDIRECT TO DASHBOARD
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.response) setMessage(err.response.data.msg);
      else if (err.request)
        setMessage('Network Error: Cannot connect to the server.');
      else setMessage('Unexpected error occurred.');
    }
  };

  return (
    // This outer div with the "container" class is the property that centers the page.
    <div className="container">
      <div className="form-container">
        <h2>Vignan's University Campus Guide</h2>
        <h1>Account Login</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Student ID</label>
            <input
              type="text"
              name="studentId"
              value={studentId}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <input type="submit" value="Login" className="btn" />
        </form>
        {message && <p className="message">{message}</p>}
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

