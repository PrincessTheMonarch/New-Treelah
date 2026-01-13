import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  personalization?: string;
  giftWrap?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from Supabase on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: cartItems, error } = await supabase
          .from('cart_items')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('[CartContext] Error loading cart:', error);
        } else if (cartItems) {
          // Convert cart_items to CartItem format
          const convertedItems: CartItem[] = cartItems.map((item: any) => ({
            id: item.product_id,
            title: item.product_name,
            price: Number(item.unit_price),
            image: '',
            quantity: item.quantity,
            category: item.product_category || '',
            personalization: item.personalization,
            giftWrap: item.gift_wrap,
          }));
          setItems(convertedItems);
        }
      } catch (error) {
        console.error('[CartContext] Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const syncCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Clear existing cart items
      await supabase.from('cart_items').delete().eq('user_id', user.id);

      // Insert all current items
      if (items.length > 0) {
        const cartData = items.map((item) => ({
          user_id: user.id,
          product_id: item.id,
          product_name: item.title,
          product_category: item.category,
          unit_price: item.price,
          quantity: item.quantity,
          personalization: item.personalization,
          gift_wrap: item.giftWrap,
        }));
        await supabase.from('cart_items').insert(cartData);
      }
    } catch (error) {
      console.error('[CartContext] Error syncing cart:', error);
    }
  };

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
