import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sales from './pages/Sales';
import Procurement from './pages/Procurement';
import CreditSales from './pages/CreditSales';
import CEODashboard from './pages/CEODashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import SalesAgentDashboard from './pages/SalesAgentDashboard';
import Stock from './pages/Stock';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './styles.css';

// Protected Route component for role-based access
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/">Home</Link>
          {user ? (
            <>
              {user.role === 'ceo' && (
                <>
                  <Link to="/ceo-dashboard">CEO Dashboard</Link>
                  <Link to="/procurement">Procurement</Link>
                  <Link to="/sales">Sales</Link>
                  <Link to="/credit-sales">Credit Sales</Link>
                  <Link to="/stock">Stock</Link>
                </>
              )}
              {user.role === 'manager' && (
                <>
                  <Link to="/manager-dashboard">Manager Dashboard</Link>
                  <Link to="/procurement">Procurement</Link>
                  <Link to="/sales">Sales</Link>
                  <Link to="/credit-sales">Credit Sales</Link>
                  <Link to="/stock">Stock</Link>
                </>
              )}
              {user.role === 'sales_agent' && (
                <>
                  <Link to="/sales-agent-dashboard">Sales Dashboard</Link>
                  <Link to="/sales">Sales</Link>
                  <Link to="/credit-sales">Credit Sales</Link>
                  <Link to="/stock">Stock</Link>
                </>
              )}
              <button onClick={logout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to={`/${user.role}-dashboard`} />
                ) : (
                  <div className="home-container">
                    <h1>Welcome to Golden Crop</h1>
                    <p>Please login or signup to continue.</p>
                  </div>
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/ceo-dashboard"
              element={
                <ProtectedRoute allowedRoles={['ceo']}>
                  <CEODashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager-dashboard"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-agent-dashboard"
              element={
                <ProtectedRoute allowedRoles={['sales_agent']}>
                  <SalesAgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/procurement"
              element={
                <ProtectedRoute allowedRoles={['ceo', 'manager']}>
                  <Procurement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute allowedRoles={['ceo', 'manager', 'sales_agent']}>
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/credit-sales"
              element={
                <ProtectedRoute allowedRoles={['ceo', 'manager', 'sales_agent']}>
                  <CreditSales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock"
              element={
                <ProtectedRoute allowedRoles={['ceo', 'manager', 'sales_agent']}>
                  <Stock />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2025 Golden Crop Distributors Ltd. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;