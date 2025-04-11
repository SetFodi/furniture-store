// src/components/AddToCartButton.tsx
"use client"; // Mark as a Client Component

import React from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addToCart, cartItems } = useCart(); // Get addToCart function and items

  // Find this item in the cart to check stock vs quantity
  const itemInCart = cartItems.find((item) => item._id === product._id);
  const currentQuantityInCart = itemInCart?.quantity || 0;

  const handleAddToCart = () => {
    if (product.stock > 0 && currentQuantityInCart < product.stock) {
      addToCart(product, 1); // Add one item
      // Optional: Add user feedback (e.g., toast notification)
      console.log(`Added ${product.name} to cart.`);
    } else {
      console.log("Cannot add more, item out of stock or max quantity reached.");
      // Optional: Disable button or show message
    }
  };

  const isOutOfStock = product.stock <= 0;
  const maxQuantityReached = currentQuantityInCart >= product.stock;
  const isDisabled = isOutOfStock || maxQuantityReached;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`w-full text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
        isDisabled
          ? "bg-gray-400" // Disabled style
          : "bg-indigo-600 hover:bg-indigo-700" // Enabled style
      }`}
    >
      {isOutOfStock
        ? "Out of Stock"
        : maxQuantityReached
          ? "Max Quantity in Cart"
          : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
