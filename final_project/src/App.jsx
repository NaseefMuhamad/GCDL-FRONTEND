import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './signup';
import CEODashboard from './pages/CEODashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import SalesAgentDashboard from './pages/SalesAgentDashboard';
import Procurement from './pages/Procurement';
import Sales from './pages/Sales';
import CreditSales from './pages/CreditSales';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/ceo-dashboard"
              element={
                <ProtectedRoute role="ceo">
                  <CEODashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager-dashboard"
              element={
                <ProtectedRoute role="manager">
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-agent-dashboard"
              element={
                <ProtectedRoute role="sales_agent">
                  <SalesAgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/procurement"
              element={
                <ProtectedRoute role={['ceo', 'manager']}>
                  <Procurement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute role={['ceo', 'manager', 'sales_agent']}>
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/credit-sales"
              element={
                <ProtectedRoute role={['ceo', 'manager']}>
                  <CreditSales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Login />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;