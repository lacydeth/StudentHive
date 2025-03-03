// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../utils/authUtils";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = getRoleFromToken();
  
  if (!role) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
