import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SalesAgentDashboard from './pages/SalesAgentDashboard';
import CEODashboard from './pages/CEODashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Procurement from './pages/Procurement';
import Sales from './pages/Sales';
import CreditSales from './pages/CreditSales';
import Stock from './pages/Stock';
import Login from './Pages/Login';

const App = () => {
  const { user } = useAuth();
  console.log('App: user=', user); // Debug log

  const getDashboardRoute = () => {
    if (!user || !user.role) {
      console.log('App: No user or role, redirecting to login');
      return <Navigate to="/login" />;
    }
    console.log('App: user.role=', user.role);
    switch (user.role) {
      case 'ceo':
        return <CEODashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'sales_agent':
        return <SalesAgentDashboard />;
      default:
        console.log('App: Unknown role, redirecting to login');
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute>{getDashboardRoute()}</ProtectedRoute>}
        />
        <Route
          path="/procurement"
          element={<ProtectedRoute><Procurement /></ProtectedRoute>}
        />
        <Route
          path="/sales"
          element={<ProtectedRoute><Sales /></ProtectedRoute>}
        />
        <Route
          path="/credit-sales"
          element={<ProtectedRoute><CreditSales /></ProtectedRoute>}
        />
        <Route
          path="/stock"
          element={<ProtectedRoute><Stock /></ProtectedRoute>}
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;