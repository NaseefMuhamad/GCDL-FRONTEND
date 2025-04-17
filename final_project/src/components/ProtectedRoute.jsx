import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const context = useContext(AuthContext);
  const { user } = context || { user: null };

  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;