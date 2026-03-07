import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Layout.css";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/settings", label: "Settings" },
];

function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API = process.env.REACT_APP_API_URL;

  const handleLogin = async () => {
    if (!email || !password) { alert("Enter email and password"); return; }
    setLoading(true);
    try {
      const res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Login failed"); return; }
      if (!data.user?.isAdmin) { alert("Not an admin account"); return; }
      login(data.token, data.user);
    } catch (err) {
      alert("Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f6f2" }}>
      <div style={{ background: "#fff", padding: "2.5rem", width: 360, boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "0.3rem", color: "#1a1a1a" }}>TEW Admin</h2>
        <p style={{ fontSize: "0.82rem", color: "#999", marginBottom: "1.8rem" }}>Sign in to continue</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ display: "block", width: "100%", padding: "11px 14px", border: "1px solid #ddd", marginBottom: "1rem", fontSize: "0.9rem", boxSizing: "border-box", outline: "none" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ display: "block", width: "100%", padding: "11px 14px", border: "1px solid #ddd", marginBottom: "1.5rem", fontSize: "0.9rem", boxSizing: "border-box", outline: "none" }}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", padding: "13px", background: "#1a1a1a", color: "#fff", border: "none", fontSize: "0.82rem", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}

export default function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, token, logout, loading } = useAuth();

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  if (!token || !user?.isAdmin) return <AdminLogin />;

  return (
    <div className={"admin-layout" + (collapsed ? " collapsed" : "")}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">{collapsed ? "T" : "TEW"}</span>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>{collapsed ? ">" : "<"}</button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="sidebar-store-btn" onClick={() => navigate("/home")}>View Store</button>
        <button className="sidebar-store-btn" onClick={logout} style={{ marginTop: "0.5rem", background: "none", color: "#999", border: "1px solid #333" }}>Logout</button>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}