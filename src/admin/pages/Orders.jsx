import React, { useState, useEffect } from "react";
import { getOrders, updateOrder } from "../api";
import Table from "../components/Table";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openOrderPopup = (order) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status || "pending");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async () => {
    try {
      if (!selectedOrder) return;
      await updateOrder(selectedOrder._id, { status: statusUpdate });
      toast.success("✅ Order status updated!");
      await loadOrders();
      closePopup();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const columns = [
    { key: "_id", label: "ID", className: "w-20 text-center" },
    { key: "paymentResult.name", label: "Customer", className: "w-48" },
    { key: "totalPrice", label: "Total (₦)", className: "w-32 text-right" },
    { key: "status", label: "Status", className: "w-32 capitalize" },
  ];

  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  );
  const completedOrders = orders.filter(
    (o) => o.status === "completed" || o.status === "cancelled"
  );

  return (
    <div className="admin-table-wrapper">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#a17c4d]">Orders</h1>
      </div>

      {loading ? (
        <p className="text-center text-[#a17c4d]">Loading...</p>
      ) : (
        <div className="admin-table-container space-y-10">
          {/* ACTIVE ORDERS */}
          <div>
            <h2 className="text-xl font-semibold text-[#a17c4d] mb-2">
              🟡 Pending / Processing Orders
            </h2>
            {activeOrders.length > 0 ? (
              <Table columns={columns} data={activeOrders} onView={openOrderPopup} />
            ) : (
              <p className="text-center text-gray-500">No active orders</p>
            )}
          </div>

          {/* COMPLETED / CANCELLED */}
          <div>
            <h2 className="text-xl font-semibold text-[#a17c4d] mb-2">
              ✅ Completed / Cancelled Orders
            </h2>
            {completedOrders.length > 0 ? (
              <Table columns={columns} data={completedOrders} onView={openOrderPopup} />
            ) : (
              <p className="text-center text-gray-500">No completed or cancelled orders</p>
            )}
          </div>
        </div>
      )}

      {/* POPUP */}
      {showPopup && selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(5px)",
          }}
          onClick={closePopup}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fffaf5",
              borderRadius: "10px",
              width: "550px",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "20px",
              boxShadow: "0 0 15px rgba(0,0,0,0.2)",
              color: "#3b2a1a",
            }}
          >
            <h2 style={{ color: "#a17c4d", fontSize: "20px", marginBottom: "15px" }}>
              Order Details
            </h2>

            <p>
              <strong>Customer:</strong> {selectedOrder.paymentResult?.name}
            </p>
            <p>
              <strong>Contact:</strong> {selectedOrder.paymentResult?.phone} |{" "}
              {selectedOrder.paymentResult?.email}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.shippingAddress?.address},{" "}
              {selectedOrder.shippingAddress?.city},{" "}
              {selectedOrder.shippingAddress?.state}
            </p>
            <p>
              <strong>Total:</strong> ₦{selectedOrder.totalPrice}
            </p>
            <p>
              <strong>Delivery Fee:</strong> ₦{selectedOrder.deliveryFee}
            </p>

            {/* Status */}
            <div style={{ marginTop: "15px" }}>
              <label
                htmlFor="status"
                style={{ display: "block", marginBottom: "6px", color: "#a17c4d" }}
              >
                Update Status:
              </label>

              <select
                id="status"
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
                style={{
                  padding: "6px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                onClick={handleStatusChange}
                style={{
                  background: "#4b7f52",
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Save Status
              </button>
            </div>

            {/* ITEMS */}
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ color: "#a17c4d", marginBottom: "10px" }}>
                Ordered Items
              </h4>

              {selectedOrder.items?.map((item, i) => {
                const API_BASE =
                  process.env.REACT_APP_API_URL || "http://localhost:5000";

                const imageSrc = item.image?.startsWith("http")
                  ? item.image
                  : item.image
                  ? `${API_BASE}${item.image}`
                  : Array.isArray(item.images) && item.images[0]
                  ? item.images[0].startsWith("http")
                    ? item.images[0]
                    : `${API_BASE}${item.images[0]}`
                  : "https://via.placeholder.com/100x120?text=No+Image";

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px" }}>
                      <img
                        src={imageSrc}
                        alt={item.name}
                        width="50"
                        height="60"
                        style={{
                          borderRadius: "6px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <p><strong>{item.name}</strong></p>
                        <p>Qty: {item.qty}</p>
                      </div>
                    </div>

                    <p>₦{item.price}</p>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "right", marginTop: "15px" }}>
              <button
                onClick={closePopup}
                style={{
                  background: "#a17c4d",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: "5px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
