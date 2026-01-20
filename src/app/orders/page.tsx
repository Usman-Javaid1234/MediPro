'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Package, 
  ChevronRight, 
  Loader2,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useOrders } from "@/lib/api/hooks";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/lib/api/types";

const statusConfig: Record<OrderStatus, { icon: React.ReactNode; color: string }> = {
  pending: { icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-500' },
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-blue-500' },
  processing: { icon: <Package className="w-4 h-4" />, color: 'bg-blue-500' },
  shipped: { icon: <Truck className="w-4 h-4" />, color: 'bg-purple-500' },
  out_for_delivery: { icon: <Truck className="w-4 h-4" />, color: 'bg-indigo-500' },
  delivered: { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-500' },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: 'bg-red-500' },
  refunded: { icon: <XCircle className="w-4 h-4" />, color: 'bg-gray-500' },
};

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data: ordersData, isLoading, error } = useOrders({
    page,
    page_size: 10,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push('/login?redirect=/orders');
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const orders = ordersData?.items || [];
  const totalPages = ordersData?.total_pages || 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your orders
            </p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load orders</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              {statusFilter !== 'all' 
                ? `No ${statusFilter} orders found.`
                : "You haven't placed any orders yet."}
            </p>
            <Link href="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status] || statusConfig.pending;
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 lg:p-6">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${statusInfo.color} bg-opacity-10 flex items-center justify-center`}>
                            <div className={`${statusInfo.color.replace('bg-', 'text-')}`}>
                              {statusInfo.icon}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold">Order #{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>

                      {/* Order Items Preview */}
                      <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
                        {order.items.slice(0, 4).map((item, index) => (
                          <div 
                            key={item.id} 
                            className="shrink-0 w-16 h-16 rounded-lg bg-muted flex items-center justify-center"
                          >
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="shrink-0 w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium text-muted-foreground">
                              +{order.items.length - 4}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Order Footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground">Items</p>
                            <p className="font-medium">{order.items.length}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="font-bold">{formatPrice(Number(order.total_amount))}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Payment</p>
                            <p className="font-medium">{order.payment_method}</p>
                          </div>
                        </div>
                        <Link href={`/order-confirmation/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}