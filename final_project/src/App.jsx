import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  AuthProvider from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/signup.jsx';
import CEODashboard from './pages/CEODashboard.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import SalesAgentDashboard from './pages/SalesAgentDashboard.jsx';
import Procurement from './pages/Procurement.jsx';
import Sales from './pages/Sales.jsx';
import CreditSales from './pages/CreditSales.jsx';


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
            
            <Route path="/" element={<Login />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;