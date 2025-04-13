import { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    branch_id: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      setSuccess(`User registered! User ID: ${response.data.user_id}`);
      setFormData({
        user_name: '',
        email: '',
        password: '',
        branch_id: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register user');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Signup</h2>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="user_name">Username</label>
            <input
              id="user_name"
              type="text"
              name="user_name"
              placeholder="Enter username"
              value={formData.user_name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="branch_id">Branch ID</label>
            <input
              id="branch_id"
              type="number"
              name="branch_id"
              placeholder="Enter branch ID"
              value={formData.branch_id}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;