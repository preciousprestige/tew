import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/forgot", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <label>Enter your admin email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {message && <p className={`msg ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}
      </form>
    </div>
  );
}
