import { Navigate } from 'react-router-dom';

/**
 * Wraps routes that require admin authentication.
 * If no JWT token is found in localStorage, redirects to /admin.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default ProtectedRoute;
