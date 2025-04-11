// src/components/admin/UserList.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/types'; // Assuming User type is defined in types/index.ts

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
    role?: string;
  };
}

// Define User type if not already in src/types/index.ts
// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'admin';
//   createdAt: string;
//   updatedAt: string;
// }

const UserList: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Only fetch if authenticated as admin and token is available
    if (status === 'authenticated' && session?.user?.role === 'admin' && session.accessToken) {
      const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        if (!apiUrl) { setError("API URL missing"); setIsLoading(false); return; }

        try {
          const res = await fetch(`${apiUrl}/admin/users`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            cache: 'no-store',
          });
          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch users');
          }
          setUsers(data.data as User[]);

        } catch (err: any) {
          setError(err.message);
          console.error("Fetch users error:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUsers();
    } else if (status !== 'loading') {
       // Handle cases where user is not admin or token is missing after loading
       setIsLoading(false);
       if (status === 'authenticated') {
          setError("You do not have permission to view users.");
       }
       // If unauthenticated, the AdminGuard should handle redirection
    }
  }, [session, status, apiUrl]);


  if (isLoading) return <div className="text-center p-4">Loading users...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                   user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                 }`}>
                   {user.role}
                 </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {/* Add action buttons later (e.g., Edit, Delete) */}
                {/* <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button> */}
                {/* <button className="text-red-600 hover:text-red-900">Delete</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
