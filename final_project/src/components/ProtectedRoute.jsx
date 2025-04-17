import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext  from '../context/AuthContext.jsx';

function ProtectedRoute({ role, children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;