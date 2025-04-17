import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import LiveClock from './LiveClock.jsx';
import logo from '../assets/react.svg'; // Local image

function NavBar() {
  const context = useContext(AuthContext);
  const { user, logout } = context || { user: null, logout: () => {} };
  const navigate = useNavigate();

  function handleLogout() {
    if (logout) {
      logout();
      navigate('/login');
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="GCDL Logo" />
        <Link to="/">GCDL</Link>
      </div>
      <div className="navbar-links">
        {user?.role === 'ceo' && (
          <>
            <Link to="/ceo-dashboard">CEO Dashboard</Link>
            <Link to="/procurement">Procurement</Link>
            <Link to="/sales">Sales</Link>
            <Link to="/credit-sales">Credit Sales</Link>
            <Link to="/UserManagement">UserManagement</Link>
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
            <span>Welcome, {user.email || 'User'} ({user.role || ''})</span>
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