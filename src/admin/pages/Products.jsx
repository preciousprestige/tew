import React, { useState, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";
import "./Dashboard.css";
import "./Products.css";

const API = process.env.REACT_APP_API_URL;

const emptyForm = { name: "", price: "", brand: "", category: "", shopCategory: "", description: "", countInStock: "", discount: "", sizes: "" };

const getImgSrc = (img) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return img;
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const fileRef = useRef();
  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: "Bearer " + token };

  const load = () => {
    fetch(API + "/products").then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : d.products || []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleImageChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    e.target.value = "";
    setCompressing(true);
    try {
      const compressionOptions = { maxSizeMB: 2, maxWidthOrHeight: 1000, useWebWorker: true };
      const compressed = await Promise.all(newFiles.map((file) => imageCompression(file, compressionOptions)));
      const combined = [...images, ...compressed].slice(0, 3);
      setImages(combined);
      setPreviews(combined.map((f) => URL.createObjectURL(f)));
    } catch (err) {
      alert("Image compression failed: " + err.message);
    } finally {
      setCompressing(false);
    }
  };

  const removeImage = (i) => {
    setImages(images.filter((_, idx) => idx !== i));
    setPreviews(previews.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.brand || !form.category) {
      alert("Name, price, brand and category are required."); return;
    }
    if (images.length === 0 && !editId) {
      alert("Please upload at least 1 image."); return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "sizes") {
        // Convert comma-separated sizes string to array
        const sizesArr = v.split(",").map((s) => s.trim()).filter(Boolean);
        sizesArr.forEach((s) => fd.append("sizes[]", s));
      } else if (v) {
        fd.append(k, v);
      }
    });
    images.forEach((img) => fd.append("images", img));

    const url = editId ? API + "/products/" + editId : API + "/products";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: authHeaders, body: fd });
    if (res.ok) {
      setShowForm(false); setForm(emptyForm); setEditId(null); setImages([]); setPreviews([]); load();
    } else {
      const err = await res.json();
      alert(err.message || "Failed to save product.");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name || "", price: p.price || "", brand: p.brand || "",
      category: p.category || "", shopCategory: p.shopCategory || "",
      description: p.description || "", countInStock: p.countInStock != null ? p.countInStock : "",
      discount: p.discount || "",
      sizes: p.sizes && p.sizes.length > 0 ? p.sizes.join(", ") : "",
    });
    setImages([]);
    setPreviews(p.images ? p.images.map((img) => getImgSrc(img)) : []);
    setEditId(p._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(API + "/products/" + id, { method: "DELETE", headers: authHeaders }); load();
  };

  const fields = [
    { name: "name", ph: "Product Name *" },
    { name: "price", ph: "Price *" },
    { name: "brand", ph: "Brand *" },
    { name: "category", ph: "Category *" },
    { name: "shopCategory", ph: "Shop Category" },
    { name: "countInStock", ph: "Stock Quantity" },
    { name: "discount", ph: "Discount (%)" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="admin-page-title">Products</h1>
        <button className="admin-btn" onClick={() => { setForm(emptyForm); setEditId(null); setImages([]); setPreviews([]); setShowForm(true); }}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="product-form-wrap">
          <h3>{editId ? "Edit Product" : "New Product"}</h3>
          <div className="product-form-grid">
            {fields.map((f) => (
              <input key={f.name} className="admin-input" placeholder={f.ph} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
            ))}
            {/* Sizes field */}
            <div style={{ gridColumn: "1 / -1" }}>
              <input
                className="admin-input"
                placeholder="Sizes — comma separated, e.g. 6, 8, 10, 12, 14, 16"
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                style={{ width: "100%" }}
              />
              <p style={{ fontSize: "0.75rem", color: "#bbb", marginTop: "0.3rem" }}>
                Leave blank to use default UK sizes (6–20). Enter custom sizes separated by commas.
              </p>
            </div>
            <textarea className="admin-input admin-textarea" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.78rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "#999", marginBottom: "0.6rem" }}>
              Product Images (min 1, max 3)
            </p>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: "relative", width: 90, height: 110 }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 2, border: "1px solid #ddd" }} />
                  {images.length > 0 && (
                    <button onClick={() => removeImage(i)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: "0.7rem", lineHeight: "1" }}>×</button>
                  )}
                </div>
              ))}
              {previews.length < 3 && (
                <div onClick={() => !compressing && fileRef.current.click()} style={{ width: 90, height: 110, border: "2px dashed #ddd", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#999", fontSize: "1.5rem", flexDirection: "column", gap: "4px" }}>
                  {compressing ? <span style={{ fontSize: "0.7rem" }}>...</span> : "+"}
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageChange} />
            <p style={{ fontSize: "0.75rem", color: "#bbb" }}>
              {compressing ? "Compressing images..." : "Click + to upload images (1–3 images, auto-compressed)"}
            </p>
          </div>

          <div className="form-actions">
            <button className="admin-btn" onClick={handleSubmit} disabled={compressing}>
              {compressing ? "Processing..." : editId ? "Update" : "Create"}
            </button>
            <button className="admin-btn-outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Sizes</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><img src={getImgSrc(p.images && p.images[0])} alt={p.name} style={{ width: 48, height: 56, objectFit: "cover" }} /></td>
                <td>{p.name}</td>
                <td>{p.brand || "-"}</td>
                <td>{p.category || "-"}</td>
                <td>NGN {Number(p.price).toLocaleString()}</td>
                <td>{p.countInStock}</td>
                <td style={{ fontSize: "0.78rem", color: "#888" }}>
                  {p.sizes && p.sizes.length > 0 ? p.sizes.join(", ") : "Default"}
                </td>
                <td>
                  <button className="table-btn" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="table-btn danger" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}