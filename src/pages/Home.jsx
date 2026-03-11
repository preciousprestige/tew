import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Home.css";
import { imgUrl } from "../utils/imgUrl";

const API = process.env.REACT_APP_API_URL;

const SORT_OPTIONS = [
  { value: "default",   label: "Default Sorting" },
  { value: "popular",   label: "Sort by Popularity" },
  { value: "latest",    label: "Sort by Latest" },
  { value: "price_asc", label: "Sort by Price: Low to High" },
  { value: "price_desc",label: "Sort by Price: High to Low" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
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

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "popular":
        return (b.sold || b.popularity || 0) - (a.sold || a.popularity || 0);
      case "latest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="home">
      <div className="home-filters">
        <input
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={"cat-tab" + (category === cat ? " active" : "")}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-grid">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <div className="product-grid">
          {sorted.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-img-wrap" onClick={() => navigate("/product/" + product._id)}>
                <img
                  src={imgUrl(product.images && product.images[0] ? product.images[0] : product.image || product.imageUrl)}
                  alt={product.name}
                  className="product-img"
                />
                {product.countInStock === 0 && <span className="out-of-stock">Out of Stock</span>}
              </div>
              <div className="product-info">
                <p className="product-name" onClick={() => navigate("/product/" + product._id)}>{product.name}</p>
                <p className="product-price">NGN {Number(product.price).toLocaleString()}</p>
                <button
                  className="add-to-cart-btn"
                  disabled={product.countInStock === 0}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}