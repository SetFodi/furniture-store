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
  if (isLoading) { return <div className="text-center p-10">Loading orders...</div>; }
  if (error) { return <div className="text-center p-10 text-red-600">Error: {error}</div>; }
  if (orders.length === 0) { return ( <div className="text-center p-10"><h1 className="text-2xl font-semibold mb-4">My Orders</h1><p className="text-gray-500 mb-6">You haven't placed any orders yet.</p><Link href="/products" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition duration-300">Start Shopping</Link></div> ); }

  // --- Render Orders List ---
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-100 p-4 flex flex-wrap justify-between items-center text-sm text-gray-600 gap-x-4 gap-y-2"> {/* Increased gap-y */}
              <div><span className="font-semibold mr-1">Order ID:</span><span className="font-mono text-xs">{order._id}</span></div>
              <div><span className="font-semibold mr-1">Date:</span><span>{new Date(order.createdAt).toLocaleDateString()}</span></div>
              <div><span className="font-semibold mr-1">Total:</span><span className="font-bold text-gray-800">${order.totalPrice.toFixed(2)}</span></div>
              {/* --- Added View Details Link --- */}
              <div className="w-full sm:w-auto text-right"> {/* Ensure link aligns well */}
                <Link href={`/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition duration-200">
                  View Details
                </Link>
              </div>
              {/* --- End Link --- */}
            </div>
            {/* Order Body */}
            <div className="p-4">
              {/* Simplified item preview */}
              <ul className="space-y-1 mb-3 text-sm">
                {order.orderItems.slice(0, 3).map((item, index) => ( // Show first few items
                  <li key={item.product + '-' + index} className="flex items-center gap-2">
                    <span className="font-medium w-6 text-right">{item.quantity}x</span>
                    <span className="flex-grow text-gray-700 truncate">{item.name}</span>
                  </li>
                ))}
                {order.orderItems.length > 3 && <li className="text-gray-500 text-xs">...and {order.orderItems.length - 3} more</li>}
              </ul>
              <div className="pt-3 border-t text-sm space-y-1">
                 <p><span className="font-semibold">Status:</span> {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt!).toLocaleDateString()}` : "Processing"}</p>
                 {/* Removed shipping address preview from list view for brevity */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
