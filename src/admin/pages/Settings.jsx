import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import "./Products.css";
const API = process.env.REACT_APP_API_URL;

const DEFAULT_ZONES = [
  { name: "Within Abuja", fee: 10000 },
  { name: "Outside Abuja (Nigeria)", fee: 20000 },
  { name: "International", fee: 0, note: "Via contact options" },
];

// UK sizing in inches, matching TEW size chart
const DEFAULT_ROWS = [
  { size: "6",  bust: "33", waist: "25", hips: "35" },
  { size: "8",  bust: "35", waist: "28", hips: "39" },
  { size: "10", bust: "37", waist: "30", hips: "41" },
  { size: "12", bust: "39", waist: "32", hips: "43" },
  { size: "14", bust: "41", waist: "34", hips: "46" },
  { size: "16", bust: "44", waist: "36", hips: "49" },
  { size: "18", bust: "46", waist: "38", hips: "52" },
  { size: "20", bust: "48", waist: "40", hips: "55" },
];

export default function Settings() {
  const [zones, setZones] = useState(DEFAULT_ZONES);
  const [saved, setSaved] = useState(false);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [guideSaved, setGuideSaved] = useState(false);
  const [guideLoading, setGuideLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const stored = localStorage.getItem("deliveryZones");
    if (stored) setZones(JSON.parse(stored));
  }, []);

  useEffect(() => {
    fetch(API + "/sizeguide")
      .then((r) => r.json())
      .then((d) => { if (d.rows && d.rows.length > 0) setRows(d.rows); })
      .catch(() => {})
      .finally(() => setGuideLoading(false));
  }, []);

  const handleSave = () => {
    localStorage.setItem("deliveryZones", JSON.stringify(zones));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const updateZone = (i, field, value) => {
    const updated = [...zones];
    updated[i] = { ...updated[i], [field]: value };
    setZones(updated);
  };
  const addZone = () => setZones([...zones, { name: "", fee: 0 }]);
  const removeZone = (i) => setZones(zones.filter((_, idx) => idx !== i));

  const updateRow = (i, field, value) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [field]: value };
    setRows(updated);
  };
  const addRow = () => setRows([...rows, { size: "", bust: "", waist: "", hips: "" }]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const saveGuide = async () => {
    try {
      const res = await fetch(API + "/sizeguide", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ rows }),
      });
      if (res.ok) { setGuideSaved(true); setTimeout(() => setGuideSaved(false), 2000); }
    } catch {}
  };

  return (
    <div>
      <h1 className="admin-page-title">Settings</h1>

      {/* SIZE GUIDE */}
      <div style={{ background: "#fff", padding: "1.5rem", border: "1px solid #ececec", borderRadius: 4, maxWidth: 600, marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1rem", marginBottom: "0.4rem" }}>Size Guide</h3>
        <p style={{ fontSize: "0.82rem", color: "#999", marginBottom: "1.5rem" }}>
          UK sizing in inches — shown to customers on product pages.
        </p>
        {guideLoading ? <p style={{ color: "#999", fontSize: "0.85rem" }}>Loading...</p> : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginBottom: "1rem" }}>
                <thead>
                  <tr style={{ background: "#f9f6f2" }}>
                    {["Size", "Bust (in)", "Waist (in)", "Hip (in)", ""].map((h) => (
                      <th key={h} style={{
                        padding: "8px 10px", textAlign: "left", fontWeight: "normal",
                        color: "#555", borderBottom: "1px solid #e8e0d8", whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f5f0ea" }}>
                      {["size", "bust", "waist", "hips"].map((field) => (
                        <td key={field} style={{ padding: "6px 8px" }}>
                          <input
                            className="admin-input"
                            style={{ padding: "6px 8px", fontSize: "0.82rem", width: 80 }}
                            value={row[field]}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            onChange={(e) => updateRow(i, field, e.target.value)}
                          />
                        </td>
                      ))}
                      <td style={{ padding: "6px 8px" }}>
                        <button className="table-btn danger" onClick={() => removeRow(i)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button className="admin-btn-outline" onClick={addRow}>+ Add Size</button>
              <button className="admin-btn" onClick={saveGuide}>{guideSaved ? "Saved ✓" : "Save Size Guide"}</button>
            </div>
          </>
        )}
      </div>

      {/* DELIVERY FEES */}
      <div style={{ background: "#fff", padding: "1.5rem", border: "1px solid #ececec", borderRadius: 4, maxWidth: 600, marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1rem", marginBottom: "0.4rem" }}>Delivery Fees</h3>
        <p style={{ fontSize: "0.82rem", color: "#999", marginBottom: "1.5rem" }}>
          Set delivery fees by location zone. International orders should contact via WhatsApp/Instagram/Email.
        </p>
        {zones.map((zone, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.8rem", marginBottom: "0.8rem", alignItems: "center" }}>
            <input className="admin-input" placeholder="Zone name (e.g. Within Abuja)" value={zone.name} onChange={(e) => updateZone(i, "name", e.target.value)} />
            {zone.note ? (
              <input className="admin-input" value="Contact for quote" disabled style={{ color: "#999" }} />
            ) : (
              <input className="admin-input" placeholder="Fee (NGN)" type="number" value={zone.fee} onChange={(e) => updateZone(i, "fee", Number(e.target.value))} />
            )}
            <button className="table-btn danger" onClick={() => removeZone(i)} style={{ whiteSpace: "nowrap" }}>Remove</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
          <button className="admin-btn-outline" onClick={addZone}>+ Add Zone</button>
          <button className="admin-btn" onClick={handleSave}>{saved ? "Saved ✓" : "Save Changes"}</button>
        </div>
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f9f6f2", borderRadius: 4 }}>
          <p style={{ fontSize: "0.82rem", color: "#555", lineHeight: 1.7 }}>
            <strong>International shipping</strong> is handled manually via:<br />
            📸 Instagram: <a href="https://www.instagram.com/officially.tew/" target="_blank" rel="noreferrer" style={{ color: "#c9a96e" }}>@officially.tew</a><br />
            💬 WhatsApp: <a href="https://wa.me/2348068690024" target="_blank" rel="noreferrer" style={{ color: "#c9a96e" }}>+234 806 869 0024</a><br />
            📧 Email: <a href="mailto:theexquisitewoman01@gmail.com" style={{ color: "#c9a96e" }}>theexquisitewoman01@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}