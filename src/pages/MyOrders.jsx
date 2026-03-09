import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

const STATUS_COLORS = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef4444",
};

export default function MyOrders() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    fetch(API + "/orders/my", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "5rem", color: "#999" }}>Loading your orders...</div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.8rem", marginBottom: "2rem", color: "#1a1a1a" }}>
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <p style={{ color: "#999", marginBottom: "1.5rem" }}>You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/home")}
            style={{ padding: "12px 28px", background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.85rem", letterSpacing: "1px" }}
          >
            SHOP NOW
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {orders.map((order) => (
            <div key={order._id} style={{ border: "1px solid #e8e0d8", padding: "1.5rem", background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#999", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "#666" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.78rem", padding: "4px 10px", background: order.paid ? "#d1fae5" : "#fef3c7", color: order.paid ? "#065f46" : "#92400e", borderRadius: 20 }}>
                    {order.paid ? "Paid" : "Unpaid"}
                  </span>
                  <span style={{ fontSize: "0.78rem", padding: "4px 10px", background: "#f3f4f6", color: STATUS_COLORS[order.status] || "#666", borderRadius: 20, fontWeight: 600 }}>
                    {order.status || "pending"}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f0ebe4", paddingTop: "1rem" }}>
                {order.items && order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "0.8rem", alignItems: "center" }}>
                    {item.image && (
                      <img src={item.image} alt={item.name} style={{ width: 56, height: 68, objectFit: "cover", background: "#f9f6f2", flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.9rem", color: "#1a1a1a", marginBottom: "0.2rem" }}>{item.name}</p>
                      <p style={{ fontSize: "0.8rem", color: "#999" }}>
                        {item.size && `Size: ${item.size} · `}Qty: {item.qty} · NGN {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #f0ebe4", paddingTop: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "0.82rem", color: "#666" }}>
                  Delivery: {order.shippingAddress?.city || ""}{order.shippingAddress?.state ? ", " + order.shippingAddress.state : ""}
                </p>
                <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#1a1a1a" }}>
                  NGN {Number(order.totalPrice).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}