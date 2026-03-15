import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  img: string;
  qty: number;
  options?: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("breakfast-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("breakfast-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.findIndex(
        (i) => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options),
      );
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing].qty += item.qty;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index: number, qty: number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, qty } : item)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("€", "").replace(",", "."));
    return sum + price * item.qty;
  }, 0);

  const count = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
