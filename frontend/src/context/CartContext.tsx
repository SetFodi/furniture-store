// src/context/CartContext.tsx
"use client"; // This whole file defines client-side context and logic

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/types";
import { toast } from "react-hot-toast";

// Define the shape of the context data and functions
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product | { _id: string }, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

// Create the context with a default value (usually null or undefined initially)
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const storedCart = localStorage.getItem("shoppingCart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0 || localStorage.getItem("shoppingCart")) {
      // Only save if cart has items or if we need to clear existing storage
      localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Enhanced addToCart function that handles both full products and product IDs
  const addToCart = async (product: Product | { _id: string }, quantity: number = 1) => {
    try {
      // If we only have the product ID, fetch the full product
      if (!('name' in product)) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/products/${product._id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "API error");
        }
        
        product = data.data as Product;
        // Notify user of success
        toast.success(`${product.name} added to cart`);
      }

      // Now we have the full product, continue with existing logic
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item._id === product._id
        );
        if (existingItem) {
          // Update quantity if item already exists
          const newQuantity = existingItem.quantity + quantity;
          // Ensure quantity doesn't exceed stock
          const finalQuantity = Math.min(newQuantity, (product as Product).stock);
          return prevItems.map((item) =>
            item._id === product._id
              ? { ...item, quantity: finalQuantity }
              : item
          );
        } else {
          // Add new item, ensuring quantity doesn't exceed stock
          const finalQuantity = Math.min(quantity, (product as Product).stock);
          if (finalQuantity <= 0) return prevItems; // Don't add if quantity is zero or less
          return [...prevItems, { ...(product as Product), quantity: finalQuantity }];
        }
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = (productId: string) => {
    // Find item to show in toast notification
    const itemToRemove = cartItems.find(item => item._id === productId);
    if (itemToRemove) {
      toast.success(`${itemToRemove.name} removed from cart`);
    }
    
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) => {
      // Find the item to get its stock limit
      const itemToUpdate = prevItems.find((item) => item._id === productId);
      if (!itemToUpdate) return prevItems; // Item not found

      // Ensure quantity is at least 1 and not more than stock
      const finalQuantity = Math.max(1, Math.min(quantity, itemToUpdate.stock));

      return prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: finalQuantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("shoppingCart"); // Also clear storage
    toast.success("Cart cleared");
  };

  const getCartTotal = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getItemCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Value provided to consuming components
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to easily consume the context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};