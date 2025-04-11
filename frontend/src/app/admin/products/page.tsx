// src/app/admin/products/page.tsx
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
import { Trash2, Edit, Loader2, PlusCircle } from 'lucide-react'; // Added PlusCircle icon

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

  if (isLoading) return <div className="text-center p-4">Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
         <h1 className="text-2xl font-semibold">Manage Products</h1>
         {/* --- Corrected Create Product Button --- */}
         <Link href="/admin/products/create" legacyBehavior={false}>
            <Button size="sm"> {/* Removed asChild */}
               <PlusCircle className="mr-2 h-4 w-4" /> Create Product
            </Button>
         </Link>
         {/* --- End Correction --- */}
      </div>

      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-300 rounded">Error: {error}</div>}

       <div className="border rounded-lg">
         <Table>
           <TableHeader>
             <TableRow>
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
                   <TableCell colSpan={6} className="h-24 text-center"> No products found. </TableCell>
                </TableRow>
             ) : (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                       <div className="relative h-12 w-12 flex-shrink-0">
                          <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} className="rounded" sizes="50px" />
                       </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right space-x-1">
                      {/* Edit Button/Link (already corrected) */}
                      <Link href={`/admin/products/edit/${product._id}`} legacyBehavior={false} title="Edit Product">
                         <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                         </Button>
                      </Link>
                      {/* Delete Button (already corrected) */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deletingId === product._id}
                        className="text-destructive hover:text-destructive/80"
                        title="Delete Product"
                      >
                         {deletingId === product._id ? ( <Loader2 className="h-4 w-4 animate-spin" /> ) : ( <Trash2 className="h-4 w-4" /> )}
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
