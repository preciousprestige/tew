import React, { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
// 🔧 Fixed casing — ensure your file is named **ProductForm.jsx** (capital P)
import ProductForm from "../components/forms/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shopCategories, setShopCategories] = useState([]);

  // 🟤 Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);

      const uniqueCats = [
        ...new Set(
          data.map((p) => p.shopCategory).filter((c) => c && c.trim() !== "")
        ),
      ];
      setShopCategories(uniqueCats);
    } catch (err) {
      console.error("Error loading products:", err);
      toast.error("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🟤 Add Product
  const openAddModal = () => {
    setModalMode("add");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  // 🟤 Edit Product
  const openEditModal = (product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // 🟤 View Product
  const openViewModal = (product) => {
    setModalMode("view");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // 🟤 Save / Update Product
  const handleSubmit = async (formData) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((img) => data.append("images", img));
        } else {
          data.append(key, formData[key]);
        }
      });

      if (modalMode === "edit" && selectedProduct) {
        await updateProduct(selectedProduct._id, data);
        toast.success("✅ Product updated successfully!");
      } else {
        await createProduct(data);
        toast.success("✅ Product added successfully!");
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("❌ Failed to save product");
    }
  };

  // 🟤 Delete
  const handleDelete = async (product) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(product._id);
      toast.success("🗑️ Product deleted!");
      loadProducts();
    } catch {
      toast.error("❌ Failed to delete product");
    }
  };

  return (
    <div className="admin-table-wrapper">
      <div className="admin-header">
        <h1>Product Management</h1>
        <button onClick={openAddModal} className="add-btn">
          + Add Product
        </button>
      </div>

      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Price (₦)</th>
                <th>Discount</th>
                <th>Shop Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    {Array.isArray(p.images) && p.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000${p.images[0]}`}
                        alt={p.name}
                        className="admin-image-preview"
                      />
                    ) : (
                      <span className="no-image">No image</span>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>₦{p.price}</td>
                  <td>{p.discount || 0}%</td>
                  <td>{p.shopCategory}</td>
                  <td>{p.countInStock}</td>
                  <td>
                    <button onClick={() => openViewModal(p)} className="view-btn">
                      View
                    </button>
                    <button onClick={() => openEditModal(p)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="8" className="no-products">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalMode === "view" ? (
          <div className="modal-view">
            <h2>Product Details</h2>
            <p>
              <strong>Name:</strong> {selectedProduct?.name}
            </p>
            <p>
              <strong>Brand:</strong> {selectedProduct?.brand}
            </p>
            <p>
              <strong>Category:</strong> {selectedProduct?.category}
            </p>
            <p>
              <strong>Shop Category:</strong> {selectedProduct?.shopCategory || "GENERAL"}
            </p>
            <p>
              <strong>Price:</strong> ₦{selectedProduct?.price}
            </p>
            <p>
              <strong>Discount:</strong> {selectedProduct?.discount || 0}%
            </p>
            <p>
              <strong>Stock:</strong> {selectedProduct?.countInStock}
            </p>
            <p>
              <strong>Description:</strong> {selectedProduct?.description}
            </p>
            {Array.isArray(selectedProduct?.images) && (
              <div className="view-image-list">
                {selectedProduct.images.map((src, i) => (
                  <img
                    key={i}
                    src={src.startsWith("http") ? src : `http://localhost:5000${src}`}
                    alt="preview"
                    className="view-image-preview"
                  />
                ))}
              </div>
            )}
            <button onClick={() => setIsModalOpen(false)} className="close-btn">
              Close
            </button>
          </div>
        ) : (
          <ProductForm
            initialData={selectedProduct || {}}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            shopCategories={shopCategories}
          />
        )}
      </Modal>
    </div>
  );
}
