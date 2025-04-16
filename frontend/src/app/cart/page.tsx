// src/app/cart/page.tsx
"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/types";

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
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">Your Cart is Empty</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-700 dark:text-gray-200">Cart Items ({totalItems})</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium hover:underline transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {cartItems.map((item: CartItem) => (
                <li key={item._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="relative w-full sm:w-24 h-24 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <Image
                        src={item.imageUrl || "https://placehold.co/100x100"}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                        sizes="(max-width: 640px) 100vw, 96px"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <Link
                        href={`/products/${item._id}`}
                        className="font-semibold text-lg text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {item.name}
                      </Link>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                        <div className="flex items-center">
                          <p className="text-gray-600 dark:text-gray-400 mr-2 text-sm">Unit Price:</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center">
                          <label
                            htmlFor={`quantity-${item._id}`}
                            className="text-gray-600 dark:text-gray-400 mr-3 text-sm"
                          >
                            Quantity:
                          </label>
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none"
                              aria-label="Decrease quantity"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <input
                              id={`quantity-${item._id}`}
                              type="number"
                              min="1"
                              max={item.stock}
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                              className="w-12 text-center border-x border-gray-300 dark:border-gray-600 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                              aria-label={`Quantity for ${item.name}`}
                            />
                            <button 
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none"
                              aria-label="Increase quantity"
                              disabled={item.quantity >= (item.stock || 999)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Remove
                        </button>
                        <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 sticky top-24">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Order Summary</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                {shipping === 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-400 flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Free shipping applied! Orders over $100 qualify for free shipping.</span>
                  </div>
                )}
                
                {shipping > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400 flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Add ${(100 - subtotal).toFixed(2)} more to qualify for free shipping!</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="text-gray-800 dark:text-gray-200">Order Total</span>
                  <span className="text-indigo-700 dark:text-indigo-400">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-center font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </Link>
              
              <Link
                href="/products"
                className="block w-full text-center mt-4 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium py-2 transition-colors"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;