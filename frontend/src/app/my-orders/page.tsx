// src/app/my-orders/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Order } from "@/types"; // <<< Import Order type from centralized file

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
  };
}

// --- Remove inline Order type definitions ---
// interface OrderItem { ... } // REMOVED
// interface ShippingAddress { ... } // REMOVED
// interface Order { ... } // REMOVED
// --- End Removal ---

const MyOrdersPage: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: "loading" | "authenticated" | "unauthenticated" };
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]); // <<< Use imported Order type
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
          // Assign fetched data, ensuring it matches the imported Order type structure
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
        {orders.map((order) => ( // order object here conforms to the imported Order type
          <div key={order._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-100 p-4 flex flex-wrap justify-between items-center text-sm text-gray-600 gap-x-4 gap-y-1">
              <div><span className="font-semibold mr-1">Order ID:</span><span className="font-mono text-xs">{order._id}</span></div>
              <div><span className="font-semibold mr-1">Date:</span><span>{new Date(order.createdAt).toLocaleDateString()}</span></div>
              <div><span className="font-semibold mr-1">Total:</span><span className="font-bold text-gray-800">${order.totalPrice.toFixed(2)}</span></div>
            </div>
            {/* Order Body */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3">Items</h3>
              <ul className="space-y-3 mb-4">
                {/* Use item.product or index as key if item._id isn't guaranteed from backend */}
                {order.orderItems.map((item, index) => (
                  <li key={item.product + '-' + index} className="flex items-center text-sm gap-2">
                    <span className="font-medium w-6 text-right">{item.quantity}x</span>
                    <span className="flex-grow text-gray-800">{item.name}</span>
                    <span className="text-gray-600 w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t text-sm space-y-1">
                 <p><span className="font-semibold">Status:</span> {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt!).toLocaleDateString()}` : "Processing"}</p>
                 <p><span className="font-semibold">Shipping To:</span> {order.shippingAddress.name}, {order.shippingAddress.address}, {order.shippingAddress.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
