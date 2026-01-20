// ============================================
// React Query Hooks - Authentication
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, userApi } from '../index';
import { tokenManager } from '../client';
import { 
  LoginRequest, 
  SignupRequest, 
  UserResponse, 
  UserUpdate,
  PasswordChangeRequest 
} from '../types';
import { cartKeys } from './useCart';

// -------------------- Query Keys --------------------
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

// -------------------- Hooks --------------------

/**
 * Get current user profile
 * Only fetches if user has valid tokens
 */
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => userApi.getProfile(),
    enabled: tokenManager.hasTokens(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: user, isLoading } = useUser();
  return {
    isAuthenticated: !!user && tokenManager.hasTokens(),
    isLoading,
    user,
  };
}

/**
 * Login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), data.user);
      
      // Invalidate cart to fetch server cart
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Signup mutation
 */
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: SignupRequest) => authApi.signup(userData),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), data.user);
      
      // Invalidate cart to fetch server cart
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // Or selectively clear auth-related queries
      // queryClient.removeQueries({ queryKey: authKeys.all });
      // queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdate) => userApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.user(), updatedUser);
    },
  });
}

/**
 * Change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChangeRequest) => userApi.changePassword(data),
  });
}

/**
 * Forgot password
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

/**
 * Reset password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
  });
}

/**
 * Check and refresh auth on app load
 */
export function useAuthCheck() {
  return useQuery({
    queryKey: [...authKeys.session(), 'check'],
    queryFn: async () => {
      const isValid = await authApi.checkAuth();
      return { isAuthenticated: isValid };
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}
