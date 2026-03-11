import React, { useState } from "react";

const WHATSAPP_NUMBER = "2348068690024";
const WHATSAPP_MESSAGE = "Hi! I'm interested in your collection.";

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false);

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.8rem" }}>
      
      {/* Popup card */}
      {open && (
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", width: 300, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: "#25D366", padding: "1.2rem 1rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <WhatsAppIcon size={26} color="#fff" />
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 600, fontSize: "1rem", margin: 0 }}>Start a Conversation</p>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.78rem", margin: 0 }}>Hi! Click below to chat on WhatsApp</p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "1rem" }}>
            <p style={{ fontSize: "0.78rem", color: "#999", marginBottom: "0.8rem" }}>The team typically replies in a few minutes.</p>
            <div
              onClick={openWhatsApp}
              style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.8rem", border: "1px solid #f0f0f0", borderRadius: 8, cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f9f9f9"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              <div style={{ background: "#25D366", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <WhatsAppIcon size={22} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1a1a1a", margin: 0 }}>The Exquisite Woman</p>
                <p style={{ fontSize: "0.76rem", color: "#888", margin: 0 }}>Typically replies instantly</p>
              </div>
              <WhatsAppIcon size={20} color="#25D366" />
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: 56, height: 56, borderRadius: "50%", background: "#25D366", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", transition: "transform 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? (
          <span style={{ color: "#fff", fontSize: "1.4rem", lineHeight: 1 }}>×</span>
        ) : (
          <WhatsAppIcon size={30} color="#fff" />
        )}
      </button>
    </div>
  );
}

function WhatsAppIcon({ size = 24, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}