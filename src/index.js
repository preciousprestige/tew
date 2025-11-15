import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

const isGithub = window.location.hostname.includes("github.io");
const basename = isGithub ? "/tew" : "";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename={basename}>
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>
);

reportWebVitals();
