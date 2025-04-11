// src/app/admin/products/create/page.tsx
"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm'; // Import the form
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

const CreateProductPage: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Handler for form submission
  const handleCreateProduct = async (formData: Partial<Product>) => {
    if (status !== 'authenticated' || !session?.accessToken || session?.user?.role !== 'admin') {
       setError("Unauthorized"); return;
    }
    if (!apiUrl) { setError("API URL missing"); return; }

    setIsSubmitting(true);
    setError(null);

    try {
       const res = await fetch(`${apiUrl}/admin/products`, {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(formData),
       });

       const data = await res.json();

       if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to create product');
       }

       alert('Product created successfully!');
       router.push('/admin/products'); // Redirect to product list on success
       // Optionally revalidate product list path if using caching:
       // router.refresh(); // Or use revalidatePath

    } catch (err: any) {
       setError(err.message);
       console.error("Create product error:", err);
       setIsSubmitting(false); // Allow retry on error
    }
    // No need to set isSubmitting false on success due to redirect
  };

  // Render loading or unauthorized state if needed (AdminGuard should handle most)
  if (status === 'loading') return <div>Loading...</div>;
  // AdminGuard handles redirection, but add a check just in case
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
      <h1 className="text-2xl font-semibold mb-4">Create New Product</h1>
      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-300 rounded">{error}</div>}
      <ProductForm
        onSubmit={handleCreateProduct}
        isSubmitting={isSubmitting}
        submitButtonText="Create Product"
      />
    </div>
  );
};

export default CreateProductPage;
