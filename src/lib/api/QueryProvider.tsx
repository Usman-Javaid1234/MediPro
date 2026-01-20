// ============================================
// React Query Provider
// Wraps the app with QueryClientProvider
// ============================================

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time - how long data is considered fresh
            staleTime: 60 * 1000, // 1 minute default
            
            // Cache time - how long inactive data stays in cache
            gcTime: 5 * 60 * 1000, // 5 minutes
            
            // Retry failed requests
            retry: (failureCount, error: any) => {
              // Don't retry on 401 or 404
              if (error?.status === 401 || error?.status === 404) {
                return false;
              }
              return failureCount < 2;
            },
            
            // Refetch on window focus
            refetchOnWindowFocus: false,
            
            // Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry mutations once on failure
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default QueryProvider;
