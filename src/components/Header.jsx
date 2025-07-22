// src/components/Header.jsx
import React, { useState } from "react";
import { FaInstagram, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import "./Header.css";

export default function Header({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="tew-header">
      <div className="header-left">
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776;
        </div>
        {menuOpen && (
          <div className="side-menu">
            <a
              href="https://www.instagram.com/the.exquisitewoman_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram style={{ color: "#E1306C", fontSize: "20px" }} />
            </a>
            <a href="mailto:theexquisitewoman01@gmail.com">
              <FaEnvelope style={{ color: "#D44638", fontSize: "20px" }} />
            </a>
            <a
              href="https://wa.me/message/A4SGQYD3CYY4B1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp style={{ color: "#25D366", fontSize: "20px" }} />
            </a>
          </div>
        )}
      </div>

      <div className="header-center">TEW</div>

      <div className="header-right">
        <div className="cart-icon">
          🛒
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
      </div>
    </header>
  );
}
