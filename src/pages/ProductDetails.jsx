import React, { useState, useEffect } from "react";
import SizeGuideModal from "../components/SizeGuideModal";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { imgUrl } from "../utils/imgUrl";
import "./ProductDetails.css";
const API = process.env.REACT_APP_API_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetch(API + "/products/" + id).then((r) => r.json()).then(setProduct).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (!product) return <div className="pd-loading">Product not found.</div>;

  const sizes = product.sizes || ["XS", "S", "M", "L", "XL"];
  const images = product.images && product.images.length > 0
    ? product.images.map(img => imgUrl(img))
    : [imgUrl(product.image || product.imageUrl)];

  return (
    <div className="pd-page">
      <button className="pd-back" onClick={() => navigate("/home")}>← Back to Shop</button>
      <div className="pd-inner">
        <div className="pd-gallery">
          <div className="pd-main-img-wrap">
            <img src={images[activeImg]} alt={product.name} className="pd-img" />
          </div>
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((src, i) => (
                <button key={i} className={"pd-thumb" + (activeImg === i ? " active" : "")} onClick={() => setActiveImg(i)}>
                  <img src={src} alt={product.name + " " + (i + 1)} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="pd-info">
          <h1 className="pd-name">{product.name}</h1>
          <p className="pd-price">NGN {Number(product.price).toLocaleString()}</p>
          <p className="pd-desc">{product.description}</p>
          <div className="pd-sizes">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><p className="pd-label">Size</p><button onClick={() => setShowSizeGuide(true)} style={{fontSize:"0.78rem",color:"#c9a96e",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Size Guide</button></div>
            <div className="size-options">
              {sizes.map((s) => <button key={s} className={"size-btn" + (selectedSize === s ? " active" : "")} onClick={() => setSelectedSize(s)}>{s}</button>)}
            </div>
          </div>
          <div className="pd-qty">
            <p className="pd-label">Quantity</p>
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
          <button className={"pd-cart-btn" + (added ? " added" : "")} onClick={handleAddToCart} disabled={product.countInStock === 0}>
            {product.countInStock === 0 ? "Out of Stock" : added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
    </div>
  );
}
