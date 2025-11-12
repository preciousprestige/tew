import React, { useState, useEffect } from "react";
import "./HeroSlider.css";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";

const images = [hero1, hero2];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // change every 5s
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="hero-slide"
      style={{ backgroundImage: `url(${images[index]})` }}
    >
      <div className="hero-text">
        <p>Welcome to TEW</p>
        <h1>Explore our Wide<br />Range of Collection</h1>
        <a href="#shop" className="shop-btn">Shop now</a>
      </div>
    </div>
  );
}
