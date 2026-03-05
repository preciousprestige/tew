import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./Layout.css";
const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/settings", label: "Settings" },
];
export default function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
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
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
