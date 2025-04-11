// src/components/AuthProvider.tsx
"use client"; // This component wraps the SessionProvider, making it client-side

import { SessionProvider } from "next-auth/react";
import React from "react";

interface AuthProviderProps {
  children: React.ReactNode;
  // session?: any; // Optional: If passing initial session props
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // The SessionProvider needs to be a Client Component
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
