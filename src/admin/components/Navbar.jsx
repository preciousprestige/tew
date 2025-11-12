// src/admin/components/Navbar.jsx
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-full bg-[#1c1c1c] py-4 px-6 border-b border-[#d4af37] flex justify-between items-center shadow-md">
      <h2 className="text-2xl font-bold tracking-wide text-[#d4af37] uppercase">
        TEW Admin Panel
      </h2>

      {/* ✅ Only show user info */}
      <span className="text-sm text-gray-300 italic">
        {user ? `Welcome, ${user.name || user.email}` : "Welcome"}
      </span>
    </div>
  );
}
