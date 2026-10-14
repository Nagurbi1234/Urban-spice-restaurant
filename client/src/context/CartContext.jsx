import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const TAX_RATE = 0.05;
const DELIVERY_FEE = 40;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("urban-spice-cart") ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("urban-spice-cart", JSON.stringify(items));
  }, [items]);

  const add = (item) => {
    setItems((current) => {
      const found = current.find((entry) => entry.menuItemId === item.id);
      if (found) {
        return current.map((entry) =>
          entry.menuItemId === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }
      return [...current, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }];
    });
  };

  const adjust = (id, amount) => {
    setItems((current) =>
      current
        .map((item) => (item.menuItemId === id ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const remove = (id) => setItems((current) => current.filter((item) => item.menuItemId !== id));

  const clear = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + tax + deliveryFee;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, add, adjust, remove, clear, subtotal, tax, deliveryFee, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
