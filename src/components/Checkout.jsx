import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import "./Checkout.css";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [location, setLocation] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (location) {
      axios
        .get(`http://localhost:5000/api/settings/delivery?location=${location}`)
        .then((res) => setDeliveryFee(res.data.fee || 0))
        .catch(() => setDeliveryFee(0));
    }
  }, [location]);

  const handlePlaceOrder = async () => {
    if (!fullName || !phone || !deliveryAddress) {
      alert("Please fill all required fields (Name, Phone, Address)");
      return;
    }

    const orderData = {
      customer: {
        name: fullName,
        phone,
        email,
        address: deliveryAddress,
        city: location,
        note,
      },
      items: cartItems.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.quantity,
      })),
      totalPrice: subtotal,
      deliveryFee,
    };

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/orders", orderData);
      if (res.status === 201) {
        alert(`✅ Thank you ${fullName}! Your order has been placed successfully.`);
        clearCart();
      }
    } catch (err) {
      console.error("❌ Order error:", err);
      alert("There was a problem placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-form">
        <label>
          Full Name*
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>
        <label>
          Phone Number*
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          City / Location*
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label>
          Delivery Address*
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </label>
        <label>
          Notes
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {cartItems.map((item, i) => (
          <div key={i} className="summary-item">
            <img
              src={item.image?.startsWith("http")
                ? item.image
                : `http://localhost:5000${item.image}`}
              alt={item.name}
              width="70"
              height="90"
              style={{ objectFit: "cover" }}
            />
            <div>
              <p>{item.name}</p>
              <p>Qty: {item.quantity}</p>
              <p>₦{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
        <p>Subtotal: ₦{subtotal}</p>
        <p>Delivery Fee: ₦{deliveryFee}</p>
        <h3>Total: ₦{total}</h3>
      </div>

      <button
        className="place-order-btn"
        disabled={loading}
        onClick={handlePlaceOrder}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
