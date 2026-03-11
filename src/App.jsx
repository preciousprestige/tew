import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppChat from "./components/WhatsAppChat";
import NotificationBar from "./components/NotificationBar";
import Welcome from "./Welcome";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./components/CartPage";
import Checkout from "./components/Checkout";
import MyOrders from "./pages/MyOrders";
import AboutUs from "./pages/AboutUs";
import OrderConfirmation from "./pages/OrderConfirmation";
import LayoutAdmin from "./admin/components/Layout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Orders from "./admin/pages/Orders";
import Users from "./admin/pages/Users";
import Analytics from "./admin/pages/Analytics";
import Settings from "./admin/pages/Settings";
import ForgotPassword from "./admin/pages/ForgotPassword";
import ResetPassword from "./admin/pages/ResetPassword";

function ShopLayout({ children }) {
  // WhatsApp added below
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NotificationBar />
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <WhatsAppChat />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<ShopLayout><Home /></ShopLayout>} />
        <Route path="/product/:id" element={<ShopLayout><ProductDetails /></ShopLayout>} />
        <Route path="/cart" element={<ShopLayout><CartPage /></ShopLayout>} />
        <Route path="/checkout" element={<ShopLayout><Checkout /></ShopLayout>} />
        <Route path="/order/:id" element={<ShopLayout><OrderConfirmation /></ShopLayout>} />
        <Route path="/about" element={<ShopLayout><AboutUs /></ShopLayout>} />
        <Route path="/my-orders" element={<ShopLayout><MyOrders /></ShopLayout>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}
