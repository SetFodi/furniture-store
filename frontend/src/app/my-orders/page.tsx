// src/app/my-orders/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Order } from "@/types"; // Import Order type from centralized file

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
  };
}

const MyOrdersPage: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: "loading" | "authenticated" | "unauthenticated" };
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/my-orders");
      return;
    }

    if (status === "authenticated") {
      if (!session?.accessToken) {
        setError("Authentication token not available. Please log in again.");
        setIsLoading(false);
        return;
      }

      const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        if (!apiUrl) { setError("API URL not configured."); setIsLoading(false); return; }

        try {
          const res = await fetch(`${apiUrl}/orders/myorders`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            cache: "no-store",
          });

          const data = await res.json();
          if (!res.ok || !data.success) { throw new Error(data.message || "Failed to fetch orders."); }
          setOrders(data.data as Order[]);

        } catch (err: any) {
          console.error("Error fetching orders:", err);
          setError(err.message || "Could not load orders.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();

    } else if (status === "loading") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status, session, router, apiUrl]);

  // --- Render states (Loading, Error, No Orders) ---
  if (isLoading) { 
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-6"></div>
          <div className="h-40 w-full max-w-2xl bg-gray-100 dark:bg-gray-800 rounded-lg mx-auto"></div>
        </div>
      </div>
    ); 
  }
  
  if (error) { 
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 max-w-md bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <svg className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Error</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    ); 
  }
  
  if (orders.length === 0) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">My Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't placed any orders yet.</p>
          <Link href="/products" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    ); 
  }

  // --- Render Orders List ---
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-3">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 dark:text-gray-300 mr-2">Order ID:</span>
                  <span className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-300">{order._id}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 dark:text-gray-300 mr-2">Date:</span>
                  <span className="text-gray-700 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 dark:text-gray-300 mr-2">Total:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">${order.totalPrice.toFixed(2)}</span>
                </div>
                {/* Status Badge */}
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    order.isDelivered 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Order Body */}
            <div className="p-5">
              {/* Items preview */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Items</h3>
                <ul className="space-y-2">
                  {order.orderItems.slice(0, 3).map((item, index) => (
                    <li key={item.product + '-' + index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="font-medium w-8 h-8 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-full">{item.quantity}</span>
                      <span className="flex-grow text-gray-700 dark:text-gray-300">{item.name}</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                  {order.orderItems.length > 3 && (
                    <li className="text-gray-500 dark:text-gray-400 text-sm mt-1 pl-2">
                      + {order.orderItems.length - 3} more items
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <p className="flex items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-2">Status:</span> 
                    {order.isDelivered ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Delivered on {new Date(order.deliveredAt!).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400 flex items-center">
                        <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Processing
                      </span>
                    )}
                  </p>
                </div>
                <Link href={`/orders/${order._id}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors duration-200 group">
                  View Details
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;