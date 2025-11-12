// src/admin/utils/apiClient.js
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// ✅ Fix: pull correct token from tew-user object
api.interceptors.request.use((config) => {
  const storedUser = JSON.parse(localStorage.getItem("tew-user"));
  const token = storedUser?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    toast.error(message);

    if (error.response?.status === 401) {
      localStorage.removeItem("tew-user");
      window.location.href = "/admin-login";
    }

    return Promise.reject(error);
  }
);

export default api;
