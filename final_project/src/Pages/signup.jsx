import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Signup successful!');
      console.log(res.data);
    } catch (err) {
      alert('Signup failed!');
      console.error(err);
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required type="email" />
        <input name="password" placeholder="Password" onChange={handleChange} required type="password" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
