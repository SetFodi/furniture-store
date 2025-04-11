// src/app/admin/orders/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Order, User } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption, // Optional: Add caption
} from "@/components/ui/table"; // Import Table components
import { Badge } from "@/components/ui/badge"; // For status
import { Button } from "@/components/ui/button"; // For actions
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'; // Icons

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
    role?: string;
  };
}

// Define PopulatedOrder type
interface PopulatedOrder extends Omit<Order, 'user'> {
   user: Pick<User, '_id' | 'name' | 'email'> | null;
}

const AdminOrdersPage: React.FC = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const [orders, setOrders] = useState<PopulatedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch logic (remains the same)
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin' && session.accessToken) {
      fetchOrders();
    } else if (status !== 'loading') { setIsLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  const fetchOrders = async () => { /* ... fetch logic (same as before) ... */
    setIsLoading(true); setError(null);
    if (!apiUrl) { setError("API URL missing"); setIsLoading(false); return; }
    try {
      const res = await fetch(`${apiUrl}/admin/orders`, { headers: { Authorization: `Bearer ${session!.accessToken}` }, cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.success) { throw new Error(data.message || 'Failed to fetch orders'); }
      setOrders(data.data as PopulatedOrder[]);
    } catch (err: any) { setError(err.message); console.error("Fetch orders error:", err); }
    finally { setIsLoading(false); }
  };

  // Mark Delivered Handler (remains the same logic)
  const handleMarkDelivered = async (orderId: string) => { /* ... handler logic (same as before) ... */
    if (!session?.accessToken) { alert("Auth error."); return; }
    if (!confirm("Mark as delivered?")) { return; }
    setUpdatingOrderId(orderId); setError(null);
    try {
      const res = await fetch(`${apiUrl}/admin/orders/${orderId}/deliver`, { method: 'PUT', headers: { Authorization: `Bearer ${session.accessToken}` } });
      const data = await res.json();
      if (!res.ok || !data.success) { throw new Error(data.message || 'Failed to update status'); }
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, isDelivered: true, deliveredAt: data.data.deliveredAt } : o));
      alert("Order marked delivered!");
    } catch (err: any) { setError(err.message); alert(`Error: ${err.message}`); console.error("Update status error:", err); }
    finally { setUpdatingOrderId(null); }
  };

  if (isLoading) return <div className="text-center p-4">Loading orders...</div>;
  if (error && orders.length === 0) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Manage Orders</h1>
      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-300 rounded">Error: {error}</div>}
       <div className="border rounded-lg">
         <Table>
           {/* Optional Caption */}
           {/* <TableCaption>A list of all recent orders.</TableCaption> */}
           <TableHeader>
             <TableRow>
               <TableHead className="w-[150px]">Order ID</TableHead>
               <TableHead>User</TableHead>
               <TableHead>Date</TableHead>
               <TableHead className="text-right">Total</TableHead>
               <TableHead>Paid</TableHead>
               <TableHead>Delivered</TableHead>
               <TableHead className="text-right">Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {orders.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={7} className="h-24 text-center">
                      No orders found.
                   </TableCell>
                </TableRow>
             ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-xs">{order._id}</TableCell>
                    <TableCell className="font-medium">
                      {order.user ? order.user.name : 'N/A'}
                      <div className="text-xs text-muted-foreground">{order.user ? order.user.email : ''}</div>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-medium">${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {order.isPaid ? (
                        <Badge variant="success" className="flex items-center w-fit gap-1"> {/* Use Badge */}
                           <CheckCircle2 size={14}/> Paid
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center w-fit gap-1">
                           <XCircle size={14}/> Not Paid
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                       {order.isDelivered ? (
                        <Badge variant="success" className="flex items-center w-fit gap-1">
                           <CheckCircle2 size={14}/> Delivered
                        </Badge>
                      ) : (
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleMarkDelivered(order._id)}
                           disabled={updatingOrderId === order._id}
                           className="text-xs"
                        >
                           {updatingOrderId === order._id ? (
                              <Loader2 size={14} className="mr-1 animate-spin" />
                           ) : null}
                           {updatingOrderId === order._id ? 'Updating...' : 'Mark Delivered'}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                         <Link href={`/orders/${order._id}`}>Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
             )}
           </TableBody>
         </Table>
       </div>
    </div>
  );
};

export default AdminOrdersPage;
