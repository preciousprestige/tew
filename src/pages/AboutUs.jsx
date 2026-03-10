import React from "react";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 1.5rem" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "#999", marginBottom: "2.5rem", padding: 0 }}>← Back</button>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", color: "#1a1a1a", marginBottom: "0.5rem" }}>About The Exquisite Woman</h1>
      <div style={{ width: 48, height: 2, background: "#c9a96e", marginBottom: "2.5rem" }} />
      <p style={{ fontSize: "1rem", lineHeight: 1.9, color: "#444", marginBottom: "2rem" }}>Our fashion brand epitomizes the perfect blend of sophistication and modernity. We specialize in creating exquisite, high-quality apparel that not only enhances personal style but also embodies a commitment to sustainability. Each collection is thoughtfully designed to reflect timeless elegance while embracing contemporary trends, ensuring our pieces resonate with the discerning consumer. We strive to empower individuals to express their unique identities through fashion, making every garment a statement of confidence and grace.</p>
      <p style={{ fontSize: "1rem", lineHeight: 1.9, color: "#444", marginBottom: "3rem" }}>Our fashion brand is a fusion of contemporary design and timeless elegance, dedicated to empowering individuals through style. We meticulously craft each piece using high-quality materials and sustainable practices, ensuring that our collections not only look good but also feel good. Our mission is to inspire self-expression and confidence, offering a range of versatile apparel that caters to diverse tastes and occasions. With a commitment to innovation, we aim to set trends while honoring the classic elements of fashion, creating a unique identity for our brand that resonates with the modern consumer.</p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/home")} style={{ padding: "12px 28px", background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.82rem", letterSpacing: "1px" }}>SHOP COLLECTION</button>
        <button onClick={() => navigate(-1)} style={{ padding: "12px 28px", background: "transparent", color: "#1a1a1a", border: "1px solid #1a1a1a", cursor: "pointer", fontSize: "0.82rem", letterSpacing: "1px" }}>GO BACK</button>
      </div>
    </div>
  );
}
