import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../components/ProductGrid.css';

const categories = ['Shirts', 'Two Piece', 'Gowns'];

const dummyData = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  name: `Item ${i + 1}`,
  image: 'https://via.placeholder.com/200x250',
}));

export default function ShopByCategoryPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-section-wrapper">
      <h2 className="section-title">SHOP BY CATEGORY</h2>

      {categories.map((category, idx) => (
        <div key={idx}>
          <h3 className="section-title" style={{ fontSize: '1.4rem' }}>{category}</h3>
          <div className="horizontal-scroll-wrapper">
            <div className="product-grid">
              {dummyData.map((product) => (
                <div key={product.id} className="product-card">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <p className="product-name">{product.name}</p>
                  <div className="product-actions">
                    <button className="icon-btn eye" onClick={() => handleProductClick(product.id)}>👁</button>
                    <button className="icon-btn cart" onClick={() => addToCart(product)}>🛒</button>
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
