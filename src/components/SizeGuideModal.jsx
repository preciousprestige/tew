import React, { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function SizeGuideModal({ onClose }) {
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    fetch(API + "/sizeguide")
      .then((r) => r.json())
      .then((d) => setGuide(d))
      .catch(() => setGuide({ rows: [] }));

    // Close on escape key
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "2rem" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.3rem", color: "#1a1a1a" }}>Size Guide</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#999", lineHeight: 1 }}>×</button>
        </div>

        <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          All measurements are in centimetres (cm). For the best fit, measure your body and compare to the chart below.
        </p>

        {!guide ? (
          <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>Loading...</p>
        ) : guide.rows.length === 0 ? (
          <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>Size guide coming soon.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ background: "#f9f6f2" }}>
                <th style={th}>Size</th>
                <th style={th}>Bust (cm)</th>
                <th style={th}>Waist (cm)</th>
                <th style={th}>Hips (cm)</th>
                {guide.rows.some(r => r.notes) && <th style={th}>Notes</th>}
              </tr>
            </thead>
            <tbody>
              {guide.rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f0ebe4", background: i % 2 === 0 ? "#fff" : "#fdfbf9" }}>
                  <td style={{ ...td, fontWeight: 600, color: "#1a1a1a" }}>{row.size}</td>
                  <td style={td}>{row.bust}</td>
                  <td style={td}>{row.waist}</td>
                  <td style={td}>{row.hips}</td>
                  {guide.rows.some(r => r.notes) && <td style={{ ...td, color: "#888", fontSize: "0.8rem" }}>{row.notes}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f9f6f2", fontSize: "0.8rem", color: "#888", lineHeight: 1.7 }}>
          <strong style={{ color: "#555" }}>How to measure:</strong><br />
          <strong>Bust</strong> — Measure around the fullest part of your chest.<br />
          <strong>Waist</strong> — Measure around your natural waistline.<br />
          <strong>Hips</strong> — Measure around the fullest part of your hips.
        </div>
      </div>
    </div>
  );
}

const th = {
  padding: "10px 14px",
  textAlign: "left",
  fontFamily: "Georgia, serif",
  fontWeight: "normal",
  fontSize: "0.8rem",
  letterSpacing: "0.5px",
  color: "#555",
  borderBottom: "2px solid #e8e0d8",
};

const td = {
  padding: "10px 14px",
  color: "#444",
};