import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartItem, Product } from '@/types';

type CartStoreState = {
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, size) => {
        set((state) => {
          const existing = state.items.find((item) => item.product.slug === product.slug && item.size === size);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.slug === product.slug && item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }

          return {
            items: [...state.items, { product, quantity: 1, size }]
          };
        });
      },
      removeItem: (slug, size) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.product.slug === slug && item.size === size))
        }));
      },
      updateQuantity: (slug, size, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.slug === slug && item.size === size
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
            )
            .filter((item) => item.quantity > 0)
        }));
      },
      clearCart: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'eeeco-cart'
    }
  )
);

export function getCartCount(items: CartItem[]) {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}