// src/admin/utils/apiClient.js
import axios from "axios";
import { toast } from "react-toastify";

// Ensure correct formatting of the backend URL
const API_BASE =
  (process.env.REACT_APP_API_URL &&
    process.env.REACT_APP_API_URL.replace(/\/$/, "")) ||
  "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("tew-user"));
    const token = storedUser?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Token read error:", err);
  }

  return config;
});

// Handle backend errors and 401 redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    toast.error(message);

    if (error.response?.status === 401) {
      localStorage.removeItem("tew-user");
      window.location.href = "/admin-login";
    }

    return Promise.reject(error);
  }
);

export default api;
