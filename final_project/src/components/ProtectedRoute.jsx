import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user || user.role !== allowedRole) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;