import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotDetails() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password reset link sent! Check your inbox.");
      } else {
        setMessage(`❌ ${data.message || "Failed to send reset link"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf5]">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-[#e6e0da]">
        <h2 className="text-2xl font-semibold text-[#b8860b] mb-4">
          Forgot Details
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your registered admin email to receive password reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#b8860b]"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#b8860b] text-white font-semibold rounded-md hover:bg-[#a77d00] transition"
          >
            Send Reset Link
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}

        <button
          onClick={() => navigate("/admin-login")}
          className="mt-6 text-sm text-[#b8860b] hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
