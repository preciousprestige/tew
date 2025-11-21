// src/admin/utils/api.js
import API from "./utils/apiClient";

// ---------- AUTH ----------
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// ---------- PRODUCTS ----------
export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

export const createProduct = async (data) => {
  const res = await API.post("/products", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await API.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

// ---------- ORDERS ----------
export const getOrders = async () => {
  const res = await API.get("/orders");
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const storedUser = JSON.parse(localStorage.getItem("tew-user"));
  const token = storedUser?.token;

  const res = await API.put(
    `/orders/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await API.delete(`/orders/${id}`);
  return res.data;
};

export const createOrder = async (data) => {
  const res = await API.post("/orders", data);
  return res.data;
};

export const updateOrder = async (id, data) => {
  const res = await API.put(`/orders/${id}`, data);
  return res.data;
};

// ---------- USERS ----------
export const getUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const createUser = async (data) => {
  const res = await API.post("/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await API.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};

// ---------- MESSAGES ----------
export const getMessages = async () => {
  const res = await API.get("/messages");
  return res.data;
};

export const getUserMessages = async (userId) => {
  const res = await API.get(`/messages/${userId}`);
  return res.data;
};

export const sendMessageToUser = async (data) => {
  const res = await API.post("/messages", data);
  return res.data;
};
