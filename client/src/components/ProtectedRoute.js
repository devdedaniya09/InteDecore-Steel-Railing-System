import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// role: "admin", "user", "employee"
const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();

  // Token keys stored in localStorage
  const tokens = {
    admin: localStorage.getItem("adminAccessToken"),
    user: localStorage.getItem("userToken"),
    employee: localStorage.getItem("employeeToken"),
  };

  // Redirect path based on role
  const loginRoutes = {
    admin: "/admin/login",
    user: "/Userlogin",
    employee: "/employee/login",
  };

  // If token exists for given role, allow access
  if (tokens[role]) {
    return children;
  }

  // Otherwise redirect to respective login page
  return <Navigate to={loginRoutes[role]} state={{ from: location }} replace />;
};

export default ProtectedRoute;
