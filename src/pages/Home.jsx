// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Carousel from '../components/Carousel';
import ProductGrid from '../components/ProductGrid';
import ChatWidget from "../components/ChatWidget";
import '../App.css';
import './Home.css';

export default function Home() {
  const location = useLocation();

  // Scroll to section on hash change
  useEffect(() => {
    if (location.hash === '#shop') {
      const section = document.getElementById('product-sections');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    } else if (location.hash === '#about') {
      const section = document.getElementById('fashion-statement');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="home-page">
      {/* Notification Banner */}
      <div className="top-notification" id="top-notification">
        <p>
          *orders take 3-5 working days. NB for custom measurements at the checkpoint. shop for international checkouts at the contact options.*
        </p>
        <button
          className="close-notification"
          onClick={() => document.getElementById('top-notification').remove()}
        >
          &times;
        </button>
      </div>

      {/* Hero Carousel */}
      <section>
        <Carousel />
        <ChatWidget />
      </section>

      {/* Fashion Statement Section */}
      <section id="fashion-statement" className="fashion-statement">
        <h2 className="fashion-heading">About us</h2>
        <p className="fashion-text">
          Each collection is thoughtfully designed to reflect timeless elegance while embracing contemporary trends, ensuring our pieces resonate with the discerning consumer. We strive to empower individuals to express their unique identities through fashion, making every garment a statement of confidence and grace.
        </p>
      </section>

      {/* Product Grid Section */}
      <section id="product-sections">
        <ProductGrid />
      </section>
    </div>
  );
}
