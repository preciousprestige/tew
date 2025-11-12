// src/admin/components/forms/OrderForm.jsx
import React, { useState } from "react";

export default function OrderForm({ initialData = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    customerName: initialData.customerName || "",
    status: initialData.status || "Pending",
    total: initialData.total || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <h2 className="text-xl font-bold mb-3">Order Form</h2>
      <div>
        <label className="block font-medium">Customer Name</label>
        <input
          type="text"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option>Pending</option>
          <option>Processing</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>
      <div>
        <label className="block font-medium">Total (₦)</label>
        <input
          type="number"
          name="total"
          value={form.total}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="flex justify-end gap-3 mt-4">
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
