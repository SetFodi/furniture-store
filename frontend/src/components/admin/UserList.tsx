// src/components/admin/UserList.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import Table components
import { Badge } from "@/components/ui/badge"; // For role badge
import { Button } from "@/components/ui/button"; // For potential actions

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
    role?: string;
  };
}

const UserList: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Fetch logic remains the same...
    if (status === 'authenticated' && session?.user?.role === 'admin' && session.accessToken) {
      const fetchUsers = async () => { /* ... fetch logic ... */
        setIsLoading(true);
        setError(null);
        if (!apiUrl) { setError("API URL missing"); setIsLoading(false); return; }
        try {
          const res = await fetch(`${apiUrl}/admin/users`, { headers: { Authorization: `Bearer ${session.accessToken}` }, cache: 'no-store' });
          const data = await res.json();
          if (!res.ok || !data.success) { throw new Error(data.message || 'Failed to fetch users'); }
          setUsers(data.data as User[]);
        } catch (err: any) { setError(err.message); console.error("Fetch users error:", err); }
        finally { setIsLoading(false); }
      };
      fetchUsers();
    } else if (status !== 'loading') { setIsLoading(false); if (status === 'authenticated') { setError("Permission Denied."); } }
  }, [session, status, apiUrl]);


  if (isLoading) return <div className="text-center p-4">Loading users...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="border rounded-lg"> {/* Add border and rounded corners */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead> {/* Use TableHead */}
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
             <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                   No users found.
                </TableCell>
             </TableRow>
          ) : (
             users.map((user) => (
               <TableRow key={user._id}>
                 <TableCell className="font-medium">{user.name}</TableCell> {/* Use TableCell */}
                 <TableCell>{user.email}</TableCell>
                 <TableCell>
                   <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}> {/* Use Badge */}
                     {user.role}
                   </Badge>
                 </TableCell>
                 <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                 <TableCell className="text-right space-x-2">
                   {/* Add action buttons later */}
                   {/* <Button variant="outline" size="sm">Edit</Button> */}
                   {/* <Button variant="destructive" size="sm">Delete</Button> */}
                 </TableCell>
               </TableRow>
             ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
