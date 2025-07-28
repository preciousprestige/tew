// src/components/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (!fullName || !phone || !deliveryAddress) {
      alert('Please fill in required fields (name, phone, address)');
      return;
    }

    // Simulated order process
    alert(`Thank you ${fullName}! Your order has been placed.`);
    clearCart();
    // Redirect or reset if needed
  };

  useEffect(() => {
    const savedAddress = localStorage.getItem('tew-address');
    if (savedAddress) setDeliveryAddress(savedAddress);
  }, []);

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-form">
        <label>
          Full Name*
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
        </label>

        <label>
          Phone Number*
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
        </label>

        <label>
          Email (optional)
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>

        <label>
          Delivery Address*
          <textarea value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} />
        </label>

        <label>
          Notes to Seller
          <textarea value={note} onChange={e => setNote(e.target.value)} />
        </label>
      </div>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.id} className="summary-item">
            <img src={item.image} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <p>Qty: {item.quantity}</p>
              <p>₦{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
        <p className="subtotal">Total: ₦{subtotal}</p>
      </div>

      <button className="place-order-btn" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
}
