// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../utils/authUtils";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = getRoleFromToken();
  
  if (!role) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect to home or an error page if the role is not allowed
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
