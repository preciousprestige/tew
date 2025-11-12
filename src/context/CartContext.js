import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const STORAGE_KEY = "tew-cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // expose as `cart` (matches ProductDetails)

  // ✅ removed unused alias variable that caused ESLint warning
  // old cartItemsAlias logic now unnecessary because we already expose alias in provider

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to parse cart from localStorage", e);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const genCartItemId = (product) =>
    product.cartItemId ||
    `${product._id || product.id}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  const addToCart = (product) => {
    if (!product || !product._id) {
      console.warn("addToCart called with invalid product:", product);
      return;
    }

    setCart((prev) => {
      if (product.cartItemId) {
        const newItem = {
          ...product,
          quantity: product.quantity || 1,
          cartItemId: genCartItemId(product),
        };
        return [...prev, newItem];
      }

      const idx = prev.findIndex(
        (it) => it._id === product._id && (it.size || "") === (product.size || "")
      );

      if (idx > -1) {
        const updated = [...prev];
        const existing = { ...updated[idx] };
        existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
        updated[idx] = existing;
        return updated;
      }

      const newItem = {
        ...product,
        quantity: product.quantity || 1,
        cartItemId: genCartItemId(product),
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (cartItemId, amount) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(0, (item.quantity || 1) + amount) }
            : item
        )
        .filter((item) => (item.quantity || 0) > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart, // alias for backward compatibility
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
