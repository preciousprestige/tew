import React, { useState } from "react";
import "./AuthModal.css";

export default function AuthModal({ type, onClose }) {
  const [authType, setAuthType] = useState(type); // "login" or "register"
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Placeholder for backend call
    alert(
      `${authType === "login" ? "Logging in" : "Registering"}:\n` +
        JSON.stringify(formData, null, 2)
    );
    onClose();
  };

  const toggleAuthType = () => {
    setAuthType((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
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

        <button className="auth-button" onClick={handleSubmit}>
          {authType === "login" ? "Login" : "Register"}
        </button>

        <p className="switch-text" onClick={toggleAuthType}>
          {authType === "login"
            ? "Don’t have an account? Register"
            : "Already have an account? Sign In"}
        </p>
      </div>
    </div>
  );
}
