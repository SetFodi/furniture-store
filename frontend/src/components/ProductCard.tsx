// src/components/ProductCard.tsx
import React from "react";
import Image from "next/image"; // Use Next.js Image for optimization
import Link from "next/link";
import { Product } from "@/types"; // Import the Product type

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 ease-in-out group-hover:shadow-xl">
        {/* Product Image */}
        <div className="relative w-full h-64 bg-gray-200">
          {" "}
          {/* Fixed height container */}
          <Image
            // Use placeholder if imageUrl is somehow missing, though it's required in schema
            src={product.imageUrl || "https://placehold.co/600x400"}
            alt={product.name}
            fill // Makes the image fill the container
            style={{ objectFit: "cover" }} // Cover ensures aspect ratio is maintained while filling
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Help Next.js optimize image loading
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate mb-1 group-hover:text-indigo-600">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <p className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {/* Optional: Add rating or other details here */}
          {/* <div className="flex items-center mt-2">
            ⭐ {product.rating?.toFixed(1) || 'N/A'} ({product.numReviews || 0})
          </div> */}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
