// src/components/Footer.jsx
import React, { useEffect, useState } from "react";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa"; // 👈 import icons
import "./Footer.css";

export default function Footer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const abujaTime = time.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  });

  return (
    <footer className="tew-footer">
      <div className="footer-left">@TEW 2025</div>

      <div className="footer-center">
        <div>Abuja</div>
        <div>{abujaTime}</div>
      </div>

      <div className="footer-right">
        <a
          href="https://www.instagram.com/the.exquisitewoman_"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
        <a href="mailto:theexquisitewoman01@gmail.com">
          <FaEnvelope />
        </a>
        <a
          href="https://wa.me/message/A4SGQYD3CYY4B1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp />
        </a>
      </div>
    </footer>
  );
}
