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
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="https://images.unsplash.com/photo-1600585154347-4be52e62b1e1" alt="GCDL Logo" />
        <Link to="/">GCDL</Link>
      </div>
      <div className="navbar-links">
        {user?.role === 'ceo' && (
          <>
            <Link to="/ceo-dashboard">CEO Dashboard</Link>
            <Link to="/procurement">Procurement</Link>
            <Link to="/sales">Sales</Link>
            <Link to="/credit-sales">Credit Sales</Link>
          </>
        )}
        {user?.role === 'manager' && (
          <>
            <Link to="/manager-dashboard">Manager Dashboard</Link>
            <Link to="/procurement">Procurement</Link>
            <Link to="/sales">Sales</Link>
            <Link to="/credit-sales">Credit Sales</Link>
          </>
        )}
        {user?.role === 'sales_agent' && (
          <Link to="/sales">Sales</Link>
        )}
      </div>
      <div className="navbar-right">
        <LiveClock />
        {user ? (
          <>
            <span>Welcome, {user.username} ({user.role})</span>
            <button onClick={handleLogout} className="navbar-button logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button login">Login</Link>
            <Link to="/signup" className="navbar-button signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;