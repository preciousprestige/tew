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
          background: "#f5f2ec", maxWidth: 540, width: "100%",
          maxHeight: "90vh", overflowY: "auto",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Header bar */}
        <div style={{
          background: "#6b6b5e", padding: "0.6rem 1.2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "0.75rem", color: "#e0ddd5", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            @THE.EXQUISITEWOMAN_
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#e0ddd5", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}
          >×</button>
        </div>

        {/* Title */}
        <div style={{ padding: "2rem 2rem 1.2rem", textAlign: "center" }}>
          <h2 style={{
            fontSize: "1.3rem", letterSpacing: "2px", color: "#1a1a1a",
            textTransform: "uppercase", fontWeight: "normal", margin: 0,
          }}>
            THE EXQUISITE WOMAN SIZE CHART
          </h2>
        </div>

        {/* Table */}
        <div style={{ padding: "0 1.5rem 1rem" }}>
          {!guide ? (
            <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>Loading...</p>
          ) : guide.rows.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>Size guide coming soon.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr>
                  {["SIZE", "BUST", "WAIST", "HIP"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 10px", textAlign: "center",
                      background: "#c8c2b4", color: "#1a1a1a",
                      fontFamily: "Georgia, serif", fontWeight: "bold",
                      fontSize: "0.85rem", letterSpacing: "1px",
                      border: "1px solid #b8b2a4",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.rows.map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...td, background: "#c8c2b4", fontWeight: "bold", color: "#1a1a1a", border: "1px solid #b8b2a4" }}>
                      {row.size}
                    </td>
                    <td style={{ ...td, background: "#f5f2ec", border: "1px solid #d8d2c4" }}>{row.bust}</td>
                    <td style={{ ...td, background: "#f5f2ec", border: "1px solid #d8d2c4" }}>{row.waist}</td>
                    <td style={{ ...td, background: "#f5f2ec", border: "1px solid #d8d2c4" }}>{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer bar */}
        <div style={{
          background: "#6b6b5e", padding: "0.7rem 1.2rem", textAlign: "center",
          marginTop: "0.5rem",
        }}>
          <span style={{ fontSize: "0.72rem", color: "#e0ddd5", letterSpacing: "2px", textTransform: "uppercase" }}>
            MEASUREMENTS ARE IN INCHES AND UK FORMAT
          </span>
        </div>
      </div>
    </div>
  );
}

const td = {
  padding: "11px 10px",
  textAlign: "center",
  color: "#333",
};