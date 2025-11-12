import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

// ✅ Create root
const root = ReactDOM.createRoot(document.getElementById("root"));

// ✅ Render App (StrictMode removed to prevent double mounting)
root.render(
  <BrowserRouter>
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>
);

// ✅ Optional performance reporting
reportWebVitals();
