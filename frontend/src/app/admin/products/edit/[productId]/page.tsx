// src/app/admin/products/edit/[productId]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm'; // Import the reusable form
import { Product } from '@/types';
import Link from 'next/link';

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
    role?: string;
  };
}

const EditProductPage: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string; // Get product ID from route

  const [product, setProduct] = useState<Product | null>(null); // State for initial product data
  const [isLoadingData, setIsLoadingData] = useState(true); // Loading state for fetching data
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // --- Fetch existing product data ---
  useEffect(() => {
    if (!productId || !apiUrl) {
       setError("Product ID or API URL missing.");
       setIsLoadingData(false);
       return;
    }

    const fetchProduct = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        // Use public endpoint to get product details
        const res = await fetch(`${apiUrl}/products/${productId}`, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch product data');
        }
        setProduct(data.data as Product);

      } catch (err: any) {
        setError(err.message);
        console.error("Fetch product error:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchProduct();
  }, [productId, apiUrl]);


  // --- Handler for form submission (Update) ---
  const handleUpdateProduct = async (formData: Partial<Product>) => {
    if (status !== 'authenticated' || !session?.accessToken || session?.user?.role !== 'admin') {
       setError("Unauthorized"); return;
    }
    if (!apiUrl || !productId) { setError("API URL or Product ID missing"); return; }

    setIsSubmitting(true);
    setError(null);

    try {
       const res = await fetch(`${apiUrl}/admin/products/${productId}`, { // Use PUT and include ID
          method: 'PUT',
          headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(formData), // Send updated fields
       });

       const data = await res.json();

       if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to update product');
       }

       alert('Product updated successfully!');
       router.push('/admin/products'); // Redirect to product list
       // Optionally revalidate paths if using caching
       // router.refresh();

    } catch (err: any) {
       setError(err.message);
       console.error("Update product error:", err);
       setIsSubmitting(false); // Allow retry on error
    }
    // No need to set isSubmitting false on success due to redirect
  };

  // --- Render States ---
  if (isLoadingData) return <div>Loading product data...</div>;
  // Show error if data fetching failed
  if (error && !product) return <div className="p-4 text-red-600">Error loading product: {error}</div>;
  // Handle case where product wasn't found (though error should catch it)
  if (!product) return <div className="p-4 text-orange-600">Product not found.</div>;
  // AdminGuard handles main auth, but add extra check
  if (status !== 'authenticated' || session?.user?.role !== 'admin') {
     return <div className="p-4 text-red-600">Access Denied. You must be an admin.</div>;
  }


  return (
    <div>
      <div className="mb-4">
         <Link href="/admin/products" className="text-indigo-600 hover:underline text-sm">
            &larr; Back to Products
         </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      {/* Display submission errors */}
      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-300 rounded">{error}</div>}

      {/* Render the form with initial data */}
      <ProductForm
        initialData={product} // Pass fetched product data
        onSubmit={handleUpdateProduct}
        isSubmitting={isSubmitting}
        submitButtonText="Update Product"
      />
    </div>
  );
};

export default EditProductPage;
