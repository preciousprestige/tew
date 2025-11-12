import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="products-page">
      <h1 className="page-title">Explore Our Boutique Collection</h1>

      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => {
            const displayImg =
              Array.isArray(p.images) && p.images.length > 0
                ? p.images[0].startsWith("http")
                  ? p.images[0]
                  : `http://localhost:5000${p.images[0]}`
                : "https://via.placeholder.com/150x150?text=No+Image";

            return (
              <div key={p._id} className="product-card">
                <Link to={`/product/${p._id}`}>
                  <img src={displayImg} alt={p.name} className="product-thumb" />
                </Link>
                <h2 className="product-name">{p.name}</h2>
                <p className="product-price">₦{p.price?.toLocaleString()}</p>
                {p.discount > 0 && (
                  <p className="product-discount">-{p.discount}% Off</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
