import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../Admin.css";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
    { name: "Products", icon: <Package size={18} />, path: "/admin/products" },
    { name: "Orders", icon: <ShoppingCart size={18} />, path: "/admin/orders" },
    { name: "Users", icon: <Users size={18} />, path: "/admin/users" },
    { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <div className="sidebar">
      <div>
        {/* Logo */}
        <div className="sidebar-logo">
          <h1>TEW ADMIN</h1>
        </div>

        {/* Menu */}
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`sidebar-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout */}
      <div className="sidebar-logout">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
