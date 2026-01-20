// ============================================
// API Types - Matching Backend Pydantic Schemas
// ============================================

// -------------------- Common --------------------
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}

// -------------------- Auth --------------------
export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  session: Token;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

// -------------------- User --------------------
export interface UserResponse {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  is_admin:boolean;
}

export interface UserUpdate {
  full_name?: string;
  phone?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

// -------------------- Product --------------------
export interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  stock_quantity: number;
  sku: string | null;
  images: string[];
  thumbnail: string | null;
  specifications: Record<string, unknown>;
  features: string[];
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  is_featured: boolean;
  weight: number | null;
  dimensions: Record<string, unknown>;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse extends PaginatedResponse<Product> {}

export interface ProductFilter {
  category?: string;
  subcategory?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  in_stock_only?: boolean;
  search?: string;
  sort_by?: 'created_at' | 'price' | 'name';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

// -------------------- Category --------------------
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  icon: string | null;
  image_url: string | null;
  color: string | null;
  meta_title: string | null;
  meta_description: string | null;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  product_count: number;
  has_subcategories: boolean;
  full_path: string;
}

export interface CategoryWithSubcategories extends Category {
  subcategories: Category[];
}

export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  color: string | null;
  product_count: number;
  subcategories: CategoryTree[];
}

export interface CategoryListResponse extends PaginatedResponse<Category> {}

// -------------------- Cart --------------------
export interface ProductInCart {
  id: string;
  name: string;
  price: number;
  thumbnail: string | null;
  stock_quantity: number;
  is_active: boolean;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: ProductInCart;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface CartResponse {
  items: CartItem[];
  total_items: number;
  subtotal: number;
}

export interface CartItemCreate {
  product_id: string;
  quantity: number;
}

export interface CartItemUpdate {
  quantity: number;
}

// Local cart item (for guest users)
export interface LocalCartItem {
  id: string; // product_id used as id for local storage
  product_id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  category: string;
}

// -------------------- Order --------------------
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country?: string;
  landmark?: string;
}

export interface OrderCreate {
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method?: string;
  customer_notes?: string;
}

export interface OrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  price_at_purchase: number;
  subtotal: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown> | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method: string;
  payment_id: string | null;
  tracking_number: string | null;
  courier_service: string | null;
  estimated_delivery_date: string | null;
  delivered_at: string | null;
  customer_notes: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderListResponse extends PaginatedResponse<Order> {}

// -------------------- Review --------------------
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  user_name: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewCreate {
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface ReviewListResponse extends PaginatedResponse<Review> {}
