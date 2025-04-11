// src/app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

// Extend session type if needed for better type safety
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
  };
}

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Use custom session type
  const { data: session, status } = useSession() as { data: CustomSession | null; status: "loading" | "authenticated" | "unauthenticated" };

  const [formData, setFormData] = useState({ name: "", email: "", address: "", city: "", postalCode: "", country: "United States" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication Check and Empty Cart Redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?callbackUrl=/checkout`);
    }
    if (status !== "loading" && cartItems.length === 0 && !isProcessing) {
      router.replace("/products");
    }
  }, [status, router, cartItems, isProcessing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate totals
  const subtotal = getCartTotal();
  const taxPrice = subtotal * 0.08;
  const shippingPrice = subtotal > 100 ? 0 : 15;
  const totalPrice = subtotal + taxPrice + shippingPrice;
  const totalItems = getItemCount();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check authentication and token availability
    if (status !== "authenticated" || !session?.accessToken) {
      setError("Authentication required or token missing. Please log in again.");
      return;
    }

    // Form field validation
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.postalCode) {
      setError("Please fill in all required shipping fields."); return;
    }
    if (!apiUrl) { setError("API endpoint not configured."); return; }

    setIsProcessing(true);

    // Prepare order data (no userId needed in body)
    const orderData = {
      orderItems: cartItems.map((item) => ({ product: item._id, name: item.name, quantity: item.quantity, imageUrl: item.imageUrl, price: item.price })),
      shippingAddress: { name: formData.name, email: formData.email, address: formData.address, city: formData.city, postalCode: formData.postalCode, country: formData.country },
      taxPrice: parseFloat(taxPrice.toFixed(2)),
      shippingPrice: parseFloat(shippingPrice.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    };

    try {
      // Add Authorization header with backend JWT
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`, // <<< Use token from session
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      if (!response.ok) { throw new Error(responseData.message || `Order placement failed: ${response.statusText}`); }

      console.log("Order placed successfully via API:", responseData);
      clearCart();
      const newOrderId = responseData.data?._id;
      router.push(newOrderId ? `/order-success?orderId=${newOrderId}` : "/order-success");

    } catch (err: any) {
      console.error("Order placement API error:", err);
      setError(err.message || "Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  // Loading/Checking States
  if (status === "loading") { return <div className="text-center p-10">Loading session...</div>; }
  if (status !== "authenticated" || cartItems.length === 0) { return <div className="text-center p-10">Checking cart and session...</div>; }

  // Render Checkout Form and Summary
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Shipping/Billing Form */}
        <div className="lg:w-3/5 bg-white p-6 shadow-md rounded-lg">
           <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Input fields remain the same */}
             <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"/></div>
             <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"/></div>
             <div className="md:col-span-2"><label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label><input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"/></div>
             <div><label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label><input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"/></div>
             <div><label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code <span className="text-red-500">*</span></label><input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"/></div>
             <div className="md:col-span-2"><label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label><select id="country" name="country" value={formData.country} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"><option>United States</option><option>Canada</option><option>Mexico</option></select></div>
           </div>
           <div className="mt-6 border-t pt-4"><h3 className="text-lg font-semibold mb-3">Payment Details</h3><p className="text-sm text-gray-600">This is a simulated checkout...</p></div>
        </div>
        {/* Order Summary */}
        <div className="lg:w-2/5">
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Your Order ({totalItems} items)</h2>
            {/* Mini Cart Items */}
            <div className="max-h-60 overflow-y-auto mb-4 space-y-3 pr-2">
              {cartItems.map((item) => ( <div key={item._id} className="flex items-center text-sm"><div className="relative w-12 h-12 mr-3 flex-shrink-0"><Image src={item.imageUrl || "https://placehold.co/50x50"} alt={item.name} fill style={{ objectFit: "cover" }} className="rounded" sizes="50px"/></div><div className="flex-grow"><p className="font-medium text-gray-800">{item.name}</p><p className="text-gray-500">Qty: {item.quantity}</p></div><p className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</p></div> ))}
            </div>
            {/* Totals */}
            <div className="space-y-2 mb-4 border-t pt-4"><div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span>{shippingPrice === 0 ? "Free" : `$${shippingPrice.toFixed(2)}`}</span></div><div className="flex justify-between text-sm text-gray-600"><span>Est. Tax</span><span>${taxPrice.toFixed(2)}</span></div></div>
            <div className="border-t pt-4"><div className="flex justify-between font-bold text-lg"><span>Order Total</span><span>${totalPrice.toFixed(2)}</span></div></div>
            {error && (<p className="text-red-500 text-sm mt-4">{error}</p>)}
            <button type="submit" disabled={isProcessing || status !== 'authenticated'} className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-center font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-wait">{isProcessing ? "Processing..." : "Place Order"}</button>
            <Link href="/cart" className="block text-center mt-3 text-sm text-indigo-600 hover:text-indigo-800">&larr; Return to Cart</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
