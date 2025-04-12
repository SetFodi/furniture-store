"use client";

import { ShoppingBag, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

interface ProductQuickActionsProps {
  productId: string;
}

const ProductQuickActions = ({ productId }: ProductQuickActionsProps) => {
  const router = useRouter();
  const { addToCart } = useCart(); // Using your existing useCart hook

  const viewProductDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };

  // Simplified version - directly uses your addToCart function
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Send just the ID to be handled by your enhanced CartContext
      addToCart({ _id: productId });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        size="icon" 
        variant="secondary" 
        className="rounded-full h-10 w-10 bg-background/80 hover:bg-background border-none"
        aria-label="View product details"
        onClick={viewProductDetails}
      >
        <Eye size={18} />
      </Button>
      <Button 
        size="icon" 
        variant="secondary" 
        className="rounded-full h-10 w-10 bg-primary/80 hover:bg-primary text-primary-foreground border-none"
        aria-label="Add to cart"
        onClick={handleAddToCart}
      >
        <ShoppingBag size={18} />
      </Button>
    </div>
  );
};

export default ProductQuickActions;