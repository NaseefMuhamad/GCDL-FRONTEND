import React, { useState } from 'react';
import axios from 'axios';
import FormError from '../components/FormError';

function signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'sales_agent',
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
    if (!formData.password) errors.push('Password is required');
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      setFormData({
        username: '',
        password: '',
        role: 'sales_agent',
        branch: 'Maganjo',
      });
      setFormErrors([]);
      alert('Signup successful! Please login.');
    } catch (err) {
      setFormErrors([err.response?.data?.message || 'Signup failed']);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Signup</h2>
      <FormError errors={formErrors} />
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: '100%', padding: '5px' }}
          >
            <option value="sales_agent">Sales Agent</option>
            <option value="manager">Manager</option>
            <option value="ceo">CEO</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Branch:</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            style={{ width: '100%', padding: '5px' }}
          >
            <option value="Maganjo">Maganjo</option>
            <option value="Matugga">Matugga</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px', width: '100%' }}>
          <img
            src="https://images.unsplash.com/photo-1600585154347-4be52e62b1e1"
            alt="Signup Icon"
            style={{ width: '16px', marginRight: '5px', verticalAlign: 'middle' }}
          />
          Signup
        </button>
      </form>
    </div>
  );
}

export default signup;