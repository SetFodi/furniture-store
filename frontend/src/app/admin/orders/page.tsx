// src/app/admin/orders/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Order, User } from '@/types'; // Import types

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
    role?: string;
  };
}

// Define PopulatedOrder type (or adjust Order in types/index.ts)
interface PopulatedOrder extends Omit<Order, 'user'> {
   user: Pick<User, '_id' | 'name' | 'email'> | null;
}

const AdminOrdersPage: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const [orders, setOrders] = useState<PopulatedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null); // State to track which order is being updated
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

   useEffect(() => {
     // Fetch logic remains the same...
     if (status === 'authenticated' && session?.user?.role === 'admin' && session.accessToken) {
       fetchOrders(); // Call fetchOrders defined below
     } else if (status !== 'loading') {
        setIsLoading(false);
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [session, status]); // Removed apiUrl from dependency array as it's constant


   const fetchOrders = async () => {
     setIsLoading(true);
     setError(null);
     if (!apiUrl) { setError("API URL missing"); setIsLoading(false); return; }

     try {
       const res = await fetch(`${apiUrl}/admin/orders`, {
         headers: { Authorization: `Bearer ${session!.accessToken}` }, // Use non-null assertion as checked above
         cache: 'no-store',
       });
       const data = await res.json();
       if (!res.ok || !data.success) { throw new Error(data.message || 'Failed to fetch orders'); }
       setOrders(data.data as PopulatedOrder[]);
     } catch (err: any) {
       setError(err.message); console.error("Fetch orders error:", err);
     } finally {
       setIsLoading(false);
     }
   };

   // --- Handler for Marking as Delivered ---
   const handleMarkDelivered = async (orderId: string) => {
      if (!session?.accessToken) {
         alert("Authentication error. Please refresh or log in again.");
         return;
      }
      if (!confirm("Mark this order as delivered?")) { // Confirmation dialog
         return;
      }

      setUpdatingOrderId(orderId); // Indicate loading for this specific order
      setError(null);

      try {
         const res = await fetch(`${apiUrl}/admin/orders/${orderId}/deliver`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${session.accessToken}` },
         });
         const data = await res.json();

         if (!res.ok || !data.success) {
            throw new Error(data.message || 'Failed to update order status');
         }

         // Option 1: Re-fetch all orders to get updated list
         // fetchOrders();

         // Option 2: Update local state directly for faster UI update
         setOrders(prevOrders =>
            prevOrders.map(order =>
               order._id === orderId
                  ? { ...order, isDelivered: true, deliveredAt: data.data.deliveredAt } // Use updated data from response
                  : order
            )
         );
         alert("Order marked as delivered!"); // Simple feedback

      } catch (err: any) {
         setError(err.message);
         alert(`Error: ${err.message}`); // Show error to user
         console.error("Update delivery status error:", err);
      } finally {
         setUpdatingOrderId(null); // Stop loading indicator for this order
      }
   };
   // --- End Handler ---


  if (isLoading) return <div className="text-center p-4">Loading orders...</div>;
  if (error && orders.length === 0) return <div className="text-center p-4 text-red-600">Error: {error}</div>; // Show error only if no orders loaded

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Manage Orders</h1>
      {error && <div className="text-center p-4 mb-4 text-red-600 bg-red-100 border border-red-300 rounded">Error: {error}</div>} {/* Show error above table if orders are present */}
       <div className="bg-white shadow-md rounded-lg overflow-x-auto">
         <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
             <tr>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
               <th scope="col" className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {orders.map((order) => (
               <tr key={order._id}>
                 <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{order._id}</td>
                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                   {order.user ? order.user.name : 'N/A'}
                   <div className="text-xs text-gray-500">{order.user ? order.user.email : ''}</div>
                 </td>
                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${order.totalPrice.toFixed(2)}</td>
                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                   {order.isPaid ? ( <span className="text-green-600">✓ {new Date(order.paidAt!).toLocaleDateString()}</span> ) : ( <span className="text-red-600">✗</span> )}
                 </td>
                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.isDelivered ? (
                     <span className="text-green-600">✓ {new Date(order.deliveredAt!).toLocaleDateString()}</span>
                   ) : (
                     // --- Add Button Here ---
                     <button
                        onClick={() => handleMarkDelivered(order._id)}
                        disabled={updatingOrderId === order._id} // Disable button while updating this specific order
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                           updatingOrderId === order._id
                           ? 'bg-gray-300 text-gray-500 cursor-wait'
                           : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        } transition duration-150 ease-in-out`}
                     >
                        {updatingOrderId === order._id ? 'Updating...' : 'Mark Delivered'}
                     </button>
                     // --- End Button ---
                   )}
                 </td>
                 <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <Link href={`/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900">
                     Details
                   </Link>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};

export default AdminOrdersPage;
