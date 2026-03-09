import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";
export default function AuthModal({ type, onClose }) {
  const [authType, setAuthType] = useState(type);
  const [formData, setFormData] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const API = process.env.REACT_APP_API_URL;
      const url = authType === "login" ? API + "/auth/login" : API + "/auth/register";
      const payload = authType === "login"
        ? { email: formData.email, password: formData.password }
        : { name: formData.fullName, email: formData.email, password: formData.password };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      let data; try { data = await res.json(); } catch { alert("Server is starting up, please wait 30 seconds and try again."); return; }
      if (!res.ok) { alert(data.msg || data.message || "Something went wrong"); return; }
      if (data.token) {
        login(data.token, data.user);
        onClose();
        if (data.user && data.user.isAdmin) {
          navigate("/admin");
        }
      } else {
        onClose();
      }
    } catch (err) { alert(err.message || "Server error"); }
    finally { setLoading(false); }
  };
  return (
    <>
      {loading && <div className="spinner-overlay"><div className="spinner"></div></div>}
      <div className="auth-modal">
        <div className="auth-box">
          <p className="close-btn" onClick={onClose}>x</p>
          <h2 className="auth-title">{authType === "login" ? "Sign In" : "Register"}</h2>
          {authType === "register" && (
            <>
              <input className="auth-input" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
              <input className="auth-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
            </>
          )}
          <input className="auth-input" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
          <input className="auth-input" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
          <button className="auth-button" onClick={handleSubmit} disabled={loading}>{authType === "login" ? "Login" : "Register"}</button>
          <p className="switch-text" onClick={() => setAuthType(authType === "login" ? "register" : "login")}>
            {authType === "login" ? "No account? Register" : "Have an account? Sign In"}
          </p>
        </div>
      </div>
    </>
  );
}
