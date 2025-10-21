"use client";

import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product, quantity = 1) => {
    if (!product?.id) return;
    setItems((previous) => {
      const index = previous.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        const copy = [...previous];
        copy[index] = {
          ...copy[index],
          quantity: copy[index].quantity + quantity,
        };
        return copy;
      }
      return [
        ...previous,
        {
          id: product.id,
          name: product.name ?? "Untitled product",
          image_url: product.image_url ?? null,
          quantity: Math.max(1, quantity),
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((previous) =>
      previous
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setItems((previous) => previous.filter((item) => item.id !== productId));
  };

  const clearCart = () => setItems([]);

  const totalCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalCount,
    }),
    [items, totalCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
