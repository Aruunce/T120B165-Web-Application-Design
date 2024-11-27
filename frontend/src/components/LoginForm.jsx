import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import '../style/Auth.css';

const LoginForm = ({ onClose, onLogin, onRegisterClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('userID', response.data.user.id);
      setSuccess(true);
      setTimeout(() => {
        onLogin(response.data.user.role, response.data.user.username);
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-form">
    <h2>Welcome Back</h2>
    {error && <div className="error-message">{error}</div>}
    {success && <div className="success-message">Login successful!</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Login</button>
      </form>
      <div className="auth-footer">
        <p>
          Don't have an account? {' '}
          <a href="#" onClick={(e) => {
            e.preventDefault();
            onRegisterClick();
          }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;