// src/components/UserNav.tsx
"use client"; // This component needs client-side hooks

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const UserNav: React.FC = () => {
  const { data: session, status } = useSession(); // Get session data and status

  // Handle loading state
  if (status === "loading") {
    return <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>; // Placeholder for loading
  }

  // Handle authenticated state
  if (status === "authenticated") {
    return (
      <div className="flex items-center space-x-4">
              <Link
          href="/my-orders"
          className="text-gray-600 hover:text-indigo-600 transition duration-200 text-sm font-medium"
        >
          My Orders
        </Link>
        <span className="text-gray-300 hidden sm:block">|</span> {/* Separator */}
        {/* Optional: Display user name or link to profile */}
        <span className="text-gray-700 text-sm hidden sm:block">
          Hi, {session.user?.name?.split(" ")[0] || "User"}! {/* Show first name */}
        </span>
        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })} // Sign out and redirect to home
          className="text-gray-600 hover:text-indigo-600 transition duration-200 text-sm font-medium"
        >
          Logout
        </button>
      </div>
    );
  }

  // Handle unauthenticated state
  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/login"
        className="text-gray-600 hover:text-indigo-600 transition duration-200 text-sm font-medium"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200"
      >
        Register
      </Link>
    </div>
  );
};

export default UserNav;
