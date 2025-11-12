import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Login failed");
        return;
      }

      if (!data?.user || !data?.token) {
        throw new Error("Invalid response from server");
      }

      // ✅ Store properly for ProtectedRoute
      localStorage.setItem("tew-user", JSON.stringify(data.user));
      localStorage.setItem("tew-token", data.token);

      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f5ef]">
      {/* ✅ Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-[#d1bfa7] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ✅ Animated Card */}
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}

        className="bg-white/60 backdrop-blur-lg shadow-lg border border-[#e6dcc3] rounded-2xl p-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-serif text-center mb-8 text-[#3a2e1f] tracking-wide">
          Admin Login
        </h2>

        <div className="mb-5">
          <label className="block text-[#3a2e1f] text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#d1bfa7] rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c4a982] bg-[#faf9f6]"
            placeholder="admin@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-[#3a2e1f] text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#d1bfa7] rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c4a982] bg-[#faf9f6]"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading
              ? "bg-[#d1bfa7] cursor-not-allowed"
              : "bg-[#3a2e1f] hover:bg-[#4e3b2a]"
          } text-white font-semibold py-2 px-4 rounded-md w-full transition-all duration-200`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </motion.form>
    </div>
  );
}
