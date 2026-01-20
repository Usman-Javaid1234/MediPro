// ============================================
// React Query Hooks - Index
// ============================================

// Auth hooks
export {
  authKeys,
  useUser,
  useIsAuthenticated,
  useLogin,
  useSignup,
  useLogout,
  useUpdateProfile,
  useChangePassword,
  useForgotPassword,
  useResetPassword,
  useAuthCheck,
} from './useAuth';

// Product hooks
export {
  productKeys,
  useProducts,
  useProduct,
  useFeaturedProducts,
  useProductSearch,
  useProductsByCategory,
  useRelatedProducts,
  usePrefetchProduct,
} from './useProducts';

// Category hooks
export {
  categoryKeys,
  useCategories,
  useCategory,
  useCategoryBySlug,
  useCategoryTree,
  useRootCategories,
  useSubcategories,
  useFeaturedCategories,
  usePrefetchCategory,
} from './useCategories';

// Cart hooks
export {
  cartKeys,
  useCart,
  useCartCount,
  useCartTotal,
  useAddToCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
  useClearCart,
  useSyncCartAfterLogin,
  useHasLocalCartItems,
} from './useCart';

// Order hooks
export {
  orderKeys,
  useOrders,
  useOrder,
  useRecentOrders,
  useCreateOrder,
  useCancelOrder,
  useTrackOrder,
  usePrefetchOrder,
} from './useOrders';

// Review hooks
export {
  reviewKeys,
  useProductReviews,
  useMyReviews,
  useCanReview,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useMarkReviewHelpful,
} from './useReviews';
