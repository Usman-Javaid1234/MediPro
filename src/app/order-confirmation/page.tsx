'use client';

import { useParams } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin,
  Loader2,
  Home,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { useOrder } from "@/lib/api/hooks";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const { data: order, isLoading, error } = useOrder(orderId);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find this order. Please check your order history.
          </p>
          <Link href="/orders">
            <Button>View My Orders</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const shippingAddress = order.shipping_address as {
    full_name?: string;
    phone?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        {/* Success Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We've received your order and will process it shortly.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Order Info Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order #{order.order_number}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-PK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {order.status.replace(/_/g, ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-2">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatPrice(Number(item.price_at_purchase))}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(Number(item.subtotal))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {Number(order.shipping_cost) === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatPrice(Number(order.shipping_cost))
                    )}
                  </span>
                </div>
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-{formatPrice(Number(order.discount_amount))}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(Number(order.total_amount))}</span>
                </div>
              </div>

              <Separator />

              {/* Shipping & Payment Info */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">{shippingAddress.full_name}</p>
                    <p>{shippingAddress.address_line1}</p>
                    {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
                    <p>{shippingAddress.city}, {shippingAddress.postal_code}</p>
                    <p>{shippingAddress.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Payment & Delivery
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><span className="text-foreground">Payment Method:</span> {order.payment_method}</p>
                    <p><span className="text-foreground">Payment Status:</span> {order.payment_status}</p>
                    {order.estimated_delivery_date && (
                      <p>
                        <span className="text-foreground">Est. Delivery:</span>{' '}
                        {new Date(order.estimated_delivery_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {order.customer_notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Order Notes</h3>
                    <p className="text-sm text-muted-foreground">{order.customer_notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders">
              <Button variant="outline" className="w-full sm:w-auto">
                <Package className="w-4 h-4 mr-2" />
                View All Orders
              </Button>
            </Link>
            <Link href="/shop">
              <Button className="w-full sm:w-auto">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              A confirmation email has been sent to <span className="font-medium">{order.customer_email}</span>
            </p>
            <p className="mt-1">
              Questions? <Link href="/contact" className="text-primary hover:underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}