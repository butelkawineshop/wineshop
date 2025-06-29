// API and integration-related constants for the wineshop project
// Place all magic numbers, retry configs, and error messages here for reuse and convention compliance

export const REDIS_CONSTANTS = {
  MAX_RETRIES_PER_REQUEST: 3,
  RETRY_DELAY_BASE_MS: 50,
  RETRY_DELAY_MAX_MS: 2000,
  ERROR_MESSAGES: {
    URL_NOT_SET: 'REDIS_URL is not set',
  },
} as const

export const DB_CONSTANTS = {
  POOL_MAX: 20,
  POOL_IDLE_TIMEOUT_MS: 30000,
  POOL_CONNECTION_TIMEOUT_MS: 2000,
  SLOW_QUERY_THRESHOLD_MS: 1000,
} as const

export const GRAPHQL_CONSTANTS = {
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  DEFAULT_LIMIT: 1000,
  ERROR_MESSAGES: {
    FETCH_FAILED: 'Failed to fetch data',
    NO_DATA: 'No data returned from GraphQL',
    NETWORK_ERROR: 'Network error',
  },
} as const
