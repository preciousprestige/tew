import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
const API = process.env.REACT_APP_API_URL;
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await fetch(API + "/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) setSent(true); else alert("Email not found.");
    } catch { alert("Something went wrong."); }
    finally { setLoading(false); }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-page-title">Forgot Password</h1>
        {sent ? <p className="auth-success">Reset link sent! Check your email.</p> : (
          <>
            <p className="auth-subtitle">Enter your email to receive a reset link.</p>
            <input className="auth-input" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="auth-button" onClick={handleSubmit} disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
          </>
        )}
        <Link to="/" className="auth-back">Back to Home</Link>
      </div>
    </div>
  );
}
