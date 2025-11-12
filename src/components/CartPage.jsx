// src/components/CartPage.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
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
            {cartItems.map((item) => {
              const id = item._id || item.id;
              const displayImg =
                Array.isArray(item.images) && item.images.length
                  ? item.images[0].startsWith("http")
                    ? item.images[0]
                    : `http://localhost:5000${item.images[0]}`
                  : item.image
                  ? item.image.startsWith("http")
                    ? item.image
                    : `http://localhost:5000${item.image}`
                  : "https://via.placeholder.com/100x120?text=No+Image";

              return (
                <div key={id} className="cart-item">
                  <img
                    src={displayImg}
                    alt={item.name}
                    style={{ width: "80px", height: "100px", objectFit: "cover" }}
                  />
                  <div>
                    <p>{item.name}</p>
                    <p>₦{item.price}</p>
                    <div className="qty-controls">
                      <button
                        onClick={() => updateQuantity(id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(id, 1)}>+</button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="checkout-section">
            <p>Subtotal: ₦{subtotal}</p>
            <input
              type="text"
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
