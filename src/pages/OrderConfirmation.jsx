import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const API = process.env.REACT_APP_API_URL;

export default function OrderConfirmation() {
  const { id } = useParams();
  const { token } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    fetch(API + "/orders/" + id, { headers })
      .then((r) => r.json())
      .then((d) => setOrder(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "5rem", color: "#999" }}>Loading your order...</div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: order?.paid ? "#d1fae5" : "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.8rem" }}>
          {order?.paid ? "✓" : "⏳"}
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.8rem", marginBottom: "0.8rem", color: "#1a1a1a" }}>
          {order?.paid ? "Order Confirmed!" : "Order Received"}
        </h1>
        <p style={{ color: "#666", fontSize: "0.95rem", lineHeight: 1.6 }}>
          {order?.paid
            ? "Your payment was successful. We'll begin processing your order right away."
            : "Your order has been placed. Payment confirmation may take a moment."}
        </p>
      </div>

      {order && (
        <div style={{ border: "1px solid #e8e0d8", padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
          <p style={{ fontSize: "0.75rem", color: "#999", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "1rem" }}>
            Order #{order._id?.slice(-8).toUpperCase()}
          </p>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem", fontSize: "0.9rem" }}>
              <span style={{ color: "#333" }}>{item.name} {item.size ? `(${item.size})` : ""} × {item.qty}</span>
              <span style={{ color: "#1a1a1a" }}>NGN {Number(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #f0ebe4", marginTop: "0.8rem", paddingTop: "0.8rem", display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
            <span>Total</span>
            <span>NGN {Number(order.totalPrice).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => navigate("/my-orders")}
          style={{ padding: "12px 24px", background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.82rem", letterSpacing: "1px" }}
        >
          VIEW MY ORDERS
        </button>
        <button
          onClick={() => navigate("/home")}
          style={{ padding: "12px 24px", background: "transparent", color: "#1a1a1a", border: "1px solid #1a1a1a", cursor: "pointer", fontSize: "0.82rem", letterSpacing: "1px" }}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
}