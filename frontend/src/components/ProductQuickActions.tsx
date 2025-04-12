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
  const { addToCart } = useCart();

  const viewProductDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Just pass the ID - the enhanced CartContext will handle the rest
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
        className="rounded-full h-8 w-8 bg-background/80 hover:bg-background border-none shadow-md"
        aria-label="View product details"
        onClick={viewProductDetails}
      >
        <Eye size={14} />
      </Button>
      <Button 
        size="icon" 
        variant="secondary" 
        className="rounded-full h-8 w-8 bg-primary/90 hover:bg-primary text-primary-foreground border-none shadow-md"
        aria-label="Add to cart"
        onClick={handleAddToCart}
      >
        <ShoppingBag size={14} />
      </Button>
    </div>
  );
};

export default ProductQuickActions;