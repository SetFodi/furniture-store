// src/components/ProductCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import ProductQuickActions from "./ProductQuickActions";

interface ProductCardProps {
  product: Product;
}

// This is a server component for the main card
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(product.price);
  
  // Display ratings stars
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < Math.floor(rating)
                ? "text-primary fill-primary"
                : i < rating
                ? "text-primary fill-primary opacity-50"
                : "text-muted-foreground"
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          ({product.numReviews})
        </span>
      </div>
    );
  };

  // Verify the imageUrl to ensure it's a furniture image
  // This is a basic check to filter out non-furniture images
  const isFurnitureImage = (url: string): boolean => {
    // These are common keywords that might indicate non-furniture images
    const nonFurnitureKeywords = ['supermarket', 'grocery', 'store', 'shelf', 'aisle'];
    const lowerUrl = url.toLowerCase();
    
    // Return false if any keyword is found in the URL
    return !nonFurnitureKeywords.some(keyword => lowerUrl.includes(keyword));
  };
  
  // Use a fallback image if the product image isn't a furniture image
  const imageUrl = product.imageUrl && isFurnitureImage(product.imageUrl) 
    ? product.imageUrl 
    : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1170&q=80"; // Fallback furniture image

  return (
    <div className="h-full group hover:-translate-y-2 transition-transform duration-300">
      <Link href={`/products/${product._id}`} className="block h-full">
        <Card 
          className="overflow-hidden h-full flex flex-col bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer"
        >
          {/* Product Image with Hover Effect */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/30">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            
            {/* Category Badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground text-xs px-2 py-1"
            >
              {product.category}
            </Badge>
            
            {/* Display stock status if low */}
            {product.stock <= 5 && (
              <Badge 
                variant="destructive" 
                className="absolute top-3 right-3 text-xs"
              >
                {product.stock === 0 ? 'Sold Out' : 'Low Stock'}
              </Badge>
            )}
            
            {/* Add to cart button overlay */}
            <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}>
              <ProductQuickActions productId={product._id} />
            </div>
          </div>
          
          {/* Product Info */}
          <CardContent className="p-4 flex-grow flex flex-col">
            <h3 className="font-medium text-base sm:text-lg leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            {/* Product material and rating */}
            <div className="mt-2 flex flex-col space-y-1">
              {product.material && (
                <p className="text-xs text-muted-foreground">
                  {product.material}
                </p>
              )}
              {product.rating > 0 && renderRatingStars(product.rating)}
            </div>
          </CardContent>
          
          {/* Price and dimensions */}
          <CardFooter className="p-4 pt-0 mt-auto border-t border-border/50">
            <div className="w-full flex justify-between items-center">
              <p className="text-lg font-semibold text-foreground">
                {formattedPrice}
              </p>
              {product.dimensions && (
                <span className="text-xs text-muted-foreground">
                  {product.dimensions.width}×{product.dimensions.depth} cm
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
};

export default ProductCard;