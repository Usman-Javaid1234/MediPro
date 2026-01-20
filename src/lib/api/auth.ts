// ============================================
// Auth API - Authentication endpoints
// ============================================

import apiClient, { tokenManager, ApiException } from './client';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  Token,
  UserResponse,
  UserUpdate,
  PasswordChangeRequest,
} from './types';

export const authApi = {
  /**
   * Register a new user
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    
    // Store tokens after successful signup
    if (response.session) {
      tokenManager.setTokens(response.session);
    }
    
    return response;
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    
    // Store tokens after successful login
    if (response.session) {
      tokenManager.setTokens(response.session);
    }
    
    return response;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (): Promise<Token | null> => {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await apiClient.post<Token>('/auth/refresh', {
        refresh_token: refreshToken,
      });
      
      tokenManager.setTokens(response);
      return response;
    } catch (error) {
      tokenManager.clearTokens();
      return null;
    }
  },

  /**
   * Logout user (clears tokens client-side)
   */
  logout: async (): Promise<void> => {
    try {
      // Call backend logout endpoint (optional, since JWT is stateless)
      await apiClient.post('/auth/logout', null, { requiresAuth: true });
    } catch (error) {
      // Ignore errors, we'll clear tokens anyway
    } finally {
      tokenManager.clearTokens();
    }
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiClient.post('/auth/forgot-password', null, {
      params: { email },
    });
  },

  /**
   * Reset password using token from email
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return apiClient.post('/auth/reset-password', null, {
      params: { token, new_password: newPassword },
    });
  },

  /**
   * Check if user is authenticated (has valid tokens)
   */
  isAuthenticated: (): boolean => {
    return tokenManager.hasTokens() && !tokenManager.isTokenExpired();
  },

  /**
   * Get current authentication status and try to refresh if expired
   */
  checkAuth: async (): Promise<boolean> => {
    if (!tokenManager.hasTokens()) {
      return false;
    }

    if (tokenManager.isTokenExpired()) {
      const newToken = await authApi.refreshToken();
      return newToken !== null;
    }

    return true;
  },
};

// -------------------- User Profile API --------------------
export const userApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserResponse> => {
    return apiClient.get<UserResponse>('/users/me', { requiresAuth: true });
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UserUpdate): Promise<UserResponse> => {
    return apiClient.put<UserResponse>('/users/me', data, { requiresAuth: true });
  },

  /**
   * Change password
   */
  changePassword: async (data: PasswordChangeRequest): Promise<{ message: string }> => {
    return apiClient.post('/users/me/change-password', data, { requiresAuth: true });
  },

  /**
   * Get user by ID (admin)
   */
  getUserById: async (userId: string): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(`/users/${userId}`, { requiresAuth: true });
  },
};

export default authApi;
