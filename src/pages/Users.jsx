import React, { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../admin/api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import UserForm from "../components/forms/UserForm";
import { toast } from "react-toastify";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedUser(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData(user);
    setIsModalOpen(true);
  };

  const openViewModal = (user) => {
    setModalMode("view");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (newUser) => {
    try {
      if (modalMode === "edit" && selectedUser) {
        await updateUser(selectedUser._id, newUser);
        toast.success("✅ User updated successfully!");
      } else {
        await createUser(newUser);
        toast.success("✅ User added successfully!");
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save user");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(user._id);
      toast.success("🗑️ User deleted successfully!");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const columns = [
    { key: "_id", label: "ID", className: "w-20 text-center" },
    { key: "name", label: "Name", className: "w-48" },
    { key: "email", label: "Email", className: "w-64" },
    { key: "role", label: "Role", className: "w-32 capitalize" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button onClick={openAddModal} className="bg-purple-600 text-white px-4 py-2 rounded-md">
          + Add User
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={columns} data={users} onView={openViewModal} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalMode === "view" ? (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p><strong>ID:</strong> {selectedUser?._id}</p>
            <p><strong>Name:</strong> {selectedUser?.name}</p>
            <p><strong>Email:</strong> {selectedUser?.email}</p>
            <p className="capitalize"><strong>Role:</strong> {selectedUser?.role}</p>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
          </div>
        ) : (
          <UserForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
        )}
      </Modal>
    </div>
  );
}
