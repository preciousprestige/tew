import React from 'react';
import './ProductGrid.css';

export default function ProductGrid() {
  const sections = ['NEW IN', 'BEST SELLERS', 'RTW TEW'];
  const placeholderProducts = Array.from({ length: 8 });

  return (
    <div className="product-section-wrapper">
      {sections.map((sectionTitle, sectionIndex) => (
        <div key={sectionIndex} className="product-section">
          <h2 className="section-title">{sectionTitle}</h2>
          
          <div className="horizontal-scroll-wrapper">
            <div className="product-grid">
              {placeholderProducts.map((_, index) => (
                <div key={index} className="product-card">
                  <div className="product-image-placeholder" />
                  <div className="product-info">
                    <p className="product-name">Product Name</p>
                    <p className="product-price">₦0.00</p>
                    <p className="product-discount">Discount</p>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
}
