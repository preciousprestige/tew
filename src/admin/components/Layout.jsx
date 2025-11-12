// src/admin/components/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "../../Admin.css";

export default function LayoutAdmin() {
  return (
    <div className="admin-layout flex bg-[#fdfaf5] min-h-screen font-['Courier_New',monospace]">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content Area */}
      <main className="admin-main ml-60 flex-1 min-h-screen bg-[#fdfaf5]">
        {/* ✅ Navbar (contains single Logout button only) */}
        <Navbar />

        {/* ✅ Active Admin Page */}
        <div className="admin-page-content p-6 flex justify-center items-start">
          <div className="w-full max-w-6xl bg-white/60 backdrop-blur-sm rounded-2xl shadow-md border border-[#e6e0da] p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
