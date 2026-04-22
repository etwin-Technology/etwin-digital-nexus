import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("etwin-cart");
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("etwin-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = items.reduce((s, i) => s + i.quantity * i.product.price, 0);

    return {
      items,
      totalItems,
      totalPrice,
      add: (product) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.product.id === product.id);
          if (existing) {
            return prev.map((i) =>
              i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
            );
          }
          return [...prev, { product, quantity: 1 }];
        }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.product.id !== id)),
      setQuantity: (id, quantity) =>
        setItems((prev) =>
          quantity <= 0
            ? prev.filter((i) => i.product.id !== id)
            : prev.map((i) => (i.product.id === id ? { ...i, quantity } : i)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
