import React, { useState, useEffect } from "react";
import { getOrders, deleteOrder } from "../api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDelete = async (order) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteOrder(order._id);
      toast.success("Order deleted");
      loadOrders();
    } catch {
      toast.error("Delete failed");
    }
  };

  const columns = [
    { key: "_id", label: "Order ID", className: "w-32" },
    { key: "customerName", label: "Customer", className: "w-40" },
    { key: "total", label: "Total (₦)", className: "w-32 text-right" },
    { key: "status", label: "Status", className: "w-24 capitalize" },
  ];

  return (
    <div className="admin-table-wrapper">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#a17c4d]">Orders</h1>
      </div>

      {loading ? (
        <p className="text-center text-[#a17c4d]">Loading...</p>
      ) : (
        <div className="admin-table-container">
          <Table
            columns={columns}
            data={orders}
            onView={(o) => setSelectedOrder(o)}
            onDelete={handleDelete}
          />
        </div>
      )}

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-[#a17c4d]">
              Order Details
            </h2>
            <p><strong>ID:</strong> {selectedOrder._id}</p>
            <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
            <p><strong>Total:</strong> ₦{selectedOrder.total}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <h3 className="mt-3 font-semibold">Items:</h3>
            <ul>
              {selectedOrder.items?.map((it, i) => (
                <li key={i}>
                  {it.name} ({it.qty}) - ₦{it.price}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
