import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";

import Welcome from "./Welcome";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CartPage from "./components/CartPage";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./components/Checkout";

// Admin pages
import AdminDashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Orders from "./admin/pages/Orders";
import Users from "./admin/pages/Users";
import Analytics from "./admin/pages/Analytics";
import Settings from "./admin/pages/Settings";
import ForgotPassword from "./admin/pages/ForgotPassword";
import ResetPassword from "./admin/pages/ResetPassword";
import LayoutAdmin from "./admin/components/Layout";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function Layout() {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password");

  return (
    <div className="app-container">
      {!hideLayout && <Header />}
      <main className="main-content">
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>

          {/* GitHub Pages Fix */}
          <Route path="/tew" element={<Navigate to="/" replace />} />

          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* ADMIN (no login, auto-load dashboard) */}
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
