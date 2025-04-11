// src/app/order-success/page.tsx
import React from "react";
import Link from "next/link";

const OrderSuccessPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 max-w-md mx-auto">
        <strong className="font-bold">Order Placed Successfully!</strong>
        <span className="block sm:inline">
          {" "}
          Thank you for your purchase (Simulation).
        </span>
      </div>
      <h1 className="text-2xl font-semibold mb-4">
        Your Order is Confirmed
      </h1>
      <p className="text-gray-600 mb-8">
        We've received your order and will process it shortly. (This is
        a simulation - no real order was placed).
      </p>
      {/* Optional: Display Order ID if passed via query params */}
      {/* <p>Order ID: {searchParams.get('orderId')}</p> */}
      <Link
        href="/products"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded transition duration-300"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccessPage;
