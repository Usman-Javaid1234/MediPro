'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, userApi, tokenManager, ApiException } from '@/lib/api';
import { UserResponse, SignupRequest, LoginRequest } from '@/lib/api/types';
import { cartApi } from '@/lib/api/cart';

// -------------------- Types --------------------
export interface User {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  isActive: boolean;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

// -------------------- Helper Functions --------------------
const mapApiUserToUser = (apiUser: UserResponse): User => {
  console.log('🔍 Mapping API user to User:', {
    email: apiUser.email,
    is_admin: apiUser.is_admin,
    full_response: apiUser
  });
  
  return {
    id: apiUser.id,
    fullName: apiUser.full_name,
    email: apiUser.email,
    phone: apiUser.phone,
    isActive: apiUser.is_active,
    isVerified: apiUser.is_verified,
    isAdmin: apiUser.is_admin === true,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
};

// -------------------- Context --------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user on mount if tokens exist
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (tokenManager.hasTokens()) {
          // Validate tokens and get user profile
          const isValid = await authApi.checkAuth();
          
          if (isValid) {
            const apiUser = await userApi.getProfile();
            setUser(mapApiUserToUser(apiUser));
          } else {
            // Tokens invalid, clear them
            tokenManager.clearTokens();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        tokenManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      
      console.log('🔑 Login response received:', {
        user: response.user,
        has_is_admin: 'is_admin' in response.user,
        is_admin_value: (response.user as any).is_admin
      });
      
      // Map user response (login response now includes is_admin)
      const mappedUser = mapApiUserToUser(response.user as UserResponse);
      console.log('👤 Mapped user:', mappedUser);
      setUser(mappedUser);
      
      // Sync local cart to server if there are items
      if (cartApi.hasLocalItems()) {
        try {
          await cartApi.syncCartAfterLogin();
        } catch (syncError) {
          console.warn('Failed to sync cart:', syncError);
          // Don't fail login if cart sync fails
        }
      }
      
      // Redirect based on user role
      if (mappedUser.isAdmin) {
        console.log('✅ Admin user - redirecting to /admin');
        router.push('/admin');
      } else {
        console.log('✅ Regular user - redirecting to home');
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof ApiException) {
        throw new Error(error.detail || 'Login failed. Please check your credentials.');
      }
      throw new Error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Signup function
  const signup = useCallback(async (userData: SignupData) => {
    setIsLoading(true);
    try {
      const response = await authApi.signup({
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName,
        phone: userData.phone,
      });
      
      // Map user response
      const mappedUser = mapApiUserToUser(response.user as UserResponse);
      setUser(mappedUser);
      
      // Sync local cart to server if there are items
      if (cartApi.hasLocalItems()) {
        try {
          await cartApi.syncCartAfterLogin();
        } catch (syncError) {
          console.warn('Failed to sync cart:', syncError);
        }
      }
      
      router.push('/');
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof ApiException) {
        throw new Error(error.detail || 'Signup failed. Please try again.');
      }
      throw new Error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      setUser(null);
      tokenManager.clearTokens();
      router.push('/');
    }
  }, [router]);

  // Update user locally (for profile updates)
  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  }, [user]);

  // Refresh user data from server
  const refreshUser = useCallback(async () => {
    if (!tokenManager.hasTokens()) return;
    
    try {
      const apiUser = await userApi.getProfile();
      setUser(mapApiUserToUser(apiUser));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const isAuthenticated = !!user && tokenManager.hasTokens();

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}