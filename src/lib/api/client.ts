// ============================================
// API Client - Base HTTP Client with Auth Handling
// ============================================

import { ApiError, Token } from './types';

// -------------------- Configuration --------------------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api/v1';

// Storage keys
const ACCESS_TOKEN_KEY = 'medipro_access_token';
const REFRESH_TOKEN_KEY = 'medipro_refresh_token';
const TOKEN_EXPIRY_KEY = 'medipro_token_expiry';

// -------------------- Token Management --------------------
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (tokens: Token): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    
    // Store expiry time
    const expiryTime = Date.now() + tokens.expires_in * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  isTokenExpired: (): boolean => {
    if (typeof window === 'undefined') return true;
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    
    // Consider token expired 60 seconds before actual expiry
    return Date.now() >= parseInt(expiry) - 60000;
  },

  hasTokens: (): boolean => {
    return !!tokenManager.getAccessToken() && !!tokenManager.getRefreshToken();
  }
};

// -------------------- API Error Class --------------------
export class ApiException extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiException';
    this.status = status;
    this.detail = detail;
  }
}

// -------------------- Refresh Token Logic --------------------
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeToTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      tokenManager.clearTokens();
      return null;
    }

    const tokens: Token = await response.json();
    tokenManager.setTokens(tokens);
    return tokens.access_token;
  } catch (error) {
    tokenManager.clearTokens();
    return null;
  }
};

// -------------------- Request Options --------------------
interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

// -------------------- Build URL with Query Params --------------------
const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean | undefined>): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

// -------------------- Core Request Function --------------------
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = false, params, ...fetchOptions } = options;

  // Build URL with query params
  const url = buildUrl(endpoint, params);

  // Set up headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Add auth header if required
  if (requiresAuth) {
    let accessToken = tokenManager.getAccessToken();

    // Check if token needs refresh
    if (tokenManager.isTokenExpired() && tokenManager.getRefreshToken()) {
      if (!isRefreshing) {
        isRefreshing = true;
        accessToken = await refreshAccessToken();
        isRefreshing = false;
        
        if (accessToken) {
          onTokenRefreshed(accessToken);
        }
      } else {
        // Wait for ongoing refresh
        accessToken = await new Promise<string>((resolve) => {
          subscribeToTokenRefresh(resolve);
        });
      }
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else if (requiresAuth) {
      throw new ApiException(401, 'Authentication required');
    }
  }

  // Make request
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle no content responses
  if (response.status === 204) {
    return undefined as T;
  }

  // Parse response
  let data: T | ApiError;
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { detail: await response.text() } as ApiError;
  }

  // Handle errors
  if (!response.ok) {
    const errorData = data as ApiError;
    
    // Handle 401 specifically - try refresh once
    if (response.status === 401 && requiresAuth && tokenManager.getRefreshToken()) {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry the request with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, {
          ...fetchOptions,
          headers,
        });
        
        if (retryResponse.ok) {
          if (retryResponse.status === 204) {
            return undefined as T;
          }
          return await retryResponse.json();
        }
      }
      
      // Refresh failed, clear tokens
      tokenManager.clearTokens();
    }

    throw new ApiException(
      response.status,
      errorData.detail || 'An unexpected error occurred'
    );
  }

  return data as T;
}

// -------------------- HTTP Method Helpers --------------------
export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

// -------------------- Export --------------------
export { API_BASE_URL };
export default apiClient;
