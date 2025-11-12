import React, { useEffect, useState } from "react";
import "./ProductGrid.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductGrid() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (id) => navigate(`/product/${id}`);

  if (loading)
    return <p className="text-center" style={{ color: "#a17c4d" }}>Loading products...</p>;

  const grouped = products.reduce((acc, p) => {
    const cat = p.shopCategory || "GENERAL";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const categories = Object.keys(grouped).filter(
    (key) => grouped[key].length > 0
  );

  return (
    <div className="product-section-wrapper">
      {categories.map((sectionTitle, index) => (
        <div key={index} className="product-section">
          <h2 className="section-title">{sectionTitle}</h2>

          <div className="horizontal-scroll-wrapper">
            <div className="product-grid">
              {grouped[sectionTitle].map((product) => {
                const displayImg =
                  Array.isArray(product.images) && product.images.length
                    ? product.images[0].startsWith("http")
                      ? product.images[0]
                      : `http://localhost:5000${product.images[0]}`
                    : product.image
                    ? product.image.startsWith("http")
                      ? product.image
                      : `http://localhost:5000${product.image}`
                    : "https://via.placeholder.com/400x500?text=No+Image";

                return (
                  <div key={product._id} className="product-card">
                    <div
                      className="product-image-container"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <img
                        src={displayImg}
                        alt={product.name}
                        className="product-img"
                      />
                    </div>

                    <p className="product-name">{product.name}</p>
                    <p className="product-price">₦{product.price?.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
