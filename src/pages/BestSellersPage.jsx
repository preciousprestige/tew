import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../components/ProductGrid.css';

const dummyData = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  name: `Best Seller ${i + 1}`,
  image: 'https://via.placeholder.com/200x250',
}));

export default function BestSellersPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ✅ use the context function

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-section-wrapper">
      <h2 className="section-title">Best Seller</h2>
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
  );
}
