import React, { useState, useEffect } from "react";
import "./Dashboard.css";
const API = process.env.REACT_APP_API_URL;
export default function Analytics() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetch(API + "/orders", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json()).then((d) => setOrders(Array.isArray(d) ? d : d.orders || []));
  }, []);
  const revenue = orders.filter((o) => o.isPaid).reduce((s, o) => s + o.totalPrice, 0);
  const stats = [
    { label: "Total Revenue", value: "NGN " + revenue.toLocaleString() },
    { label: "Paid Orders", value: orders.filter((o) => o.isPaid).length },
    { label: "Pending Payment", value: orders.filter((o) => !o.isPaid).length },
    { label: "Delivered", value: orders.filter((o) => o.isDelivered).length },
  ];
  return (
    <div>
      <h1 className="admin-page-title">Analytics</h1>
      <div className="stat-cards">
        {stats.map((s) => <div key={s.label} className="stat-card"><div><p className="stat-value">{s.value}</p><p className="stat-label">{s.label}</p></div></div>)}
      </div>
    </div>
  );
}
