// src/app/checkout/page.tsx
"use client"; // Client component for form handling and cart interaction

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation"; // For redirection
import Link from "next/link";
import Image from "next/image";

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const router = useRouter();

  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States", // Default value
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing) {
      // Redirect only if not currently processing an order
      router.push("/products"); // Or back to cart page
    }
  }, [cartItems, router, isProcessing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);

    // --- Order Simulation ---
    console.log("--- Placing Order (Simulation) ---");
    console.log("Customer Info:", formData);
    console.log("Order Items:", cartItems);
    console.log("Order Total:", getCartTotal().toFixed(2));
    console.log("---------------------------------");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, you would send this data to your backend API here
    // to create an order record in the database.
    // Example:
    // try {
    //   const response = await fetch('/api/orders', { // Your backend order endpoint
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       orderItems: cartItems,
    //       shippingAddress: formData,
    //       totalPrice: getCartTotal(),
    //       // Add payment details/status if implementing mock payment
    //     }),
    //   });
    //   if (!response.ok) throw new Error('Order placement failed');
    //   const orderData = await response.json();
    //   console.log('Order placed successfully:', orderData);
    //   clearCart();
    //   router.push(`/order-success?orderId=${orderData.id}`); // Redirect with order ID
    // } catch (err) {
    //   console.error("Order placement error:", err);
    //   setError(err.message || 'Failed to place order. Please try again.');
    //   setIsProcessing(false);
    //   return; // Stop execution
    // }

    // --- Post-Simulation Actions ---
    clearCart(); // Clear the cart after "successful" simulation
    router.push("/order-success"); // Redirect to a success page
    // Note: We don't set isProcessing back to false here because we are navigating away.
  };

  // Calculate totals (could be moved to context if needed elsewhere)
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // Example tax
  const shipping = subtotal > 100 ? 0 : 15; // Example shipping
  const total = subtotal + tax + shipping;
  const totalItems = getItemCount();

  // Prevent rendering the form if cart is empty (avoids flash before redirect)
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">Your cart is empty.</p>
        {/* Optional: Add loading indicator or specific message */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <form
        onSubmit={handlePlaceOrder}
        className="flex flex-col lg:flex-row gap-8 lg:gap-12"
      >
        {/* Shipping/Billing Form */}
        <div className="lg:w-3/5 bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
                {/* Add more countries as needed */}
              </select>
            </div>
          </div>
          {/* Mock Payment Section (Optional) */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
            <p className="text-sm text-gray-600">
              This is a simulated checkout. No real payment will be
              processed. Click "Place Order" to complete the simulation.
            </p>
            {/* You could add dummy credit card fields here if desired */}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-2/5">
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Your Order ({totalItems} items)
            </h2>
            {/* Mini Cart Items */}
            <div className="max-h-60 overflow-y-auto mb-4 space-y-3 pr-2">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center text-sm">
                  <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                    <Image
                      src={item.imageUrl || "https://placehold.co/50x50"}
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded"
                      sizes="50px"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="space-y-2 mb-4 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Est. Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Order Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-center font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-wait"
            >
              {isProcessing ? "Processing..." : "Place Order (Simulated)"}
            </button>
            <Link
              href="/cart"
              className="block text-center mt-3 text-sm text-indigo-600 hover:text-indigo-800"
            >
              &larr; Return to Cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
