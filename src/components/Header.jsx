import React, { useState } from "react";
import "./Header.css";
import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";
import logo from "../assets/tew-logo.png";

export default function Header({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [authModalType, setAuthModalType] = useState(null);

  const navigate = useNavigate();

  // Smooth scroll within same page
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    } else {
      // if not found (like when user is not on /home), navigate first then scroll
      navigate("/home");
      setTimeout(() => {
        const elRetry = document.getElementById(id);
        if (elRetry) elRetry.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  // Handle route navigation
  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleOpenModal = (type) => {
    setAuthModalType(type);
    setShowAccountDropdown(false);
  };

  return (
    <>
      {authModalType && (
        <AuthModal type={authModalType} onClose={() => setAuthModalType(null)} />
      )}

      <header className="tew-header">
        <div className="header-left">
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="bar top"></div>
            <div className="bar middle"></div>
            <div className="bar bottom"></div>
          </div>

          <div className={`hamburger-menu ${menuOpen ? "open" : ""}`}>
            <ul>
              <li onClick={() => handleNavigate("/")}>HOME</li>
              <li onClick={() => scrollToSection("product-sections")}>SHOP</li>
              <li onClick={() => scrollToSection("fashion-statement")}>ABOUT US</li>
              <li onClick={() => setShowAccountDropdown(!showAccountDropdown)}>
                Account
                {showAccountDropdown && (
                  <div className="account-dropdown">
                    <p onClick={() => handleOpenModal("login")}>SIGN IN</p>
                    <p onClick={() => handleOpenModal("register")}>REGISTER</p>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="header-center">
          <img src={logo} alt="TEW Logo" className="tew-logo" />
        </div>

        <div className="header-right">
          <div className="cart-icon" onClick={() => handleNavigate("/cart")}>
            🛒 <span>{cartCount}</span>
          </div>
        </div>
      </header>
    </>
  );
}
