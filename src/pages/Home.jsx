// src/Home.jsx
import React from 'react';
import Carousel from '../components/Carousel';
import ProductGrid from '../components/ProductGrid';
import ChatWidget from "../components/ChatWidget";
import '../App.css';
import './Home.css';

export default function Home() {
  const handleScrollToProducts = () => {
    const section = document.getElementById('product-sections');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };
  <section id="shop" className="your-shop-section-class">
  {/* Your shop content here */}
</section>

  return (
    <div className="home-page">
      {/* Notification Banner */}
      <div className="top-notification" id="top-notification">
        <p>
          *orders take 3-5 working days. NB for custom measurements at the checkpoint. shop for international checkouts at the contact options.*
        </p>
        <button
          className="close-notification"
          onClick={() =>
            document.getElementById('top-notification').remove()
          }
        >
          &times;
        </button>
      </div>

      {/* Carousel */}
      <Carousel />
      <ChatWidget />

      {/* Fashion Statement Section */}
      <div className="fashion-statement">
        <h2 className="fashion-heading">About us</h2>
        <p className="fashion-text">
          Each collection is thoughtfully designed to reflect timeless elegance while embracing contemporary trends, ensuring our pieces resonate with the discerning consumer. We strive to empower individuals to express their unique identities through fashion, making every garment a statement of confidence and grace.
        </p>
        <button className="shop-now-button" onClick={handleScrollToProducts}>
          Shop Now
        </button>
      </div>

      {/* Product Grid Section */}
      <div id="product-sections">
        <ProductGrid />
      </div>
    </div>
  );
}
