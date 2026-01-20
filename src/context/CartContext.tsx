'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '@/lib/api/cart';
import { tokenManager } from '@/lib/api/client';
import { CartResponse, CartItem, Product } from '@/lib/api/types';

// -------------------- Types --------------------
export interface CartContextItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  category: string;
  stockQuantity: number;
}

interface CartContextType {
  cart: CartContextItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  refreshCart: () => Promise<void>;
  syncCartAfterLogin: () => Promise<void>;
}

// -------------------- Helper Functions --------------------
const mapCartResponseToItems = (response: CartResponse): CartContextItem[] => {
  return response.items.map(item => ({
    id: item.id,
    productId: item.product_id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.thumbnail,
    quantity: item.quantity,
    category: '', // Server doesn't return category in cart item
    stockQuantity: item.product.stock_quantity,
  }));
};

// -------------------- Context --------------------
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartContextItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart on mount
  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await cartApi.getCart();
      setCart(mapCartResponseToItems(response));
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Failed to load cart');
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Refresh cart (exposed to components)
  const refreshCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  // Sync cart after login
  const syncCartAfterLogin = useCallback(async () => {
    if (!tokenManager.hasTokens()) return;
    
    try {
      if (cartApi.hasLocalItems()) {
        const response = await cartApi.syncCartAfterLogin();
        setCart(mapCartResponseToItems(response));
      } else {
        await loadCart();
      }
    } catch (err) {
      console.error('Failed to sync cart:', err);
      await loadCart();
    }
  }, [loadCart]);

  // Add product to cart
  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    setError(null);
    
    // Optimistic update
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.productId === product.id);
      
      if (existingIndex >= 0) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      
      return [
        ...prevCart,
        {
          id: product.id, // Temporary ID for local items
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.thumbnail || product.images[0] || null,
          quantity,
          category: product.category,
          stockQuantity: product.stock_quantity,
        },
      ];
    });

    try {
      await cartApi.addProduct(product, quantity);
      // Refresh to get server state (especially for IDs)
      await loadCart();
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add item to cart');
      // Reload cart to revert optimistic update
      await loadCart();
    }
  }, [loadCart]);

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    setError(null);
    
    // Optimistic update
    const previousCart = [...cart];
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));

    try {
      await cartApi.removeItem(itemId);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError('Failed to remove item from cart');
      setCart(previousCart);
    }
  }, [cart]);

  // Update item quantity
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    setError(null);
    
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    // Optimistic update
    const previousCart = [...cart];
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );

    try {
      await cartApi.updateQuantity(itemId, quantity);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update quantity');
      setCart(previousCart);
    }
  }, [cart, removeFromCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    setError(null);
    
    const previousCart = [...cart];
    setCart([]);

    try {
      await cartApi.clearCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
      setCart(previousCart);
    }
  }, [cart]);

  // Calculate cart total
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  // Get total item count
  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        refreshCart,
        syncCartAfterLogin,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}