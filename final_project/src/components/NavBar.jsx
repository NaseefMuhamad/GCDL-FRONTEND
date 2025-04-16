import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import LiveClock from './LiveClock.jsx';

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav style={{ background: '#333', color: '#fff', padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://images.unsplash.com/photo-1600585154347-4be52e62b1e1"
            alt="GCDL Logo"
            style={{ width: '40px', marginRight: '10px' }}
          />
          <Link to="/" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>GCDL</Link>
          {user?.role === 'ceo' && (
            <>
              <Link to="/ceo-dashboard" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>CEO Dashboard</Link>
              <Link to="/procurement" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Procurement</Link>
              <Link to="/sales" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Sales</Link>
              <Link to="/credit-sales" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Credit Sales</Link>
            </>
          )}
          {user?.role === 'manager' && (
            <>
              <Link to="/manager-dashboard" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Manager Dashboard</Link>
              <Link to="/procurement" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Procurement</Link>
              <Link to="/sales" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Sales</Link>
              <Link to="/credit-sales" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Credit Sales</Link>
            </>
          )}
          {user?.role === 'sales_agent' && (
            <Link to="/sales-agent-dashboard" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Sales Agent Dashboard</Link>
          )}
        </div>
        <div>
          <LiveClock />
          {user ? (
            <>
              <span style={{ marginRight: '20px' }}>Welcome, {user.username} ({user.role})</span>
              <button onClick={handleLogout} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '5px 10px' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;