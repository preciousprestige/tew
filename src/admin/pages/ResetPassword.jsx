import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Auth.css";
const API = process.env.REACT_APP_API_URL;
export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (password !== confirm) { alert("Passwords do not match."); return; }
    if (password.length < 6) { alert("Password must be at least 6 characters."); return; }
    try {
      setLoading(true);
      const res = await fetch(API + "/auth/reset-password/" + token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      if (res.ok) { alert("Password reset successful!"); navigate("/"); }
      else { alert("Reset link may have expired."); }
    } catch { alert("Something went wrong."); }
    finally { setLoading(false); }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-page-title">Reset Password</h1>
        <input className="auth-input" type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="auth-input" type="password" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <button className="auth-button" onClick={handleSubmit} disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
      </div>
    </div>
  );
}
