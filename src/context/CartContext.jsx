import React, { createContext, useContext, useState, useEffect } from "react";
const CartContext = createContext();
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart")) || []; }
    catch { return []; }
  });
  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cartItems)); }, [cartItems]);
  const addToCart = (product, size = "", quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id && item.size === size);
      if (existing) {
        return prev.map((item) => item._id === product._id && item.size === size ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, size, quantity }];
    });
  };
  const removeFromCart = (id, size) => setCartItems((prev) => prev.filter((item) => !(item._id === id && item.size === size)));
  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) { removeFromCart(id, size); return; }
    setCartItems((prev) => prev.map((item) => item._id === id && item.size === size ? { ...item, quantity } : item));
  };
  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() { return useContext(CartContext); }
