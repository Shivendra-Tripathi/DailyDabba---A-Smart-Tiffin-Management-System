import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Wrap pages that need a logged-in user. Others get sent to /login.
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

// Wrap Login/Register so already-logged-in users skip them.
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}
