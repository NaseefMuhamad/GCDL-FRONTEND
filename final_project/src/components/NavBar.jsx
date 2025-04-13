import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">GCDL</div>
        <ul className="navbar-links">
          <li><NavLink to="/" className="nav-link">Dashboard</NavLink></li>
          {user ? (
            <>
              <li><NavLink to="/procurement" className="nav-link">Procurement</NavLink></li>
              <li><NavLink to="/sales" className="nav-link">Sales</NavLink></li>
              <li><NavLink to="/credit-sales" className="nav-link">Credit Sales</NavLink></li>
              <li><NavLink to="/stock" className="nav-link">Stock</NavLink></li>
              <li><button onClick={logout} className="nav-button">Logout</button></li>
            </>
          ) : (
            <li><NavLink to="/login" className="nav-link">Login</NavLink></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;