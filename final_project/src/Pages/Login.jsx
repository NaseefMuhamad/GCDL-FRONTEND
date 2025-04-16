import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FormErrors from '../components/FormErrors';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    try {
      await login(username, password);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'ceo') navigate('/ceo-dashboard');
      else if (user.role === 'manager') navigate('/manager-dashboard');
      else if (user.role === 'sales_agent') navigate('/sales-agent-dashboard');
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
        <h2>Login</h2>
        <FormErrors errors={errors} />
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            />
          </div>
          <button type="submit" style={{ marginTop: '10px', padding: '10px', width: '100%' }}>Login</button>
        </form>
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;