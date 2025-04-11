// src/components/AdminGuard.tsx
"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Extend session type to include role if you added it in NextAuth callbacks
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
    role?: string; // <<< Add role if available in session user object
  };
}

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const router = useRouter();

  useEffect(() => {
    // If session is still loading, do nothing yet
    if (status === "loading") {
      return;
    }

    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/admin/dashboard"); // Redirect to login, ask to come back
      return;
    }

    // If authenticated, check for admin role
    // IMPORTANT: Ensure 'role' is added to the session object via NextAuth callbacks
    if (status === "authenticated") {
      // Check if user object and role exist and if role is 'admin'
      if (!session?.user?.role || session.user.role !== 'admin') {
         console.warn("Access Denied: User is not an admin.", session?.user);
         // Redirect non-admins away (e.g., to home page or a specific 'unauthorized' page)
         router.replace("/");
         return;
      }
      // If user is admin, allow rendering children (do nothing in useEffect)
      console.log("Admin access granted for:", session.user.email);
    }

  }, [session, status, router]);

  // Render loading state or null while checking/redirecting
  if (status === "loading" || (status === "authenticated" && session?.user?.role !== 'admin') || status === "unauthenticated") {
    // You can show a more sophisticated loading spinner here
    return <div className="flex justify-center items-center min-h-screen">Loading Admin Access...</div>;
  }

  // If authenticated and user is admin, render the children components
  return <>{children}</>;
};

export default AdminGuard;
