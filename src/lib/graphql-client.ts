import { QueryClient } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { logger } from './logger'
import { GRAPHQL_CONSTANTS } from '@/constants/api'
// Import generated types (will be available after running codegen)
// import { GetCollectionItemsQuery, GetWineVariantQuery, WineDetailQuery } from '@/generated/graphql'

interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: string[]
  }>
}

interface GraphQLRequest {
  query: string
  variables?: Record<string, unknown>
}

// Create a GraphQL client instance
const graphqlClient = new GraphQLClient('/api/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
})

// Create a React Query client with optimized settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
  },
})

// Custom fetcher function for React Query
export const fetcher = async <TData, TVariables extends object>(
  query: string,
  variables?: TVariables,
): Promise<TData> => {
  try {
    const data = await graphqlClient.request<TData>(query, variables)
    return data
  } catch (error) {
    logger.error('GraphQL request failed', {
      error,
      query,
      variables,
    })

    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw new Error(GRAPHQL_CONSTANTS.ERROR_MESSAGES.FETCH_FAILED)
    }
    throw error
  }
}

// Data source configuration for generated hooks
export const graphqlDataSource = {
  endpoint: '/api/graphql',
  fetchParams: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
}

/**
 * GraphQL client utility for making queries to Payload's GraphQL endpoint
 *
 * This version will use generated types from GraphQL Codegen for better type safety
 * and reduced maintenance burden.
 *
 * Follows project conventions:
 * - Proper error handling with structured logging
 * - Type-safe responses using generated types
 * - Consistent error response format
 * - No exposed internal error details
 */
export async function graphqlRequest<T = unknown>(
  request: GraphQLRequest,
): Promise<{ data: T | null; error: string | null }> {
  try {
    // Use absolute URL on server, relative on client
    const baseUrl = typeof window === 'undefined' ? getApiBaseUrl() : ''
    const response = await fetch(`${baseUrl}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      logger.warn('GraphQL request failed', {
        status: response.status,
        statusText: response.statusText,
        url: `${baseUrl}/api/graphql`,
      })
      return { data: null, error: GRAPHQL_CONSTANTS.ERROR_MESSAGES.FETCH_FAILED }
    }

    const result: GraphQLResponse<T> = await response.json()

    if (result.errors && result.errors.length > 0) {
      logger.warn('GraphQL errors', {
        errors: result.errors,
        query: request.query,
        variables: request.variables,
      })
      return {
        data: null,
        error: `GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`,
      }
    }

    return { data: result.data || null, error: null }
  } catch (error) {
    logger.error('GraphQL request error', {
      error,
      query: request.query,
      variables: request.variables,
    })
    return { data: null, error: GRAPHQL_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR }
  }
}

/**
 * Get the base URL for API calls (works in both client and server)
 */
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URL
    return ''
  } else {
    // Server-side: use absolute URL
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  }
}

/**
 * Server-side GraphQL client for use in API routes and server components
 */
export async function serverGraphqlRequest<T = unknown>(
  request: GraphQLRequest,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const baseUrl = getApiBaseUrl()
    const response = await fetch(`${baseUrl}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      logger.warn('Server GraphQL request failed', {
        status: response.status,
        statusText: response.statusText,
        url: `${baseUrl}/api/graphql`,
      })
      return { data: null, error: GRAPHQL_CONSTANTS.ERROR_MESSAGES.FETCH_FAILED }
    }

    const result: GraphQLResponse<T> = await response.json()

    if (result.errors && result.errors.length > 0) {
      logger.warn('Server GraphQL errors', {
        errors: result.errors,
        query: request.query,
        variables: request.variables,
      })
      return {
        data: null,
        error: `GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`,
      }
    }

    return { data: result.data || null, error: null }
  } catch (error) {
    logger.error('Server GraphQL request error', {
      error,
      query: request.query,
      variables: request.variables,
    })
    return { data: null, error: GRAPHQL_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR }
  }
}
