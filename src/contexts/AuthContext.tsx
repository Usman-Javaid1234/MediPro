import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('medipro_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('medipro_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('medipro_user');
        }
    }, [user]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock user data
            const mockUser: User = {
                id: '1',
                email,
                name: email.split('@')[0],
            };

            setUser(mockUser);
        } catch (error) {
            throw new Error('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock user data
            const mockUser: User = {
                id: '1',
                email,
                name,
            };

            setUser(mockUser);
        } catch (error) {
            throw new Error('Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual Google OAuth
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser: User = {
                id: 'google_1',
                email: 'user@gmail.com',
                name: 'Google User',
                avatar: 'https://via.placeholder.com/150',
            };

            setUser(mockUser);
        } catch (error) {
            throw new Error('Google login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithFacebook = async () => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual Facebook OAuth
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser: User = {
                id: 'facebook_1',
                email: 'user@facebook.com',
                name: 'Facebook User',
                avatar: 'https://via.placeholder.com/150',
            };

            setUser(mockUser);
        } catch (error) {
            throw new Error('Facebook login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        loginWithFacebook,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
