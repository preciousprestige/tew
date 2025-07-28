import React, { useState } from "react";
import "./Header.css";
import AuthModal from "./AuthModal";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [authModalType, setAuthModalType] = useState(null); // 'login' or 'register'

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path, scrollToSelector) => {
    setMenuOpen(false);

    const scrollAfterNav = () => {
      setTimeout(() => {
        const el = document.querySelector(scrollToSelector);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // Delay to allow page render
    };

    if (location.pathname !== path) {
      navigate(path);
      if (scrollToSelector) {
        setTimeout(scrollAfterNav, 100);
      }
    } else if (scrollToSelector) {
      scrollAfterNav();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOpenModal = (type) => {
    setAuthModalType(type);
    setShowAccountDropdown(false);
  };

  return (
    <>
      {authModalType && (
        <AuthModal
          type={authModalType}
          onClose={() => setAuthModalType(null)}
        />
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
              <li onClick={() => handleNavigate("/", "#shop")}>SHOP</li>
              <li onClick={() => handleNavigate("/", ".collection-intro")}>
                ABOUT US
              </li>
              <li onClick={() => setShowAccountDropdown(!showAccountDropdown)}>
                Account
                {showAccountDropdown && (
                  <div className="account-dropdown">
                    <p onClick={() => handleOpenModal("login")}>SIGN IN</p>
                    <p onClick={() => handleOpenModal("register")}>
                      REGISTER
                    </p>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="header-center">TEW</div>

        <div className="header-right">
          <div className="cart-icon" onClick={() => navigate("/cart")}>🛒 <span>{cartCount}</span>
      </div>
        </div>
      </header>
    </>
  );
}
