import React, { useEffect, useState, useCallback } from "react";
import { BarChart3 } from "lucide-react";
import "../../Admin.css";
import AdminMessages from "./AdminMessages";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [newFee, setNewFee] = useState("");
  const [message, setMessage] = useState("");

  const logout = useCallback(() => {
    localStorage.removeItem("tew-user");
    window.location.href = "/admin-login";
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("tew-user"));
    const token = storedUser?.token;
    if (!storedUser || !storedUser.isAdmin || !token) {
      logout();
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Invalid or expired token");
        const data = await res.json();
        // profile endpoint may return user or { user }
        setAdmin(data.user || data);
      } catch (err) {
        console.error("Token validation failed:", err.message);
        logout();
      }
    };

    validateToken();
    loadDeliverySettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout]);

  const loadDeliverySettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      const data = await res.json();
      if (data) {
        setDeliveryFee(data.deliveryFee || 0);
        setLocations(data.locations || []);
      }
    } catch (err) {
      console.error("Failed to load delivery settings:", err);
    }
  };

  const handleAddLocation = () => {
    if (!newLocation || !newFee) return;
    setLocations([...locations, { name: newLocation.trim(), fee: Number(newFee) }]);
    setNewLocation("");
    setNewFee("");
  };

  const handleRemoveLocation = (index) => {
    const updated = [...locations];
    updated.splice(index, 1);
    setLocations(updated);
  };

  const handleDeliverySave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("tew-user"));
      const token = storedUser?.token;
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryFee, locations }),
      });

      if (res.ok) {
        setMessage("✅ Delivery settings updated successfully!");
      } else {
        const err = await res.json();
        throw new Error(err.message || "Failed to update settings");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Could not save delivery settings");
    }
  };

  if (!admin) return <div className="loading-screen">Checking session...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-semibold text-[#b8860b] mb-6">
        Welcome, {admin.name || "Exquisite Admin"}
      </h1>

      {/* ✅ Admin Chat Box Section (container added) */}
      <div
        style={{
          border: "1px solid #e0d6c5",
          borderRadius: "10px",
          padding: "20px",
          background: "#fffaf5",
          marginBottom: "50px",
        }}
      >
        <h2 className="text-2xl text-[#a17c4d] mb-3 font-semibold">
          💬 Customer Live Messages
        </h2>
        <AdminMessages />
      </div>

      {/* --- Delivery Fee Section --- */}
      <div className="admin-settings-form" style={{ marginBottom: "50px" }}>
        <h3 style={{ marginBottom: "15px", color: "#a17c4d" }}>Delivery Fee Settings</h3>

        <label>Default Delivery Fee (₦)</label>
        <input
          type="number"
          value={deliveryFee}
          onChange={(e) => setDeliveryFee(Number(e.target.value))}
        />

        <div style={{ marginTop: "20px" }}>
          <h4>Location-specific Fees</h4>
          {locations.length === 0 && (
            <p style={{ color: "#888", fontSize: "0.9em" }}>No custom locations added yet.</p>
          )}
          {locations.map((loc, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>
                {loc.name} — ₦{loc.fee}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveLocation(idx)}
                style={{
                  background: "#b54a4a",
                  color: "#fff",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Location name"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="number"
            placeholder="Fee"
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            style={{ width: "120px", marginRight: "10px" }}
          />
          <button
            type="button"
            onClick={handleAddLocation}
            style={{
              background: "#a17c4d",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "5px",
              border: "none",
            }}
          >
            Add
          </button>
        </div>

        <button
          type="button"
          onClick={handleDeliverySave}
          style={{
            marginTop: "20px",
            background: "#a17c4d",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "6px",
            border: "none",
          }}
        >
          Save Delivery Settings
        </button>
        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </div>

      {/* --- Analytics Box --- */}
      <div className="analytics-box" style={{ marginBottom: "50px" }}>
        <div className="card-header">
          <BarChart3 size={28} />
          <h2>Analytics</h2>
        </div>
        <p>View your sales, order trends, and performance metrics. (Coming soon)</p>
      </div>
    </div>
  );
}
