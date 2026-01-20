// ============================================
// React Query Hooks - Cart (Hybrid: Server + Local)
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../index';
import { Product, CartResponse, CartItem, LocalCartItem } from '../types';
import { tokenManager } from '../client';

// -------------------- Query Keys --------------------
export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
  count: () => [...cartKeys.all, 'count'] as const,
};

// -------------------- Hooks --------------------

/**
 * Fetch cart (server or local based on auth state)
 */
export function useCart() {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: () => cartApi.getCart(),
    staleTime: 30 * 1000, // 30 seconds
    // Refetch when window gains focus (in case cart was modified in another tab)
    refetchOnWindowFocus: true,
  });
}

/**
 * Get cart item count
 */
export function useCartCount() {
  const { data: cart } = useCart();
  return cart?.total_items ?? 0;
}

/**
 * Get cart total
 */
export function useCartTotal() {
  const { data: cart } = useCart();
  return cart?.subtotal ?? 0;
}

/**
 * Add item to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ product, quantity = 1 }: { product: Product; quantity?: number }) =>
      cartApi.addProduct(product, quantity),
    onMutate: async ({ product, quantity = 1 }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });

      // Snapshot previous cart
      const previousCart = queryClient.getQueryData<CartResponse>(cartKeys.detail());

      // Optimistically update cart
      queryClient.setQueryData<CartResponse>(cartKeys.detail(), (old) => {
        if (!old) {
          return {
            items: [{
              id: product.id,
              product_id: product.id,
              quantity,
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                thumbnail: product.thumbnail,
                stock_quantity: product.stock_quantity,
                is_active: product.is_active,
              },
              subtotal: product.price * quantity,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }],
            total_items: quantity,
            subtotal: product.price * quantity,
          };
        }

        const existingIndex = old.items.findIndex(
          item => item.product_id === product.id
        );

        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...old.items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + quantity,
            subtotal: (updatedItems[existingIndex].quantity + quantity) * product.price,
          };

          return {
            items: updatedItems,
            total_items: old.total_items + quantity,
            subtotal: old.subtotal + product.price * quantity,
          };
        }

        // Add new item
        return {
          items: [
            ...old.items,
            {
              id: product.id,
              product_id: product.id,
              quantity,
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                thumbnail: product.thumbnail,
                stock_quantity: product.stock_quantity,
                is_active: product.is_active,
              },
              subtotal: product.price * quantity,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          total_items: old.total_items + quantity,
          subtotal: old.subtotal + product.price * quantity,
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

/**
 * Update cart item quantity
 */
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateQuantity(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });

      const previousCart = queryClient.getQueryData<CartResponse>(cartKeys.detail());

      queryClient.setQueryData<CartResponse>(cartKeys.detail(), (old) => {
        if (!old) return old;

        if (quantity <= 0) {
          // Remove item
          const removedItem = old.items.find(item => item.id === itemId);
          if (!removedItem) return old;

          return {
            items: old.items.filter(item => item.id !== itemId),
            total_items: old.total_items - removedItem.quantity,
            subtotal: old.subtotal - removedItem.subtotal,
          };
        }

        // Update quantity
        const updatedItems = old.items.map(item => {
          if (item.id === itemId) {
            const newSubtotal = item.product.price * quantity;
            return { ...item, quantity, subtotal: newSubtotal };
          }
          return item;
        });

        return {
          items: updatedItems,
          total_items: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

/**
 * Remove item from cart
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });

      const previousCart = queryClient.getQueryData<CartResponse>(cartKeys.detail());

      queryClient.setQueryData<CartResponse>(cartKeys.detail(), (old) => {
        if (!old) return old;

        const removedItem = old.items.find(item => item.id === itemId);
        if (!removedItem) return old;

        return {
          items: old.items.filter(item => item.id !== itemId),
          total_items: old.total_items - removedItem.quantity,
          subtotal: old.subtotal - removedItem.subtotal,
        };
      });

      return { previousCart };
    },
    onError: (err, itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

/**
 * Clear entire cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });

      const previousCart = queryClient.getQueryData<CartResponse>(cartKeys.detail());

      queryClient.setQueryData<CartResponse>(cartKeys.detail(), {
        items: [],
        total_items: 0,
        subtotal: 0,
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

/**
 * Sync local cart to server after login
 */
export function useSyncCartAfterLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.syncCartAfterLogin(),
    onSuccess: (data) => {
      // Update cart with synced data
      queryClient.setQueryData(cartKeys.detail(), data);
    },
  });
}

/**
 * Check if there are local cart items to sync
 */
export function useHasLocalCartItems() {
  return cartApi.hasLocalItems();
}
