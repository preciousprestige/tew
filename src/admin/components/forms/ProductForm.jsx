import React, { useState } from "react";

export default function ProductForm({
  initialData = {},
  onSubmit,
  onCancel,
  shopCategories = [],
}) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    brand: initialData.brand || "",
    category: initialData.category || "",
    shopCategory: initialData.shopCategory || "",
    newShopCategory: "",
    description: initialData.description || "",
    price: initialData.price || "",
    discount: initialData.discount || 0,
    countInStock: initialData.countInStock || 0,
    images: [],
  });

  const [previews, setPreviews] = useState(initialData.images || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    const filePreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews(filePreviews);
    setForm((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updatedForm = { ...form };
    if (form.newShopCategory.trim()) {
      updatedForm.shopCategory = form.newShopCategory.trim();
    }

    delete updatedForm.newShopCategory;
    onSubmit(updatedForm);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-3 bg-white rounded-md"
      encType="multipart/form-data"
    >
      <h2 className="text-xl font-bold text-[#a17c4d] mb-2">Product Form</h2>

      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Brand</label>
        <input
          type="text"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* 🆕 Shop Category */}
      <div>
        <label className="block font-medium">Shop Category</label>
        <select
          name="shopCategory"
          value={form.shopCategory}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        >
          <option value="">Select existing</option>
          {shopCategories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="newShopCategory"
          value={form.newShopCategory}
          onChange={handleChange}
          placeholder="Or add new category"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Price (₦)</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Discount (%)</label>
        <input
          type="number"
          name="discount"
          value={form.discount}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Stock Count</label>
        <input
          type="number"
          name="countInStock"
          value={form.countInStock}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* 🖼 Image Upload */}
      <div>
        <label className="block font-medium">Upload Images (max 3)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Preview ${i + 1}`}
              className="w-16 h-16 object-cover rounded border border-gray-300"
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
