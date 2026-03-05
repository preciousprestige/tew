import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch(API + "/auth/profile", { headers: { Authorization: "Bearer " + token } });
        if (res.ok) { const data = await res.json(); setUser(data); } else { logout(); }
      } catch { logout(); } finally { setLoading(false); }
    };
    fetchProfile();
  }, [token]);
  const login = (tok, userData) => { localStorage.setItem("token", tok); setToken(tok); setUser(userData); };
  const logout = () => { localStorage.removeItem("token"); setToken(null); setUser(null); };
  return <AuthContext.Provider value={{ user, token, login, logout, loading }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
