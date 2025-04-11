// src/app/register/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input";   // Import Input
import { Label } from "@/components/ui/label";   // Import Label
import { toast } from "react-hot-toast";         // Import toast

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // No need for separate error/success state
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss(); // Clear previous toasts

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (!apiUrl) {
      toast.error("API endpoint not configured. Cannot register.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed.");
      }

      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500); // Shorter delay

    } catch (err: any) {
      console.error("Registration Error:", err);
      toast.error(err.message || "An error occurred during registration.");
      setIsLoading(false);
    }
    // No need to set isLoading false on success due to redirect
  };

  if (status === "loading") { return <div className="text-center p-10">Loading...</div>; }
  if (status === "authenticated") { return null; }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 shadow-lg rounded-lg border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              disabled={isLoading}
            />
          </div>
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email-address">Email address</Label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>
          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 characters)"
              disabled={isLoading}
            />
          </div>
          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
