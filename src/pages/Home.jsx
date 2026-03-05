import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Home.css";
import { imgUrl } from "../utils/imgUrl";
const API = process.env.REACT_APP_API_URL;
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    fetch(API + "/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  const filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.name ? p.name.toLowerCase().includes(search.toLowerCase()) : true;
    return matchCat && matchSearch;
  });
  return (
    <div className="home">
      <div className="home-filters">
        <input className="search-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="category-tabs">
          {categories.map((cat) => (
            <button key={cat} className={"cat-tab" + (category === cat ? " active" : "")} onClick={() => setCategory(cat)}>{cat}</button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="loading-grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-img-wrap" onClick={() => navigate("/product/" + product._id)}>
                <img src={imgUrl(product.images && product.images[0] ? product.images[0] : product.image || product.imageUrl)} alt={product.name} className="product-img" />
                {product.countInStock === 0 && <span className="out-of-stock">Out of Stock</span>}
              </div>
              <div className="product-info">
                <p className="product-name" onClick={() => navigate("/product/" + product._id)}>{product.name}</p>
                <p className="product-price">NGN {Number(product.price).toLocaleString()}</p>
                <button className="add-to-cart-btn" disabled={product.countInStock === 0} onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
