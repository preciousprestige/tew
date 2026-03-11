import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import newsletterImg from "../assets/newsletter.jpg";

const API = process.env.REACT_APP_API_URL;

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show on the Welcome page ("/")
    if (location.pathname !== "/") return;

    const dismissed = localStorage.getItem("tew_newsletter_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleClose = () => {
    localStorage.setItem("tew_newsletter_dismissed", "1");
    setShow(false);
  };

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await fetch(API + "/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSubmitted(true);
    setLoading(false);
    localStorage.setItem("tew_newsletter_dismissed", "1");
    setTimeout(() => setShow(false), 2500);
  };

  if (!show) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        zIndex: 1000, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", maxWidth: 680, width: "100%",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          overflow: "hidden", borderRadius: 4, position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: 12, right: 14, background: "none",
            border: "none", fontSize: "1.4rem", cursor: "pointer",
            color: "#999", zIndex: 2, lineHeight: 1,
          }}
        >×</button>

        {/* Image */}
        <div style={{
          backgroundImage: "url(" + newsletterImg + ")",
          backgroundSize: "cover", backgroundPosition: "center top", minHeight: 420,
        }} />

        {/* Content */}
        <div style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {!submitted ? (
            <>
              <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#c9a96e", textTransform: "uppercase", marginBottom: "0.8rem" }}>Newsletter</p>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", color: "#1a1a1a", lineHeight: 1.4, marginBottom: "1rem" }}>
                Be The First To Know
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                New drops, exclusive offers, and style updates — straight to your inbox.
              </p>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  padding: "12px 14px", border: "1px solid #e0d8d0",
                  fontSize: "0.85rem", marginBottom: "0.8rem",
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: "12px", background: "#1a1a1a", color: "#fff",
                  border: "none", cursor: "pointer", fontSize: "0.8rem",
                  letterSpacing: "2px", textTransform: "uppercase",
                }}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
              <button
                onClick={handleClose}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "0.75rem", color: "#aaa", marginTop: "0.8rem", textDecoration: "underline",
                }}
              >
                No thanks
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.2rem", color: "#1a1a1a", marginBottom: "0.5rem" }}>Thank You!</h3>
              <p style={{ fontSize: "0.85rem", color: "#666" }}>You're now on the list. Watch your inbox for exclusive updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}