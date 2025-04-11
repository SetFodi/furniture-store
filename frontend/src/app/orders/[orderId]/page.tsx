// src/app/orders/[orderId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation"; // Use useParams for dynamic route params
import Link from "next/link";
import Image from "next/image";
import { Order, OrderItem, ShippingAddress } from "@/types"; // Import types

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
  };
}

const OrderDetailsPage: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const router = useRouter();
  const params = useParams(); // Hook to get route parameters
  const orderId = params.orderId as string; // Get orderId from params

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Redirect if not authenticated or session loading failed
    if (status === "unauthenticated") {
      router.replace(`/login?callbackUrl=/orders/${orderId}`);
      return;
    }

    // Fetch order details only when authenticated and orderId is available
    if (status === "authenticated" && orderId) {
      if (!session?.accessToken) {
        setError("Authentication token not available.");
        setIsLoading(false);
        return;
      }

      const fetchOrderDetails = async () => {
        setIsLoading(true);
        setError(null);
        if (!apiUrl) { setError("API URL not configured."); setIsLoading(false); return; }

        try {
          const res = await fetch(`${apiUrl}/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            cache: "no-store",
          });

          const data = await res.json();

          if (!res.ok) {
             // Handle specific errors like 401 (Unauthorized) or 404 (Not Found)
             if (res.status === 401) {
                throw new Error("You are not authorized to view this order.");
             } else if (res.status === 404) {
                throw new Error("Order not found.");
             } else {
                throw new Error(data.message || "Failed to fetch order details.");
             }
          }
          if (!data.success) { // Check success flag from backend response
             throw new Error(data.message || "API returned an error.");
          }

          setOrder(data.data as Order);

        } catch (err: any) {
          console.error("Error fetching order details:", err);
          setError(err.message || "Could not load order details.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrderDetails();
    } else if (status === "loading") {
      setIsLoading(true);
    } else {
      // Handle cases where orderId might be missing initially
      if (!orderId && status !== 'loading') {
         setError("Order ID missing.");
         setIsLoading(false);
      }
    }
  }, [status, session, orderId, router, apiUrl]);


  // --- Render States ---
  if (isLoading) { return <div className="text-center p-10">Loading order details...</div>; }
  if (error) { return <div className="text-center p-10 text-red-600">Error: {error}</div>; }
  if (!order) { return <div className="text-center p-10">Order not found.</div>; } // Should be caught by error state mostly

  // --- Render Order Details ---
  const { shippingAddress, orderItems, taxPrice, shippingPrice, totalPrice, createdAt, isDelivered, deliveredAt } = order;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Order Details</h1>
      <p className="text-sm text-gray-600 mb-6">
        Order ID: <span className="font-mono">{order._id}</span> | Placed on: {new Date(createdAt).toLocaleDateString()}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Info */}
        <div className="md:col-span-1 bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Shipping Address</h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p><span className="font-medium">Name:</span> {shippingAddress.name}</p>
            <p><span className="font-medium">Email:</span> {shippingAddress.email}</p>
            <p><span className="font-medium">Address:</span> {shippingAddress.address}</p>
            <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
            <p>{shippingAddress.country}</p>
          </div>
           <div className="mt-4 pt-3 border-t">
             <h3 className="font-semibold mb-1">Delivery Status</h3>
             {isDelivered ? (
               <p className="text-sm text-green-600">Delivered on {new Date(deliveredAt!).toLocaleDateString()}</p>
             ) : (
               <p className="text-sm text-orange-600">Not Delivered</p>
             )}
           </div>
        </div>

        {/* Order Summary & Items */}
        <div className="md:col-span-2 bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Order Summary</h2>
          {/* Items List */}
          <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-2">
            {orderItems.map((item, index) => (
              <div key={item.product + '-' + index} className="flex items-center text-sm gap-3 border-b pb-2 last:border-b-0">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image src={item.imageUrl || "https://placehold.co/100x100"} alt={item.name} fill style={{ objectFit: "cover" }} className="rounded" sizes="60px"/>
                </div>
                <div className="flex-grow">
                  <Link href={`/products/${item.product}`} className="font-medium text-gray-800 hover:text-indigo-600">{item.name}</Link>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-800 w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          {/* Totals */}
          <div className="space-y-1 text-sm border-t pt-3">
            <div className="flex justify-between"><span>Subtotal</span><span>${(totalPrice - taxPrice - shippingPrice).toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>${shippingPrice.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax</span><span>${taxPrice.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t"><span>Order Total</span><span>${totalPrice.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

       <div className="mt-8 text-center">
         <Link href="/my-orders" className="text-indigo-600 hover:text-indigo-800 font-medium">
           &larr; Back to My Orders
         </Link>
       </div>
    </div>
  );
};

export default OrderDetailsPage;
