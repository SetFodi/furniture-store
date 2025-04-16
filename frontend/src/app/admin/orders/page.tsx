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
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ShoppingCart } from 'lucide-react';

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

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading orders...</p>
      </div>
    </div>
  );

  if (error && orders.length === 0) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center p-8 max-w-md bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <XCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Error</h2>
        <p className="text-red-600 dark:text-red-300">{error}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Orders</h1>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg">
            {orders.length} Total Orders
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <XCircle className="h-5 w-5 flex-shrink-0" />
          <span>Error: {error}</span>
        </div>
      )}
       
      <div className="border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700/50">
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
                <TableCell colSpan={7} className="h-24 text-center text-gray-500 dark:text-gray-400">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <TableCell className="font-mono text-xs bg-gray-50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300">
                    {order._id}
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className="text-gray-900 dark:text-gray-100">{order.user ? order.user.name : 'N/A'}</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{order.user ? order.user.email : ''}</div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900 dark:text-gray-100">
                    ${order.totalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {order.isPaid ? (
                      <Badge variant="success" className="flex items-center w-fit gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
                        <CheckCircle2 size={14}/>
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex items-center w-fit gap-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800">
                        <XCircle size={14}/>
                        Not Paid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered ? (
                      <Badge variant="success" className="flex items-center w-fit gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
                        <CheckCircle2 size={14}/>
                        Delivered
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkDelivered(order._id)}
                        disabled={updatingOrderId === order._id}
                        className="text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {updatingOrderId === order._id ? (
                          <Loader2 size={14} className="mr-1 animate-spin" />
                        ) : null}
                        {updatingOrderId === order._id ? 'Updating...' : 'Mark Delivered'}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild 
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
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