'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Loader2, AlertTriangle, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminOrders, useUpdateOrderStatus, useAdminOrder } from '@/lib/api/hooks/useAdmin';
import { Order, OrderStatus } from '@/lib/api/types';

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  pending: { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  processing: { icon: <Package className="w-4 h-4" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  shipped: { icon: <Truck className="w-4 h-4" />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  out_for_delivery: { icon: <Truck className="w-4 h-4" />, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  delivered: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600', bgColor: 'bg-green-100' },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-600', bgColor: 'bg-red-100' },
  refunded: { icon: <XCircle className="w-4 h-4" />, color: 'text-gray-600', bgColor: 'bg-gray-100' },
};

const statusOptions = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

const AdminOrders = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch data
  const { data: ordersData, isLoading, error } = useAdminOrders({
    page,
    page_size: 20,
    status: filterStatus !== 'all' ? filterStatus : undefined,
  });
  
  const { data: selectedOrder, isLoading: orderLoading } = useAdminOrder(selectedOrderId || '');
  
  // Mutations
  const updateOrderStatus = useUpdateOrderStatus();

  const orders = ordersData?.items || [];
  const totalPages = ordersData?.total_pages || 1;

  // Calculate status counts
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
      toast({
        title: 'Status Updated',
        description: `Order status changed to ${newStatus.replace(/_/g, ' ')}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const openOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailDialogOpen(true);
  };

  const formatPrice = (price: number | string) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `PKR ${num.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Orders Management</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </div>
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">
                  {statusCounts['pending'] || 0}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Processing</CardDescription>
                <CardTitle className="text-2xl text-blue-600">
                  {(statusCounts['processing'] || 0) + (statusCounts['confirmed'] || 0)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Shipped</CardDescription>
                <CardTitle className="text-2xl text-purple-600">
                  {(statusCounts['shipped'] || 0) + (statusCounts['out_for_delivery'] || 0)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Delivered</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {statusCounts['delivered'] || 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Failed to load orders
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No orders found
            </div>
          ) : (
            <>
              {/* Orders Table */}
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const status = statusConfig[order.status] || statusConfig.pending;
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.order_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{order.items?.length || 0}</TableCell>
                          <TableCell className="font-medium">
                            {formatPrice(order.total_amount)}
                          </TableCell>
                          <TableCell>{order.payment_method}</TableCell>
                          <TableCell className="text-sm">
                            {formatDate(order.created_at)}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusChange(order.id, value)}
                              disabled={updateOrderStatus.isPending}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue>
                                  <Badge className={`${status.bgColor} ${status.color} border-0`}>
                                    {order.status.replace(/_/g, ' ')}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openOrderDetail(order.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder ? `Order #${selectedOrder.order_number}` : 'Loading...'}
            </DialogDescription>
          </DialogHeader>
          
          {orderLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : selectedOrder ? (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`${statusConfig[selectedOrder.status]?.bgColor} ${statusConfig[selectedOrder.status]?.color} border-0 mt-1`}>
                    {selectedOrder.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-medium">{selectedOrder.payment_method} - {selectedOrder.payment_status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold text-lg">{formatPrice(selectedOrder.total_amount)}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                  <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customer_name}</p>
                  <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customer_email}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customer_phone}</p>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p>{(selectedOrder.shipping_address as any).full_name}</p>
                    <p>{(selectedOrder.shipping_address as any).address_line1}</p>
                    <p>{(selectedOrder.shipping_address as any).city}, {(selectedOrder.shipping_address as any).postal_code}</p>
                    <p>{(selectedOrder.shipping_address as any).phone}</p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatPrice(item.price_at_purchase)}</TableCell>
                          <TableCell>{formatPrice(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(selectedOrder.shipping_cost)}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;