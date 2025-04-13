import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">GCDL</div>
        <ul className="navbar-links">
          <li><NavLink to="/" className="navbar-link">Dashboard</NavLink></li>
          {user ? (
            <>
              <li><NavLink to="/procurement" className="navbar-link">Procurement</NavLink></li>
              <li><NavLink to="/sales" className="navbar-link">Sales</NavLink></li>
              <li><NavLink to="/credit-sales" className="navbar-link">Credit Sales</NavLink></li>
              <li><NavLink to="/stock" className="navbar-link">Stock</NavLink></li>
              <li><button onClick={logout} className="navbar-btn btn btn-secondary">Logout</button></li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" className="navbar-link">Login</NavLink></li>
              <li><NavLink to="/signup" className="navbar-link">Signup</NavLink></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;