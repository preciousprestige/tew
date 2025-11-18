// src/admin/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const storedUser = JSON.parse(localStorage.getItem("tew-user"));
  const token = storedUser?.token;

  if (!storedUser || !token || !storedUser.isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
