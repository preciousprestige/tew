// src/admin/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyAccess = () => {
      try {
        const storedUser =
          localStorage.getItem("tew-user") || localStorage.getItem("user");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        if (user?.isAdmin) {
          setAuthorized(true);
        }
      } catch (err) {
        console.error("Error verifying admin:", err);
      } finally {
        setChecking(false);
      }
    };

    // wait a bit for localStorage to populate after login
    const timer = setTimeout(verifyAccess, 400);
    return () => clearTimeout(timer);
  }, []);

  if (checking) return null;
  return authorized ? children : <Navigate to="/admin-login" replace />;
}
