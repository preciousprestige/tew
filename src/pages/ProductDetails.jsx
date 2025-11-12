import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Safe baseURL resolution without illegal `import` usage
  const resolveBaseURL = () => {
    try {
      if (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
      }
      if (typeof window !== "undefined" && window?.VITE_API_URL) {
        return window.VITE_API_URL;
      }
    } catch {
      /* ignore */
    }
    return "http://localhost:5000";
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const baseURL = resolveBaseURL();
        const res = await axios.get(`${baseURL}/api/products/${id}`);
        setProduct(res.data);
        setError(null);
      } catch (err) {
        console.error("❌ Product fetch error:", err);
        setError("Failed to load product details.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size.");
      return;
    }

    const existingItem = Array.isArray(cart)
      ? cart.find((item) => item._id === product._id && (item.size || "") === size)
      : null;

    if (existingItem) {
      addToCart({
        ...product,
        size,
        quantity: existingItem.quantity + quantity,
      });
    } else {
      addToCart({ ...product, size, quantity });
    }

    alert("Added to cart!");
  };

  if (error) return <div className="product-details error">{error}</div>;
  if (!product) return <div className="product-details loading">Loading...</div>;

  const baseURL = resolveBaseURL();
  const images = Array.isArray(product.images)
    ? product.images.map((img) => (img.startsWith("http") ? img : `${baseURL}${img}`))
    : [];

  return (
    <div className="product-details">
      {/* Back button */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          ← Back
        </button>
      </div>

      {/* IMAGE SECTION */}
      <div className="image-gallery">
        {images.length > 0 ? (
          images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`product-${i}`}
              className="detail-thumb"
              loading="lazy"
            />
          ))
        ) : (
          <img
            src="https://via.placeholder.com/200x250?text=No+Image"
            alt="No product"
            className="detail-thumb"
          />
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="product-info">
        <h2>{product.name}</h2>
        <p className="price">₦{product.price?.toLocaleString()}</p>
        <p>{product.description}</p>

        <div className="size-select">
          <label>Select Size:</label>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">-- Choose --</option>
            {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
              product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))
            ) : (
              <>
                <option value="S">Small (S)</option>
                <option value="M">Medium (M)</option>
                <option value="L">Large (L)</option>
                <option value="XL">X-Large (XL)</option>
              </>
            )}
          </select>
          <button onClick={() => setShowGuide(true)} className="size-guide-btn">
            Size Guide
          </button>
        </div>

        <div className="quantity-select">
          <label>Qty:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        {product.sizeStock && size && product.sizeStock[size] === 0 ? (
          <button disabled className="add-to-cart-btn disabled">
            Out of stock
          </button>
        ) : (
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            🛒 Add to Cart
          </button>
        )}
      </div>

      {/* SIZE GUIDE MODAL */}
      {showGuide && (
        <div className="size-guide-modal" onClick={() => setShowGuide(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Size Guide</h3>
            {product.sizeGuide ? (
              <div dangerouslySetInnerHTML={{ __html: product.sizeGuide }} />
            ) : (
              <>
                <p>Small: Bust 34” – Waist 26” – Hips 36”</p>
                <p>Medium: Bust 36” – Waist 28” – Hips 38”</p>
                <p>Large: Bust 38” – Waist 30” – Hips 40”</p>
                <p>X-Large: Bust 40” – Waist 32” – Hips 42”</p>
              </>
            )}
            <button onClick={() => setShowGuide(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
