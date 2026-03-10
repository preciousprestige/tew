import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import logo from "../assets/tew-logo.png";
import "./Header.css";
export default function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/home" style={{display:"flex",alignItems:"center",gap:"0.6rem",textDecoration:"none"}}><img src={logo} alt="TEW" className="header-logo-img" /><span style={{fontFamily:"Georgia,serif",fontSize:"1rem",color:"#1a1a1a",letterSpacing:"1px",whiteSpace:"nowrap"}}>The Exquisite Woman</span></Link>
          <nav className={"nav-links" + (menuOpen ? " open" : "")}>
            <Link to="/home" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</Link>
            {user ? (
              <><Link to="/my-orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <button className="nav-btn" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button></>
            ) : (
              <>
                <button className="nav-btn" onClick={() => { setAuthType("login"); setShowAuth(true); }}>Sign In</button>
                <button className="nav-btn nav-btn-filled" onClick={() => { setAuthType("register"); setShowAuth(true); }}>Register</button>
              </>
            )}
          </nav>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
        </div>
      </header>
      {showAuth && <AuthModal type={authType} onClose={() => setShowAuth(false)} />}
    </>
  );
}
