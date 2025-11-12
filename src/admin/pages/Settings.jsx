import React, { useState } from "react";
import axios from "axios";
import "../../Admin.css";

export default function Settings() {
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/admin/settings",
        { oldEmail, newEmail, oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setMessage(res.data.message || "✅ Settings updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings-page">
      <h2>Account Settings</h2>

      <form onSubmit={handleSubmit} className="admin-settings-form">
        <label>Old Email</label>
        <input
          type="email"
          value={oldEmail}
          onChange={(e) => setOldEmail(e.target.value)}
          required
        />

        <label>New Email</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />

        <label>Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="status-message">{message}</p>}
      </form>

      <a href="/admin/forgot" className="forgot-link">
        Forgot details?
      </a>
    </div>
  );
}
