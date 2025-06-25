// Provider constants following conventions
export const PROVIDER_CONSTANTS = {
  // Theme provider
  THEME: {
    STORAGE_KEY: 'theme',
    DEFAULT_THEME: 'light' as const,
    THEMES: ['light', 'dark'] as const,
    HTML_ATTRIBUTE: 'data-theme',
  },

  // Language provider
  LANGUAGE: {
    STORAGE_KEY: 'language-store',
    DEFAULT_LOCALE: 'sl' as const,
    SUPPORTED_LOCALES: ['sl', 'en'] as const,
  },

  // Auth provider
  AUTH: {
    ROUTES: {
      LOGIN: '/login',
      DASHBOARD: '/dashboard',
    },
    API_ENDPOINTS: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me',
    },
    ERROR_MESSAGES: {
      AUTHENTICATION_REQUIRED: 'Authentication required',
      LOGIN_FAILED: 'Login failed',
      LOGOUT_FAILED: 'Logout failed',
      USER_FETCH_FAILED: 'Failed to fetch user data',
      AUTH_CHECK_FAILED: 'Authentication check failed',
      REDIRECT_FAILED: 'Failed to redirect to login',
    },
  },

  // Language service
  LANGUAGE_SERVICE: {
    API_ENDPOINTS: {
      COLLECTION_BASE: process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api',
    },
    QUERY_PARAMS: {
      WHERE: 'where',
      DEPTH: 'depth',
      LOCALE: 'locale',
      SORT: 'sort',
    },
    DEFAULT_VALUES: {
      DEPTH: '1',
      LOCALE: 'all',
      SORT: '-createdAt',
    },
    ERROR_MESSAGES: {
      NAVIGATION_FAILED: 'Failed to navigate to new language path',
      INVALID_PATH: 'Invalid path for language switch',
    },
  },
} as const
