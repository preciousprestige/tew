import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./components/AuthModal";
import NotificationBar from "./components/NotificationBar";
import logo from "./assets/tew-logo.png";
import hero1 from "./assets/images/hero1.png";
import hero2 from "./assets/images/hero2.png";
import intro1 from "./assets/intro1.jpg";
import intro2 from "./assets/intro2.jpg";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState("login");
  return (
    <div className="welcome">
      <NotificationBar />
      <nav className="welcome-nav">
        <img src={logo} alt="TEW" className="welcome-logo-img" />
        <div className="welcome-nav-links">
          <button onClick={() => { setAuthType("login"); setShowAuth(true); }}>Sign In</button>
          <button className="filled" onClick={() => navigate("/home")}>Shop Now</button>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-text">
          <p className="hero-tag">New Collection</p>
          <h1 className="hero-title">The Exquisite Woman</h1>
          <p className="hero-sub">Curated fashion for the modern woman. Elegant, bold, and uniquely you.</p>
          <div className="hero-ctas">
            <button className="cta-primary" onClick={() => navigate("/home")}>Shop Collection</button>
            <button className="cta-secondary" onClick={() => { setAuthType("register"); setShowAuth(true); }}>Join TEW</button>
          </div>
        </div>
        <div className="hero-images">
          <img src={hero1} alt="TEW Collection" className="hero-img-1" />
          <img src={hero2} alt="TEW Style" className="hero-img-2" />
        </div>
      </section>
      <section className="intro-section">
        <div className="intro-grid">
          <img src={intro1} alt="TEW Style 1" className="intro-img" />
          <img src={intro2} alt="TEW Style 2" className="intro-img" />
        </div>
      </section>
      <section className="welcome-features">
        {[{title:"Curated Style",desc:"Hand-picked pieces for the modern woman"},{title:"Quality First",desc:"Premium fabrics and expert craftsmanship"},{title:"Easy Returns",desc:"Hassle-free returns within 14 days"}].map((f) => (
          <div key={f.title} className="feature-item"><h3>{f.title}</h3><p>{f.desc}</p></div>
        ))}
      </section>
      {showAuth && <AuthModal type={authType} onClose={() => setShowAuth(false)} />}
    </div>
  );
}
