import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormErrors from './components/FormErrors';

function signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [branch, setBranch] = useState('');
  const [errors, setErrors] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role, branch }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (err) {
      setErrors([err.message]);
    }
  }

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        backgroundImage: 'url(https://images.unsplash.com/photo-1600585154347-4be52e62b1e1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ background: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '10px' }}>
        <h2>Signup</h2>
        <FormErrors errors={errors} />
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required style={{ width: '100%', padding: '5px' }}>
              <option value="">Select Role</option>
              <option value="ceo">CEO</option>
              <option value="manager">Manager</option>
              <option value="sales_agent">Sales Agent</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Branch:</label>
            <select value={branch} onChange={(e) => setBranch(e.target.value)} required style={{ width: '100%', padding: '5px' }}>
              <option value="">Select Branch</option>
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
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default signup;