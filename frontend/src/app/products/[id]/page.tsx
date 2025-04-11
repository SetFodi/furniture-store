// src/app/products/[id]/page.tsx
import { Product } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import AddToCartButton from "@/components/AddToCartButton"; // 1. Import the component

// Define props type, including params for dynamic route
interface ProductPageProps {
  params: {
    id: string;
  };
}

// Function to fetch a single product by ID (remains the same)
async function getProduct(id: string): Promise<Product | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL not defined.");
    return null;
  }
  try {
    const res = await fetch(`${apiUrl}/products/${id}`, { cache: "no-store" });
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error(
        `Failed to fetch product ${id}: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "API returned an error");
    }
    return data.data as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

// The Page component (Async component)
const ProductDetailPage: React.FC<ProductPageProps> = async ({ params }) => {
  const productId = params.id;
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  // 2. Remove the placeholder handleAddToCart function
  // const handleAddToCart = () => { ... }; // REMOVED

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Image Section (remains the same) */}
        <div className="lg:w-1/2">
          <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={product.imageUrl || "https://placehold.co/600x600"}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto">
              <div className="relative w-20 h-20 border-2 border-indigo-500 rounded">
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} main`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded"
                  sizes="80px"
                />
              </div>
              {product.images.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 border border-gray-300 rounded hover:border-indigo-400 cursor-pointer"
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Section (remains the same up to the button) */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-indigo-600 mb-4">
            ${product.price.toFixed(2)}
          </p>
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>
          <div className="mb-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Details
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {product.material && <li>Material: {product.material}</li>}
              {product.dimensions && (
                <li>
                  Dimensions:{" "}
                  {`${product.dimensions.width || "N/A"}cm W x ${product.dimensions.height || "N/A"}cm H x ${product.dimensions.depth || "N/A"}cm D`}
                </li>
              )}
              <li>
                Stock:{" "}
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    Out of Stock
                  </span>
                )}
              </li>
            </ul>
          </div>

          {/* 3. Replace the old button logic with the AddToCartButton component */}
          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
