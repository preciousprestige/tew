import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import "./Products.css";
const API = process.env.REACT_APP_API_URL;

const DEFAULT_ZONES = [
  { name: "Within Abuja", fee: 10000 },
  { name: "Outside Abuja (Nigeria)", fee: 20000 },
  { name: "International", fee: 0, note: "Via contact options" },
];

export default function Settings() {
  const [zones, setZones] = useState(DEFAULT_ZONES);
  const [saved, setSaved] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const stored = localStorage.getItem("deliveryZones");
    if (stored) setZones(JSON.parse(stored));
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

  return (
    <div>
      <h1 className="admin-page-title">Settings</h1>

      <div style={{background:"#fff", padding:"1.5rem", border:"1px solid #ececec", borderRadius:4, maxWidth:600, marginBottom:"2rem"}}>
        <h3 style={{fontFamily:"Georgia,serif", fontSize:"1rem", marginBottom:"0.4rem"}}>Delivery Fees</h3>
        <p style={{fontSize:"0.82rem", color:"#999", marginBottom:"1.5rem"}}>Set delivery fees by location zone. International orders should contact via WhatsApp/Instagram/Email.</p>

        {zones.map((zone, i) => (
          <div key={i} style={{display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:"0.8rem", marginBottom:"0.8rem", alignItems:"center"}}>
            <input className="admin-input" placeholder="Zone name (e.g. Within Abuja)" value={zone.name} onChange={(e) => updateZone(i, "name", e.target.value)} />
            {zone.note ? (
              <input className="admin-input" value="Contact for quote" disabled style={{color:"#999"}} />
            ) : (
              <input className="admin-input" placeholder="Fee (NGN)" type="number" value={zone.fee} onChange={(e) => updateZone(i, "fee", Number(e.target.value))} />
            )}
            <button className="table-btn danger" onClick={() => removeZone(i)} style={{whiteSpace:"nowrap"}}>Remove</button>
          </div>
        ))}

        <div style={{display:"flex", gap:"0.8rem", marginTop:"1rem"}}>
          <button className="admin-btn-outline" onClick={addZone}>+ Add Zone</button>
          <button className="admin-btn" onClick={handleSave}>{saved ? "Saved ✓" : "Save Changes"}</button>
        </div>

        <div style={{marginTop:"1.5rem", padding:"1rem", background:"#f9f6f2", borderRadius:4}}>
          <p style={{fontSize:"0.82rem", color:"#555", lineHeight:1.7}}>
            <strong>International shipping</strong> is handled manually via:<br/>
            📸 Instagram: <a href="https://www.instagram.com/officially.tew/" target="_blank" rel="noreferrer" style={{color:"#c9a96e"}}>@officially.tew</a><br/>
            💬 WhatsApp: <a href="https://wa.me/2348068690024" target="_blank" rel="noreferrer" style={{color:"#c9a96e"}}>+234 806 869 0024</a><br/>
            📧 Email: <a href="mailto:tewoman2022@gmail.com" style={{color:"#c9a96e"}}>tewoman2022@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
