import React, { useEffect, useState } from "react";
import "./Carousel.css";

// Temporary placeholder images (you'll replace these later)
import img1 from "../assets/intro1.jpg";
import img2 from "../assets/intro2.jpg";

const images = [img1, img2];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSwipe = (dir) => {
    if (dir === "left") {
      setCurrent((prev) => (prev + 1) % images.length);
    } else if (dir === "right") {
      setCurrent((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div
      className="carousel"
      onTouchStart={(e) => (window.startX = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const endX = e.changedTouches[0].clientX;
        if (window.startX - endX > 50) handleSwipe("left");
        else if (endX - window.startX > 50) handleSwipe("right");
      }}
    >
      {images.map((img, index) => (
        <div
          key={index}
          className={`carousel-image ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
    </div>
  );
}
