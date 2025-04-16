import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormError from '../components/FormError.jsx';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'sales_agent', // Fixed role
    branch: 'Maganjo',
  });
  const [formErrors, setFormErrors] = useState([]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = [];
    if (!formData.username) errors.push('Username is required');
    if (!formData.password || formData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (!formData.branch) errors.push('Branch is required');
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setFormErrors([err.response?.data?.message || 'Signup failed']);
    }
  }

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <FormError errors={formErrors} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={formData.role} disabled>
            <option value="sales_agent">Sales Agent</option>
          </select>
        </div>
        <div className="form-group">
          <label>Branch:</label>
          <select name="branch" value={formData.branch} onChange={handleChange}>
            <option value="Maganjo">Maganjo</option>
            <option value="Matugga">Matugga</option>
          </select>
        </div>
        <button type="submit" className="form-button">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
