import React from "react";
import { Navigate } from "react-router-dom";

const FlowProtectedRoute = ({ condition, redirectTo = "/", children }) => {
  if (!condition) return <Navigate to={redirectTo} replace />;
  return children;
};

export default FlowProtectedRoute;
