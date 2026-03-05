import React, { useEffect, useState } from "react";
import "./Dashboard.css";
const API = process.env.REACT_APP_API_URL;
const STATUS_COLORS = { pending: "yellow", processing: "yellow", completed: "green", cancelled: "red" };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const headers = { Authorization: "Bearer " + token };
    Promise.all([
      fetch(API + "/orders", { headers }).then((r) => r.json()),
      fetch(API + "/users", { headers }).then((r) => r.json()),
      fetch(API + "/products").then((r) => r.json()),
    ]).then(([orders, users, products]) => {
      const oa = Array.isArray(orders) ? orders : orders.orders || [];
      const ua = Array.isArray(users) ? users : users.users || [];
      const pa = Array.isArray(products) ? products : products.products || [];
      const revenue = oa.filter((o) => o.paid).reduce((s, o) => s + (o.totalPrice || 0), 0);
      setStats({ orders: oa.length, users: ua.length, products: pa.length, revenue });
      setRecentOrders(oa.slice(0, 5));
    }).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Orders", value: stats ? stats.orders : "-" },
    { label: "Total Users", value: stats ? stats.users : "-" },
    { label: "Products", value: stats ? stats.products : "-" },
    { label: "Revenue", value: stats ? "NGN " + stats.revenue.toLocaleString() : "-" },
  ];

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="stat-cards">
        {cards.map((c) => <div key={c.label} className="stat-card"><div><p className="stat-value">{c.value}</p><p className="stat-label">{c.label}</p></div></div>)}
      </div>
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? <p className="empty-msg">No orders yet.</p> : (
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Paid</th><th>Status</th></tr></thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id ? order._id.slice(-6) : ""}</td>
                  <td>{(order.paymentResult && order.paymentResult.name) || "Guest"}</td>
                  <td>NGN {Number(order.totalPrice).toLocaleString()}</td>
                  <td><span className={"badge " + (order.paid ? "green" : "red")}>{order.paid ? "Paid" : "Unpaid"}</span></td>
                  <td><span className={"badge " + (STATUS_COLORS[order.status] || "yellow")}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
