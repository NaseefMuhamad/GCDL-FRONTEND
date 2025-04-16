import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import FormError from '../components/FormError.jsx';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);
    
    // Basic client-side validation
    if (!username.trim() || !password.trim()) {
      setErrors(['Please enter both username and password']);
      setIsLoading(false);
      return;
    }

    try {
      await login(username, password);
      navigate('/ceo-dashboard');
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setIsLoading(false);
    }
    // For debugging - remove in production
    console.error("Login failed:", err);

  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Login</h2>
      <FormError errors={errors} />
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
            disabled={isLoading}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          style={{ padding: '10px', width: '100%' }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : (
            <>
              <img
                src="https://images.unsplash.com/photo-1600585154347-4be52e62b1e1"
                alt="Login Icon"
                style={{ width: '16px', marginRight: '5px', verticalAlign: 'middle' }}
              />
              Login
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;