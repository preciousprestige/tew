// src/components/AuthModal.jsx
import React, { useState } from "react";
import "./AuthModal.css";

export default function AuthModal({ type, onClose }) {
  const [authType, setAuthType] = useState(type);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const url =
        authType === "login"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/register";

      const payload =
        authType === "login"
          ? { email: formData.email, password: formData.password }
          : {
              name: formData.fullName,
              email: formData.email,
              password: formData.password,
            };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      if (authType === "login") {
        // ✅ FIXED: Store token INSIDE tew-user (admin expects this)
        localStorage.setItem(
          "tew-user",
          JSON.stringify({
            ...data.user,
            token: data.token,
          })
        );

        alert("Login successful ✅");

        setTimeout(() => {
          if (data.user?.isAdmin) {
            window.location.href = "/admin";
          } else {
            window.location.href = "/home";
          }
        }, 300);
      } else {
        alert("Registration successful ✅");
        setAuthType("login");
      }

      onClose();
    } catch (err) {
      console.error("Auth error:", err);
      alert(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthType = () => {
    setAuthType((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <>
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="auth-modal">
        <div className="auth-box">
          <p className="close-btn" onClick={onClose}>
            ×
          </p>

          <h2 className="auth-title">
            {authType === "login" ? "Sign In" : "Register"}
          </h2>

          {authType === "register" && (
            <>
              <input
                className="auth-input"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
              />
              <input
                className="auth-input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </>
          )}

          <input
            className="auth-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
          <input
            className="auth-input"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />

          <button
            className="auth-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {authType === "login" ? "Login" : "Register"}
          </button>

          <p className="switch-text" onClick={toggleAuthType}>
            {authType === "login"
              ? "Don’t have an account? Register"
              : "Already have an account? Sign In"}
          </p>
        </div>
      </div>
    </>
  );
}
