import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import "./Products.css";
const API = process.env.REACT_APP_API_URL;

const STATUS_COLORS = { pending: "yellow", processing: "yellow", completed: "green", cancelled: "red" };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: "Bearer " + token };

  const load = () => {
    fetch(API + "/orders", { headers }).then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : d.orders || []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(API + "/orders/" + id, { method: "PUT", headers, body: JSON.stringify({ status }) });
    const updated = await res.json();
    setOrders(prev => prev.map(o => o._id === id ? updated : o));
    if (selected && selected._id === id) setSelected(updated);
  };

  if (selected) {
    const s = selected.shippingAddress || {};
    const p = selected.paymentResult || {};
    return (
      <div>
        <button className="admin-btn-outline" style={{marginBottom:"1.5rem"}} onClick={() => setSelected(null)}>← Back to Orders</button>
        <h1 className="admin-page-title">Order #{selected._id.slice(-8).toUpperCase()}</h1>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem", marginBottom:"2rem"}}>
          <div style={{background:"#fff", padding:"1.5rem", border:"1px solid #ececec", borderRadius:4}}>
            <h3 style={{fontFamily:"Georgia,serif", fontSize:"0.95rem", letterSpacing:"1px", marginBottom:"1rem", textTransform:"uppercase"}}>Customer & Shipping</h3>
            <p style={{fontSize:"0.9rem", lineHeight:2, color:"#333"}}>
              <strong>Name:</strong> {p.name || "Guest"}<br/>
              <strong>Email:</strong> {p.email || "-"}<br/>
              <strong>Phone:</strong> {p.phone || "-"}<br/>
              <strong>Address:</strong> {s.address}<br/>
              <strong>City:</strong> {s.city}<br/>
              <strong>State:</strong> {s.state}<br/>
              {p.note && <span><strong>Note:</strong> {p.note}</span>}
            </p>
          </div>
          <div style={{background:"#fff", padding:"1.5rem", border:"1px solid #ececec", borderRadius:4}}>
            <h3 style={{fontFamily:"Georgia,serif", fontSize:"0.95rem", letterSpacing:"1px", marginBottom:"1rem", textTransform:"uppercase"}}>Order Status</h3>
            <p style={{fontSize:"0.85rem", lineHeight:2, color:"#555", marginBottom:"1rem"}}>
              <strong>Date:</strong> {new Date(selected.createdAt).toLocaleString()}<br/>
              <strong>Payment:</strong> <span className={"badge " + (selected.paid ? "green" : "red")}>{selected.paid ? "Paid" : "Unpaid"}</span><br/>
              <strong>Status:</strong> <span className={"badge " + (STATUS_COLORS[selected.status] || "yellow")}>{selected.status}</span>
            </p>
            <p style={{fontSize:"0.8rem", color:"#999", marginBottom:"0.5rem", letterSpacing:"1px", textTransform:"uppercase"}}>Update Status</p>
            <div style={{display:"flex", gap:"0.5rem", flexWrap:"wrap"}}>
              {["pending","processing","completed","cancelled"].map(s => (
                <button key={s} className={selected.status === s ? "admin-btn" : "admin-btn-outline"} 
                  style={{padding:"6px 14px", fontSize:"0.78rem", textTransform:"capitalize"}}
                  onClick={() => updateStatus(selected._id, s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{background:"#fff", padding:"1.5rem", border:"1px solid #ececec", borderRadius:4}}>
          <h3 style={{fontFamily:"Georgia,serif", fontSize:"0.95rem", letterSpacing:"1px", marginBottom:"1rem", textTransform:"uppercase"}}>Items Ordered</h3>
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              {(selected.items || []).map((item, i) => (
                <tr key={i}>
                  <td style={{display:"flex", alignItems:"center", gap:"0.8rem"}}>
                    {item.image && <img src={item.image} alt={item.name} style={{width:40, height:48, objectFit:"cover"}} />}
                    {item.name}
                  </td>
                  <td>{item.size || '-'}</td><td>{item.qty}</td>
                  <td>NGN {Number(item.price).toLocaleString()}</td>
                  <td>NGN {(item.price * item.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{textAlign:"right", marginTop:"1rem", fontSize:"0.85rem", color:"#555"}}>
            {selected.deliveryFee > 0 && <p>Delivery Fee: NGN {Number(selected.deliveryFee).toLocaleString()}</p>}
            <p style={{fontWeight:600, fontSize:"1rem", color:"#1a1a1a"}}>Total: NGN {Number(selected.totalPrice).toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      {loading ? <p>Loading...</p> : orders.length === 0 ? <p className="empty-msg">No orders yet.</p> : (
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Paid</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6)}</td>
                <td>{(order.paymentResult && order.paymentResult.name) || "Guest"}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>NGN {Number(order.totalPrice).toLocaleString()}</td>
                <td><span className={"badge " + (order.paid ? "green" : "red")}>{order.paid ? "Paid" : "Unpaid"}</span></td>
                <td><span className={"badge " + (STATUS_COLORS[order.status] || "yellow")}>{order.status}</span></td>
                <td><button className="table-btn" onClick={() => setSelected(order)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
