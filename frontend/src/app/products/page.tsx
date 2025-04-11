// src/app/products/page.tsx
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import React from "react";

// Function to fetch products from the backend API
async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error(
      "API URL is not defined. Please check your environment variables."
    );
  }

  try {
    // Use { cache: 'no-store' } to ensure fresh data on every request during development
    // or revalidatePath / revalidateTag for production ISR/SSR strategies
    const res = await fetch(`${apiUrl}/products`, { cache: "no-store" });

    if (!res.ok) {
      // Throw an error if the response status is not OK
      throw new Error(
        `Failed to fetch products: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    if (!data.success) {
      // Handle cases where the API returns success: false
      throw new Error(data.message || "API returned an error");
    }

    return data.data as Product[]; // Assuming the API returns { success: boolean, count: number, data: Product[] }
  } catch (error) {
    console.error("Error fetching products:", error);
    // In a real app, you might want to show a user-friendly error message
    // For now, we'll return an empty array or re-throw the error
    return []; // Return empty array to prevent crashing the page
    // Or re-throw: throw error;
  }
}

// The Page component itself (Async component)
const ProductsPage = async () => {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Our Furniture</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No products found. Check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
