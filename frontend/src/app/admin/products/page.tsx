"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Loader2, PlusCircle, Package } from 'lucide-react';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch logic (remains the same)
  useEffect(() => {
    const fetchProducts = async () => { /* ... */
      setIsLoading(true); setError(null);
      if (!apiUrl) { setError("API URL missing"); setIsLoading(false); return; }
      try {
        const res = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data.success) { throw new Error(data.message || 'Failed to fetch products'); }
        setProducts(data.data as Product[]);
      } catch (err: any) { setError(err.message); console.error("Fetch products error:", err); }
      finally { setIsLoading(false); }
    };
    fetchProducts();
  }, [apiUrl]);

  // Delete Handler (remains the same)
  const handleDeleteProduct = async (productId: string) => { /* ... */
     if (!session?.accessToken || session?.user?.role !== 'admin') { alert("Unauthorized"); return; }
     if (!confirm(`Delete product ${productId}?`)) { return; }
     setDeletingId(productId); setError(null);
     try {
       const res = await fetch(`${apiUrl}/admin/products/${productId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${session.accessToken}` } });
       const data = await res.json();
       if (!res.ok || !data.success) { throw new Error(data.message || 'Failed to delete product'); }
       setProducts(prev => prev.filter(p => p._id !== productId));
       alert(data.message || "Product deleted!");
     } catch (err: any) { setError(err.message); alert(`Error: ${err.message}`); console.error("Delete product error:", err); }
     finally { setDeletingId(null); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading products...</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Products</h1>
        </div>
        
        <Link href="/admin/products/create" legacyBehavior={false}>
          <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Product
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <Trash2 className="h-5 w-5 flex-shrink-0" />
          <span>Error: {error}</span>
        </div>
      )}

      <div className="border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700/50">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[80px]">Stock</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500 dark:text-gray-400">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <TableCell>
                    <div className="relative h-14 w-14 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        className="rounded-md" 
                        sizes="60px" 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{product.name}</TableCell>
                  <TableCell className="text-gray-800 dark:text-gray-200 font-medium">${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      product.stock > 10 
                        ? 'text-green-600 dark:text-green-400' 
                        : product.stock > 0 
                          ? 'text-yellow-600 dark:text-yellow-400' 
                          : 'text-red-600 dark:text-red-400'
                    }`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Link href={`/admin/products/edit/${product._id}`} legacyBehavior={false} title="Edit Product">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProduct(product._id)}
                      disabled={deletingId === product._id}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete Product"
                    >
                      {deletingId === product._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProductsPage;