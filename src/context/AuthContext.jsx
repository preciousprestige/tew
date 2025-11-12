// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ Load saved user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("tew-admin-user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ✅ Login handler
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("tew-admin-user", JSON.stringify(userData));
  };

  // ✅ Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem("tew-admin-user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
