import React from 'react';
import './ProductGrid.css';
import { useCart } from '../context/CartContext';


export default function ProductGrid() {
  const sections = ['NEW IN', 'BEST SELLERS', 'RTW TEW'];
  const { addToCart } = useCart();

  // Fake product data (use until backend is connected)
  const placeholderProducts = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: 5000 + i * 1000,
    discount: i % 2 === 0 ? '10% OFF' : '',
    image: 'https://via.placeholder.com/200x250', // You can replace this with a local or TEW-style image later
  }));

  return (
    <div className="product-section-wrapper">
      {sections.map((sectionTitle, sectionIndex) => (
        <div key={sectionIndex} className="product-section">
          <h2 className="section-title">{sectionTitle}</h2>

          <div className="horizontal-scroll-wrapper">
            <div className="product-grid">
              {placeholderProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">₦{product.price.toLocaleString()}</p>
                    <p className="product-discount">{product.discount}</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      🛒
                    </button>
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
