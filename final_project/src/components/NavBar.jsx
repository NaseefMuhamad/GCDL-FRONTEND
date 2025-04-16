import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">GCDL</div>
        <ul className="navbar-links">
          <li><NavLink to="/dashboard" className="nav-link">Dashboard</NavLink></li>

          {user ? (
            <>
              {(user.role === 'ceo' || user.role === 'manager') && (
                <li><NavLink to="/procurement" className="nav-link">Procurement</NavLink></li>
              )}
              {(user.role === 'ceo' || user.role === 'manager' || user.role === 'sales_agent') && (
                <>
                  <li><NavLink to="/sales" className="nav-link">Sales</NavLink></li>
                  <li><NavLink to="/credit-sales" className="nav-link">Credit Sales</NavLink></li>
                  <li><NavLink to="/stock" className="nav-link">Stock</NavLink></li>
                </>
              )}
              <li><button onClick={toggleTheme} className="theme-toggle">{theme === 'light' ? '🌙' : '☀'}</button></li>

              {/* 🔽 User Dropdown */}
              <li className="user-dropdown" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="nav-button">
                  {user.username || user.name || 'User'} ⬇
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-menu">
                    <li><NavLink to="/profile" className="dropdown-link">View Profile</NavLink></li>
                    <li><NavLink to="/settings" className="dropdown-link">Settings</NavLink></li>
                    <li><button onClick={handleLogout} className="dropdown-link">Logout</button></li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" className="nav-link">Login</NavLink></li>
              <li><NavLink to="/signup" className="nav-link">Signup</NavLink></li> {/* ✅ Added Signup link */}
              <li><button onClick={toggleTheme} className="theme-toggle">{theme === 'light' ? '🌙' : '☀'}</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
