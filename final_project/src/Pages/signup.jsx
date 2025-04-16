import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
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

    // Don't send branch_id if role is ceo
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
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="ceo">CEO</option>
          <option value="manager">Manager</option>
          <option value="sales_agent">Sales Agent</option>
        </select>

        {form.role !== 'ceo' && (
          <input
            name="branch_id"
            placeholder="Branch ID"
            value={form.branch_id}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Signup;
