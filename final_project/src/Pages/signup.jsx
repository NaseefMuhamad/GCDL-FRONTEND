import React, { useState } from 'react';
import axios from 'axios';
import LiveClock from "../components/LiveClock";


function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    branch_id: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (form.role === 'ceo') {
      delete payload.branch_id;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', payload);
      alert('Signup successful!');
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed!');
      console.error(err);
    }
  };

  return (
    <section className="signup-container">
      <h2 className="signup-title">Sign Up to GCDL</h2>
      <div className="live-clock-container">
        <LiveClock />
      </div>
      <div className="page-image-container">
        <img
          src="/images/signup-welcome.jpg"
          alt="Welcome to GCDL"
          className="page-image"
        />
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            placeholder="Enter email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            placeholder="Enter password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Select Role</option>
            <option value="ceo">CEO</option>
            <option value="manager">Manager</option>
            <option value="sales_agent">Sales Agent</option>
          </select>
        </div>
        {form.role !== 'ceo' && (
          <div className="form-group">
            <label>Branch ID</label>
            <input
              name="branch_id"
              placeholder="Enter Branch ID"
              value={form.branch_id}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        <button type="submit" className="form-button">Register</button>
      </form>
    </section>
  );
}

export default Signup;