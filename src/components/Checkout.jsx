import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { imgUrl } from "../utils/imgUrl";
import "./Checkout.css";
const API = process.env.REACT_APP_API_URL;

const CONTACT_MSG = "For international shipping, please contact us via WhatsApp (+234 806 869 0024), Instagram (@officially.tew), or Email (tewoman2022@gmail.com).";

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("deliveryZones");
    if (stored) setZones(JSON.parse(stored));
    else setZones([
      { name: "Within Abuja", fee: 10000 },
      { name: "Outside Abuja (Nigeria)", fee: 20000 },
      { name: "International", fee: 0, note: "Via contact options" },
    ]);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const deliveryFee = selectedZone && !selectedZone.note ? selectedZone.fee : 0;
  const orderTotal = cartTotal + deliveryFee;

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.address) { alert("Please fill in name, email and address."); return; }
    if (!selectedZone) { alert("Please select a delivery zone."); return; }
    if (selectedZone.note) { alert(CONTACT_MSG); return; }
    try {
      setLoading(true);
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = "Bearer " + token;
      const orderPayload = {
        customer: { name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city, state: form.state, note: form.note },
        items: cartItems.map((item) => ({
          product: item._id, name: item.name,
          image: item.images && item.images[0] ? item.images[0] : item.image || "",
          price: item.price, qty: item.quantity,
          size: item.size || ""
        })),
        totalPrice: orderTotal,
        deliveryFee,
        deliveryZone: selectedZone.name,
      };
      const res = await fetch(API + "/orders", { method: "POST", headers, body: JSON.stringify(orderPayload) });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to place order."); return; }
      clearCart();
      navigate("/home");
      alert("Order placed successfully! We will contact you shortly.");
    } catch (err) { alert("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  if (cartItems.length === 0) return <div className="checkout-empty"><h2>Your cart is empty</h2><button onClick={() => navigate("/home")}>Go Shopping</button></div>;

  return (
    <div className="checkout-page">
      {loading && <div className="spinner-overlay"><div className="spinner" /></div>}
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-inner">
        <div className="checkout-form">
          <h3>Shipping Information</h3>
          {[{name:"name",ph:"Full Name *"},{name:"email",ph:"Email Address *"},{name:"phone",ph:"Phone Number"},{name:"address",ph:"Street Address *"},{name:"city",ph:"City"},{name:"state",ph:"State"}].map((f) => (
            <input key={f.name} className="checkout-input" name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.ph} />
          ))}
          <textarea className="checkout-input" name="note" value={form.note} onChange={handleChange} placeholder="Custom measurements or order notes (optional)" rows={3} style={{resize:"vertical"}} />

          <h3 style={{marginTop:"1.5rem"}}>Delivery Zone</h3>
          <div style={{display:"flex", flexDirection:"column", gap:"0.6rem", marginBottom:"1rem"}}>
            {zones.map((zone, i) => (
              <label key={i} style={{display:"flex", alignItems:"center", gap:"0.8rem", padding:"0.8rem 1rem", border:"1px solid " + (selectedZone === zone ? "#1a1a1a" : "#ddd"), cursor:"pointer", fontSize:"0.88rem"}}>
                <input type="radio" name="zone" style={{accentColor:"#1a1a1a"}} onChange={() => setSelectedZone(zone)} />
                <span style={{flex:1}}>{zone.name}</span>
                <span style={{color: zone.note ? "#c9a96e" : "#1a1a1a", fontWeight:600}}>
                  {zone.note ? "Contact for quote" : "NGN " + Number(zone.fee).toLocaleString()}
                </span>
              </label>
            ))}
          </div>
          {selectedZone && selectedZone.note && (
            <div style={{background:"#f9f6f2", padding:"1rem", fontSize:"0.82rem", color:"#555", lineHeight:1.7, marginBottom:"1rem"}}>
              📸 <a href="https://www.instagram.com/officially.tew/" target="_blank" rel="noreferrer" style={{color:"#c9a96e"}}>@officially.tew</a> &nbsp;
              💬 <a href="https://wa.me/2348068690024" target="_blank" rel="noreferrer" style={{color:"#c9a96e"}}>WhatsApp</a> &nbsp;
              📧 <a href="mailto:tewoman2022@gmail.com" style={{color:"#c9a96e"}}>tewoman2022@gmail.com</a>
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id + item.size} className="checkout-item">
              <span>{item.name} {item.size ? "(" + item.size + ")" : ""} x {item.quantity}</span>
              <span>NGN {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          {deliveryFee > 0 && (
            <div className="checkout-item"><span>Delivery ({selectedZone.name})</span><span>NGN {deliveryFee.toLocaleString()}</span></div>
          )}
          <div className="checkout-total"><span>Total</span><span>NGN {orderTotal.toLocaleString()}</span></div>
          {(!selectedZone || !selectedZone.note) && (
            <button className="pay-btn" onClick={handleSubmit} disabled={loading}>{loading ? "Processing..." : "Place Order"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
