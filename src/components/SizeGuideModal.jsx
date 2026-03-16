import React, { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function SizeGuideModal({ onClose }) {
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    fetch(API + "/sizeguide")
      .then((r) => r.json())
      .then((d) => setGuide(d))
      .catch(() => setGuide({ rows: [] }));

    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        zIndex: 1000, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#f5f2ec", maxWidth: 580, width: "100%",
          maxHeight: "90vh", overflowY: "auto",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top bar */}
        <div style={{
          background: "#6b6b5e", padding: "0.6rem 1.2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "0.72rem", color: "#e0ddd5", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            @THE.EXQUISITEWOMAN_
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#e0ddd5", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {/* Title */}
        <div style={{ padding: "1.8rem 2rem 1rem" }}>
          <h2 style={{ fontSize: "1.2rem", letterSpacing: "1px", color: "#1a1a1a", fontWeight: "normal", margin: 0 }}>
            The Exquisite Woman — Women Size Chart
          </h2>
        </div>

        {/* Table */}
        <div style={{ padding: "0 1.5rem 1rem" }}>
          {!guide ? (
            <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>Loading...</p>
          ) : guide.rows.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>Size guide coming soon.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #c8c2b4" }}>
                  {["UK Size", "Size Variant", "Bust", "Waist", "Hips"].map((h) => (
                    <th key={h} style={{
                      padding: "10px 12px", textAlign: "left",
                      fontFamily: "Georgia, serif", fontWeight: "normal",
                      fontSize: "0.82rem", color: "#555",
                      borderBottom: "2px solid #c8c2b4",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.rows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e0dbd2" }}>
                    <td style={td}>{row.size}</td>
                    <td style={{ ...td, color: "#888" }}>{row.variant || "—"}</td>
                    <td style={td}>{row.bust}</td>
                    <td style={td}>{row.waist}</td>
                    <td style={td}>{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Measurement guide */}
        <div style={{ padding: "0.5rem 1.5rem 1.5rem" }}>
          <p style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#333", marginBottom: "0.5rem", fontFamily: "Georgia, serif" }}>
            Measurement Guide
          </p>
          <p style={{ fontSize: "0.8rem", color: "#555", lineHeight: 1.8, margin: 0 }}>
            <strong>Bust:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.<br />
            <strong>Waist:</strong> Measure around the narrowest part of your waistline.<br />
            <strong>Hips:</strong> Measure around the fullest part of your hips, keeping the tape horizontal.
          </p>
        </div>

        {/* Bottom bar */}
        <div style={{ background: "#6b6b5e", padding: "0.7rem 1.2rem", textAlign: "center" }}>
          <span style={{ fontSize: "0.72rem", color: "#e0ddd5", letterSpacing: "2px", textTransform: "uppercase" }}>
            MEASUREMENTS ARE IN INCHES AND UK FORMAT
          </span>
        </div>
      </div>
    </div>
  );
}

const td = {
  padding: "10px 12px",
  color: "#333",
};