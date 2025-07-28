// src/components/CartPage.jsx
import React, { useState } from "react";
import { useCart } from '../context/CartContext';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p>₦{item.price}</p>
                  <div className="qty-controls">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-section">
            <p>Subtotal: ₦{subtotal}</p>
            <input
              type="text"
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
  Proceed to Checkout
</button>
          </div>
        </>
      )}
    </div>
  );
}
