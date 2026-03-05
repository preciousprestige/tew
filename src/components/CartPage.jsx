import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";
import { imgUrl } from "../utils/imgUrl";
export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some items to get started.</p>
        <button onClick={() => navigate("/home")}>Continue Shopping</button>
      </div>
    );
  }
  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-inner">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id + item.size} className="cart-item">
              <img src={imgUrl(item.images && item.images[0] ? item.images[0] : item.image || item.imageUrl)} alt={item.name} className="cart-item-img" />
              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                {item.size && <p className="cart-item-size">Size: {item.size}</p>}
                <p className="cart-item-price">NGN {Number(item.price).toLocaleString()}</p>
                <div className="cart-qty">
                  <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button className="cart-remove" onClick={() => removeFromCart(item._id, item.size)}>x</button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>NGN {cartTotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
          <div className="summary-row total"><span>Total</span><span>NGN {cartTotal.toLocaleString()}</span></div>
          <button className="checkout-btn" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          <button className="continue-btn" onClick={() => navigate("/home")}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}
