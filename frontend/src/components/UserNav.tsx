// src/components/UserNav.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard } from "lucide-react"; // Import an icon

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
    role?: string;
  };
}

const UserNav: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };

  if (status === "loading") {
    return <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>;
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center space-x-3 sm:space-x-4"> {/* Adjusted spacing */}
        {/* Conditionally render Admin Link */}
        {session.user?.role === 'admin' && (
          <Link
            href="/admin/dashboard"
            className="text-gray-600 hover:text-indigo-600 transition duration-200 text-sm font-medium flex items-center gap-1"
            title="Admin Dashboard"
          >
            <LayoutDashboard size={16} /> {/* Icon */}
            <span className="hidden sm:inline">Admin</span>
          </Link>
        )}
         {session.user?.role === 'admin' && <span className="text-gray-300 hidden sm:block">|</span>} {/* Separator */}

        <Link
          href="/my-orders"
          className="text-gray-600 hover:text-indigo-600 transition duration-200 text-sm font-medium"
        >
          My Orders
        </Link>
        <span className="text-gray-300 hidden sm:block">|</span>
        <span className="text-gray-700 text-sm hidden sm:block truncate" title={session.user?.name ?? undefined}>
          Hi, {session.user?.name?.split(" ")[0] || "User"}!
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-gray-600 hover:text-indigo-600 transition duration-200 text-sm font-medium"
        >
          Logout
        </button>
      </div>
    );
  }

  // Unauthenticated state (can use shadcn Button later)
  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <Link
        href="/login"
        className="text-gray-600 hover:text-indigo-600 transition duration-200 text-sm font-medium px-3 py-1" // Added padding
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
