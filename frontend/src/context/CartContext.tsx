// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import type {AuthResponse, CartItem, Product} from '../types';

interface CartContextType {
    user: AuthResponse | null;
    cart: CartItem[];
    login: (e: string, p: string) => Promise<void>;
    logout: () => void;
    addToCart: (p: Product) => void;
    removeFromCart: (productId: number, quantity?: number) => Promise<void>;
    checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsedUser = JSON.parse(stored);
            setUser(parsedUser);
            // Fetch User Cart
            api.getCart(parsedUser.userId)
                .then(data => setCart(data.items || []))
                .catch(err => console.error("Failed to load cart", err));
        } else {
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            setCart(guestCart);
        }
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            // 1. Get the token
            const data = await api.login(email, pass);

            // 2. CRITICAL FIX: Save User/Token BEFORE syncing cart
            // This ensures api.addToCart can find the token in getHeaders()
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);

            // 3. Sync Guest Cart (Now safe because token is saved)
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            if (guestCart.length > 0) {
                try {
                    // Process all items
                    for (const item of guestCart) {
                        await api.addToCart(data.userId, item.product.id, item.quantity);
                    }
                    // Only clear guest cart if sync succeeded
                    localStorage.removeItem('guestCart');
                } catch (syncError) {
                    console.error("Error syncing guest cart items:", syncError);
                    // We continue anyway, because the user is successfully logged in.
                }
            }

            // 4. Fetch the final merged cart from backend
            const updated = await api.getCart(data.userId);
            setCart(updated.items || []);

        } catch (error) {
            console.error("Login failed", error);
            // If the main login failed, ensure we clean up
            localStorage.removeItem('user');
            setUser(null);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setCart([]);
    };

    const addToCart = async (product: Product) => {
        if (user) {
            try {
                await api.addToCart(user.userId, product.id, 1);
                const updated = await api.getCart(user.userId);
                setCart(updated.items || []);
            } catch (err) {
                alert("Failed to add to cart. Please try again.");
            }
        } else {
            const newCart = [...cart];
            const exists = newCart.find(i => i.product.id === product.id);
            if (exists) exists.quantity++;
            else newCart.push({ product, quantity: 1 });
            setCart(newCart);
            localStorage.setItem('guestCart', JSON.stringify(newCart));
        }
    };

    const removeFromCart = async (productId: number, quantity = 1) => {
        if (user) {
            try {
                // API Mode: Backend handles the logic (decreasing or removing)
                await api.removeFromCart(user.userId, productId, quantity);
                const updated = await api.getCart(user.userId);
                setCart(updated.items || []);
            } catch (err) {
                console.error("Remove failed", err);
            }
        } else {
            // Guest Mode: Manual Calculation
            const newCart = cart.map(item => {
                if (item.product.id === productId) {
                    return { ...item, quantity: item.quantity - quantity };
                }
                return item;
            }).filter(item => item.quantity > 0); // Remove if 0 or less

            setCart(newCart);
            localStorage.setItem('guestCart', JSON.stringify(newCart));
        }
    };

    const checkout = async () => {
        if (!user) throw new Error("Must be logged in");
        await api.checkout(user.userId);
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ user, cart, login, logout, addToCart, removeFromCart, checkout }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext)!;