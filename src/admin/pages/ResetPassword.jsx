import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/admin/reset/${token}`, { newPassword });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Reset failed");
    }
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Reset Password</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <label>New Password</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button type="submit">Reset Password</button>
        {message && <p className={`msg ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}
      </form>
    </div>
  );
}
