// src/app/admin/products/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types'; // Import Product type

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
    role?: string;
  };
}

const AdminProductsPage: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null); // Track deleting state
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch all products (using public endpoint for display)
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      if (!apiUrl) { setError("API URL missing"); setIsLoading(false); return; }

      try {
        // Use the public endpoint to get the list
        const res = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data.success) { throw new Error(data.message || 'Failed to fetch products'); }
        setProducts(data.data as Product[]);
      } catch (err: any) {
        setError(err.message); console.error("Fetch products error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [apiUrl]); // Re-fetch if apiUrl changes (it shouldn't)


  // --- Delete Handler ---
  const handleDeleteProduct = async (productId: string) => {
     if (!session?.accessToken || session?.user?.role !== 'admin') {
        alert("Unauthorized"); return;
     }
     if (!confirm(`Are you sure you want to delete product ${productId}?`)) {
        return;
     }

     setDeletingId(productId); // Show loading state for this product
     setError(null);

     try {
        const res = await fetch(`${apiUrl}/admin/products/${productId}`, {
           method: 'DELETE',
           headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
           throw new Error(data.message || 'Failed to delete product');
        }

        // Remove deleted product from local state
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
        alert(data.message || "Product deleted successfully!");

     } catch (err: any) {
        setError(err.message);
        alert(`Error deleting product: ${err.message}`);
        console.error("Delete product error:", err);
     } finally {
        setDeletingId(null); // Reset loading state
     }
  };
  // --- End Delete Handler ---


  if (isLoading) return <div className="text-center p-4">Loading products...</div>;
  // Show error but still allow viewing table if some products loaded before error
  // if (error && products.length === 0) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
         <h1 className="text-2xl font-semibold">Manage Products</h1>
         {/* Add "Create Product" button later */}
         <Link href="/admin/products/create" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm">
            + Create Product
         </Link>
      </div>

      {error && <div className="text-center p-4 mb-4 text-red-600 bg-red-100 border border-red-300 rounded">Error: {error}</div>}

       <div className="bg-white shadow-md rounded-lg overflow-x-auto">
         <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
             <tr>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
               <th scope="col" className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {products.map((product) => (
               <tr key={product._id}>
                 <td className="px-4 py-2 whitespace-nowrap">
                    <div className="relative h-10 w-10 flex-shrink-0">
                       <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded"
                          sizes="40px"
                       />
                    </div>
                 </td>
                 <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                 <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                   {/* Add Edit Link Later */}
                   <Link href={`/admin/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-900">
                     Edit
                   </Link>
                   <button
                     onClick={() => handleDeleteProduct(product._id)}
                     disabled={deletingId === product._id}
                     className={`text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                   >
                     {deletingId === product._id ? 'Deleting...' : 'Delete'}
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};

export default AdminProductsPage;
