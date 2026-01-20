// ============================================
// Cart API - Cart endpoints with hybrid approach
// Supports both server-side cart (logged in) and local storage (guest)
// ============================================

import apiClient, { tokenManager } from './client';
import {
  CartResponse,
  CartItem,
  CartItemCreate,
  CartItemUpdate,
  LocalCartItem,
  Product,
} from './types';

// -------------------- Local Storage Keys --------------------
const LOCAL_CART_KEY = 'medipro_guest_cart';

// -------------------- Local Cart Helpers --------------------
const localCartHelpers = {
  getCart: (): LocalCartItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveCart: (cart: LocalCartItem[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  },

  clearCart: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOCAL_CART_KEY);
  },

  toCartResponse: (items: LocalCartItem[]): CartResponse => {
    const cartItems: CartItem[] = items.map(item => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      product: {
        id: item.product_id,
        name: item.name,
        price: item.price,
        thumbnail: item.image,
        stock_quantity: 999, // Unknown for local cart
        is_active: true,
      },
      subtotal: item.price * item.quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    return {
      items: cartItems,
      total_items: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
  },
};

// -------------------- Server Cart API --------------------
const serverCartApi = {
  getCart: async (): Promise<CartResponse> => {
    return apiClient.get<CartResponse>('/cart', { requiresAuth: true });
  },

  addItem: async (data: CartItemCreate): Promise<CartItem> => {
    return apiClient.post<CartItem>('/cart/items', data, { requiresAuth: true });
  },

  updateItem: async (itemId: string, data: CartItemUpdate): Promise<CartItem> => {
    return apiClient.put<CartItem>(`/cart/items/${itemId}`, data, { requiresAuth: true });
  },

  removeItem: async (itemId: string): Promise<void> => {
    return apiClient.delete<void>(`/cart/items/${itemId}`, { requiresAuth: true });
  },

  clearCart: async (): Promise<void> => {
    return apiClient.delete<void>('/cart', { requiresAuth: true });
  },
};

// -------------------- Hybrid Cart API --------------------
export const cartApi = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenManager.hasTokens();
  },

  /**
   * Get cart (server if authenticated, local otherwise)
   */
  getCart: async (): Promise<CartResponse> => {
    if (cartApi.isAuthenticated()) {
      return serverCartApi.getCart();
    }
    return localCartHelpers.toCartResponse(localCartHelpers.getCart());
  },

  /**
   * Add item to cart
   * For local cart, requires product info
   */
  addItem: async (
    productId: string,
    quantity: number = 1,
    productInfo?: { name: string; price: number; image: string | null; category: string }
  ): Promise<CartItem | LocalCartItem> => {
    if (cartApi.isAuthenticated()) {
      return serverCartApi.addItem({ product_id: productId, quantity });
    }

    // Local cart requires product info
    if (!productInfo) {
      throw new Error('Product info required for guest cart');
    }

    const cart = localCartHelpers.getCart();
    const existingIndex = cart.findIndex(item => item.product_id === productId);

    if (existingIndex >= 0) {
      // Update quantity
      cart[existingIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        id: productId,
        product_id: productId,
        name: productInfo.name,
        price: productInfo.price,
        image: productInfo.image,
        quantity,
        category: productInfo.category,
      });
    }

    localCartHelpers.saveCart(cart);
    return cart.find(item => item.product_id === productId)!;
  },

  /**
   * Add product to cart (convenience method that extracts product info)
   */
  addProduct: async (product: Product, quantity: number = 1): Promise<CartItem | LocalCartItem> => {
    return cartApi.addItem(product.id, quantity, {
      name: product.name,
      price: product.price,
      image: product.thumbnail || product.images[0] || null,
      category: product.category,
    });
  },

  /**
   * Update cart item quantity
   */
  updateQuantity: async (itemId: string, quantity: number): Promise<CartItem | LocalCartItem | null> => {
    if (quantity <= 0) {
      await cartApi.removeItem(itemId);
      return null;
    }

    if (cartApi.isAuthenticated()) {
      return serverCartApi.updateItem(itemId, { quantity });
    }

    const cart = localCartHelpers.getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return null;
    
    cart[itemIndex].quantity = quantity;
    localCartHelpers.saveCart(cart);
    return cart[itemIndex];
  },

  /**
   * Remove item from cart
   */
  removeItem: async (itemId: string): Promise<void> => {
    if (cartApi.isAuthenticated()) {
      return serverCartApi.removeItem(itemId);
    }

    const cart = localCartHelpers.getCart();
    const filteredCart = cart.filter(item => item.id !== itemId);
    localCartHelpers.saveCart(filteredCart);
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<void> => {
    if (cartApi.isAuthenticated()) {
      return serverCartApi.clearCart();
    }
    localCartHelpers.clearCart();
  },

  /**
   * Get cart item count
   */
  getItemCount: async (): Promise<number> => {
    const cart = await cartApi.getCart();
    return cart.total_items;
  },

  /**
   * Get cart total
   */
  getTotal: async (): Promise<number> => {
    const cart = await cartApi.getCart();
    return cart.subtotal;
  },

  /**
   * Sync local cart to server after login
   * Merges local cart with server cart
   */
  syncCartAfterLogin: async (): Promise<CartResponse> => {
    const localCart = localCartHelpers.getCart();
    
    if (localCart.length === 0) {
      // No local items, just return server cart
      return serverCartApi.getCart();
    }

    // Add each local item to server cart
    for (const item of localCart) {
      try {
        await serverCartApi.addItem({
          product_id: item.product_id,
          quantity: item.quantity,
        });
      } catch (error) {
        // Item might already exist or product might be unavailable
        console.warn(`Failed to sync cart item ${item.product_id}:`, error);
      }
    }

    // Clear local cart after sync
    localCartHelpers.clearCart();

    // Return updated server cart
    return serverCartApi.getCart();
  },

  /**
   * Get local cart (for checking before sync)
   */
  getLocalCart: (): LocalCartItem[] => {
    return localCartHelpers.getCart();
  },

  /**
   * Check if local cart has items
   */
  hasLocalItems: (): boolean => {
    return localCartHelpers.getCart().length > 0;
  },

  /**
   * Clear local cart only (used after sync)
   */
  clearLocalCart: (): void => {
    localCartHelpers.clearCart();
  },
};

export default cartApi;
