import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    originalPrice?: number | null;
    rating: number;
    reviews: number;
    image: string;
    inStock: boolean;
    featured: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        // Load cart from localStorage on initial render
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('medipro_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('medipro_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: Product, quantity: number = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Update quantity if item already exists
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item to cart
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value: CartContextType = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
