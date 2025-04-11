// src/app/cart/page.tsx
"use client"; // Mark as a Client Component

import React from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/types"; // Import CartItem type

const CartPage: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
    getItemCount,
  } = useCart();

  const handleQuantityChange = (
    productId: string,
    newQuantity: number
  ) => {
    // Basic validation, ensure quantity is a positive number
    const quantity = Math.max(1, Number(newQuantity) || 1);
    updateQuantity(productId, quantity);
  };

  const totalItems = getItemCount();
  const subtotal = getCartTotal();
  // Example: Add tax and shipping later if needed
  const tax = subtotal * 0.08; // Example 8% tax
  const shipping = subtotal > 100 ? 0 : 15; // Example free shipping over $100
  const total = subtotal + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
          <Link
            href="/products"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item: CartItem) => (
                  <li key={item._id} className="flex items-center p-4">
                    <div className="relative w-20 h-20 mr-4 flex-shrink-0">
                      <Image
                        src={item.imageUrl || "https://placehold.co/100x100"}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-grow">
                      <Link
                        href={`/products/${item._id}`}
                        className="font-semibold text-gray-800 hover:text-indigo-600"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2">
                        <label
                          htmlFor={`quantity-${item._id}`}
                          className="text-sm mr-2"
                        >
                          Qty:
                        </label>
                        <input
                          id={`quantity-${item._id}`}
                          type="number"
                          min="1"
                          max={item.stock} // Set max based on stock
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item._id, parseInt(e.target.value))
                          }
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          aria-label={`Quantity for ${item.name}`}
                        />
                      </div>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1 font-medium"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={clearCart}
              className="mt-4 text-sm text-gray-500 hover:text-red-600 font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
              {" "}
              {/* sticky top-24 to make it stick below header */}
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
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
              <Link
                href="/checkout" // Link to the checkout page (next step)
                className="block w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
