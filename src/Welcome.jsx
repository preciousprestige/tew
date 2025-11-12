import React, { useState, useEffect } from "react";
import hero1 from "./assets/images/hero1.png";
import hero2 from "./assets/images/hero2.png";
import "./Welcome.css";
import { useNavigate } from "react-router-dom";

const images = [hero1, hero2];

export default function Welcome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="welcome-hero"
      style={{ backgroundImage: `url(${images[currentIndex]})` }}
    >
      <div className="hero-overlay">
        <h4 className="hero-subheading"> The Exquisite Woman </h4>
        <h1 className="hero-heading">Explore our Wide<br />Range of Collections</h1>
        <button className="hero-btn" onClick={() => navigate("/home")}>
          Shop now
        </button>
      </div>
    </div>
  );
}
