import { QueryClient } from '@tanstack/react-query'

/**
 * Global QueryClient instance for React Query
 *
 * This client is configured with optimized defaults for the wine shop application:
 * - 5-minute stale time for queries to reduce unnecessary refetches
 * - 30-minute garbage collection time for memory management
 * - Limited retry attempts to prevent infinite loops
 * - Disabled refetch on window focus for better UX
 *
 * @example
 * ```tsx
 * import { QueryClientProvider } from '@tanstack/react-query'
 * import { queryClient } from '@/lib/queryClient'
 *
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <YourApp />
 *     </QueryClientProvider>
 *   )
 * }
 * ```
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})
