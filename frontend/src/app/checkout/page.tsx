// src/app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input";   // Import Input
import { Label } from "@/components/ui/label";   // Import Label
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"; // Import Card components
import { toast } from "react-hot-toast";         // Import toast

// Extend session type
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
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };

  const [formData, setFormData] = useState({ name: "", email: "", address: "", city: "", postalCode: "", country: "United States" });
  const [isProcessing, setIsProcessing] = useState(false);
  // const [error, setError] = useState<string | null>(null); // Use toast instead

  // Auth Check & Empty Cart Redirect (remains the same)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?callbackUrl=/checkout`);
    }
    if (status !== "loading" && cartItems.length === 0 && !isProcessing) {
      router.replace("/products");
    }
  }, [status, router, cartItems, isProcessing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Only for Input now
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler specifically for Select component
  const handleCountryChange = (value: string) => {
     setFormData((prev) => ({ ...prev, country: value }));
  };

  // Calculate totals (remains the same)
  const subtotal = getCartTotal();
  const taxPrice = subtotal * 0.08;
  const shippingPrice = subtotal > 100 ? 0 : 15;
  const totalPrice = subtotal + taxPrice + shippingPrice;
  const totalItems = getItemCount();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss(); // Clear previous toasts

    if (status !== "authenticated" || !session?.accessToken) {
      toast.error("Authentication required or token missing."); return;
    }
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.postalCode) {
      toast.error("Please fill in all required shipping fields."); return;
    }
    if (!apiUrl) { toast.error("API endpoint not configured."); return; }

    setIsProcessing(true);

    const orderData = { /* ... (order data remains the same) ... */
      orderItems: cartItems.map((item) => ({ product: item._id, name: item.name, quantity: item.quantity, imageUrl: item.imageUrl, price: item.price })),
      shippingAddress: { name: formData.name, email: formData.email, address: formData.address, city: formData.city, postalCode: formData.postalCode, country: formData.country },
      taxPrice: parseFloat(taxPrice.toFixed(2)),
      shippingPrice: parseFloat(shippingPrice.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    };

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      if (!response.ok) { throw new Error(responseData.message || `Order placement failed: ${response.statusText}`); }

      toast.success("Order placed successfully!");
      clearCart();
      const newOrderId = responseData.data?._id;
      router.push(newOrderId ? `/order-success?orderId=${newOrderId}` : "/order-success");

    } catch (err: any) {
      console.error("Order placement API error:", err);
      toast.error(err.message || "Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  // Loading/Checking States (remain the same)
  if (status === "loading") { return <div className="text-center p-10">Loading session...</div>; }
  if (status !== "authenticated" || cartItems.length === 0) { return <div className="text-center p-10">Checking cart and session...</div>; }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Shipping/Billing Form */}
        <Card className="lg:w-3/5"> {/* Use Card */}
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required disabled={isProcessing} />
              </div>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required disabled={isProcessing} />
              </div>
            </div>
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Street Address <span className="text-red-500">*</span></Label>
              <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required disabled={isProcessing} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required disabled={isProcessing} />
              </div>
              {/* Postal Code */}
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code <span className="text-red-500">*</span></Label>
                <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required disabled={isProcessing} />
              </div>
              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select name="country" value={formData.country} onValueChange={handleCountryChange} disabled={isProcessing}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                    {/* Add more countries */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Mock Payment Section */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
              <p className="text-sm text-muted-foreground">
                This is a simulated checkout. No real payment will be processed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <div className="lg:w-2/5">
          <Card className="sticky top-24"> {/* Use Card and keep sticky */}
            <CardHeader>
              <CardTitle>Your Order ({totalItems} items)</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mini Cart Items */}
              <div className="max-h-60 overflow-y-auto mb-4 space-y-3 pr-2 border-b pb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center text-sm gap-3">
                    <div className="relative w-12 h-12 mr-1 flex-shrink-0">
                      <Image src={item.imageUrl || "https://placehold.co/50x50"} alt={item.name} fill style={{ objectFit: "cover" }} className="rounded" sizes="50px"/>
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-foreground w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              {/* Totals */}
              <div className="space-y-1 text-sm mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shippingPrice === 0 ? "Free" : `$${shippingPrice.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Est. Tax</span><span>${taxPrice.toFixed(2)}</span></div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg"><span>Order Total</span><span>${totalPrice.toFixed(2)}</span></div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3"> {/* Use CardFooter */}
               <Button type="submit" disabled={isProcessing} className="w-full" size="lg">
                 {isProcessing ? "Processing..." : "Place Order"}
               </Button>
               <Link href="/cart" legacyBehavior={false}> {/* Use standard Link behavior */}
   <Button variant="outline" className="w-full"> {/* Removed asChild */}
      &larr; Return to Cart
   </Button>
</Link>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
