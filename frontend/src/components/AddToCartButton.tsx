// src/components/AddToCartButton.tsx
"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/button"; // Import Button
import { toast } from "react-hot-toast";       // Import toast
import { ShoppingCart } from "lucide-react";   // Import an icon

interface AddToCartButtonProps {
  product: Product;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addToCart, cartItems } = useCart();

  const itemInCart = cartItems.find((item) => item._id === product._id);
  const currentQuantityInCart = itemInCart?.quantity || 0;

  const handleAddToCart = () => {
    if (product.stock > 0 && currentQuantityInCart < product.stock) {
      addToCart(product, 1);
      // Show success toast
      toast.success(`${product.name} added to cart!`);
      console.log(`Added ${product.name} to cart.`);
    } else {
      // Show error toast if trying to add more than stock
      if (currentQuantityInCart >= product.stock) {
         toast.error(`Max quantity (${product.stock}) for ${product.name} already in cart.`);
      } else {
         // This case shouldn't be reachable if button is disabled correctly
         toast.error(`Cannot add ${product.name} to cart.`);
      }
      console.log("Cannot add more, item out of stock or max quantity reached.");
    }
  };

  const isOutOfStock = product.stock <= 0;
  const maxQuantityReached = currentQuantityInCart >= product.stock;
  const isDisabled = isOutOfStock || maxQuantityReached;

  return (
    <Button // Use Button component
      onClick={handleAddToCart}
      disabled={isDisabled}
      className="w-full" // Make button full width
      size="lg" // Make button slightly larger
    >
      <ShoppingCart size={18} className="mr-2" /> {/* Add icon */}
      {isOutOfStock
        ? "Out of Stock"
        : maxQuantityReached
          ? "Max Quantity in Cart"
          : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
