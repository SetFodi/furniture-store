// src/app/auth/error/page.tsx
"use client"; // To use useSearchParams

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const AuthErrorPage: React.FC = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Map common NextAuth errors to user-friendly messages
  const errorMessages: { [key: string]: string } = {
    CredentialsSignin: "Invalid email or password. Please try again.",
    // Add more specific error mappings if needed
  };

  const displayMessage =
    error && errorMessages[error]
      ? errorMessages[error]
      : "An authentication error occurred. Please try again.";

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-red-600">
          Authentication Error
        </h2>
        <p className="text-gray-700">{displayMessage}</p>
        <div className="mt-6">
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorPage;
