'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign, Layers, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAdminDashboard, useAdminOrders } from '@/lib/api/hooks/useAdmin';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminDashboard();
  const { data: recentOrdersData, isLoading: ordersLoading } = useAdminOrders({ page: 1, page_size: 5 });

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `PKR ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `PKR ${(price / 1000).toFixed(1)}K`;
    }
    return `PKR ${price.toFixed(0)}`;
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.products.total || 0,
      subValue: `${stats?.products.active || 0} active`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats?.orders.total || 0,
      subValue: `${stats?.orders.pending || 0} pending`,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/orders',
    },
    {
      title: 'Total Users',
      value: stats?.users.total || 0,
      subValue: `${stats?.users.active || 0} active`,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/users',
    },
    {
      title: 'Revenue',
      value: formatPrice(stats?.revenue.total || 0),
      subValue: 'Total earnings',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      href: '/admin/orders',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Products',
      description: 'Add, edit, or remove products',
      icon: Package,
      href: '/admin/products',
      color: 'border-blue-200 hover:border-blue-400',
    },
    {
      title: 'Manage Categories',
      description: 'Organize product categories',
      icon: Layers,
      href: '/admin/categories',
      color: 'border-purple-200 hover:border-purple-400',
    },
    {
      title: 'View Orders',
      description: 'Manage customer orders',
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'border-green-200 hover:border-green-400',
    },
    {
      title: 'Manage Users',
      description: 'View and manage users',
      icon: Users,
      href: '/admin/users',
      color: 'border-orange-200 hover:border-orange-400',
    },
  ];

  const recentOrders = recentOrdersData?.items || [];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.fullName || 'Admin'}</p>
      </div>

      {/* Stats Grid */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : statsError ? (
        <Card className="mb-8 border-destructive">
          <CardContent className="p-6 flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Failed to load dashboard statistics</span>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Low Stock Alert */}
      {stats && stats.products.low_stock > 0 && (
        <Card className="mb-8 border-yellow-300 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-800">
              <strong>{stats.products.low_stock}</strong> products have low stock (less than 10 units)
            </span>
            <Link href="/admin/products?filter=low_stock" className="ml-auto text-yellow-700 hover:underline text-sm">
              View Products →
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className={`border-2 transition-all hover:shadow-md ${action.color}`}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Order #{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">PKR {Number(order.total_amount).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              ))}
              <Link href="/admin/orders" className="block text-center text-primary hover:underline text-sm pt-2">
                View all orders →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;