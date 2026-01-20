'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard component protects admin routes
 * - Checks if user is authenticated
 * - Checks if user has is_admin = true from the server
 * - Redirects unauthorized users
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    console.log('🛡️ AdminGuard - Auth check:', {
      isAuthenticated,
      hasUser: !!user,
      userEmail: user?.email,
      isAdmin: user?.isAdmin,
      fullUser: user
    });

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      console.log('❌ Not authenticated, redirecting to login');
      router.push('/login?redirect=/admin');
      return;
    }

    // Check if user is admin (from server response)
    // The user object should have isAdmin field from AuthContext
    if (user.isAdmin === true) {
      console.log('✅ User is admin, granting access');
      setIsAuthorized(true);
    } else {
      console.log('❌ User is NOT admin, denying access');
      setIsAuthorized(false);
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Loading state
  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authorized - show access denied
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin panel. 
            This area is restricted to administrators only.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="outline">Go to Homepage</Button>
            </Link>
            <Link href="/login">
              <Button>Login with Admin Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
}

export default AdminGuard;