import { logger } from '@/lib/logger'
import { PROVIDER_CONSTANTS } from '@/constants/providers'

interface AuthUser {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

interface LoginCredentials {
  email: string
  password: string
}

interface AuthResponse {
  user: AuthUser
  token: string
}

export class AuthService {
  /**
   * Authenticates user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      logger.info({ email: credentials.email }, 'Attempting user login')

      const response = await fetch(PROVIDER_CONSTANTS.AUTH.API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorMessage = await response.text()
        logger.warn({ email: credentials.email, status: response.status }, 'Login failed')
        throw new Error(errorMessage || PROVIDER_CONSTANTS.AUTH.ERROR_MESSAGES.LOGIN_FAILED)
      }

      const data = await response.json()
      logger.info({ userId: data.user?.id }, 'User login successful')
      return data
    } catch (error) {
      logger.error({ error, email: credentials.email }, 'Login error')
      throw error
    }
  }

  /**
   * Logs out the current user
   */
  static async logout(): Promise<void> {
    try {
      logger.info('Attempting user logout')

      const response = await fetch(PROVIDER_CONSTANTS.AUTH.API_ENDPOINTS.LOGOUT, {
        method: 'POST',
      })

      if (!response.ok) {
        logger.warn({ status: response.status }, 'Logout request failed')
        throw new Error(PROVIDER_CONSTANTS.AUTH.ERROR_MESSAGES.LOGOUT_FAILED)
      }

      logger.info('User logout successful')
    } catch (error) {
      logger.error({ error }, 'Logout error')
      throw error
    }
  }

  /**
   * Fetches current user data
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      logger.debug('Fetching current user data')

      const response = await fetch(PROVIDER_CONSTANTS.AUTH.API_ENDPOINTS.ME)

      if (!response.ok) {
        if (response.status === 401) {
          logger.debug('User not authenticated')
          return null
        }
        logger.warn({ status: response.status }, 'Failed to fetch user data')
        throw new Error(PROVIDER_CONSTANTS.AUTH.ERROR_MESSAGES.USER_FETCH_FAILED)
      }

      const userData = await response.json()
      logger.debug({ userId: userData?.id }, 'Current user data fetched')
      return userData
    } catch (error) {
      logger.error({ error }, 'Error fetching current user')
      return null
    }
  }

  /**
   * Checks if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      return !!user
    } catch (error) {
      logger.error({ error }, 'Error checking authentication status')
      return false
    }
  }

  /**
   * Checks if user has admin role
   */
  static async isAdmin(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      return user?.role === 'admin'
    } catch (error) {
      logger.error({ error }, 'Error checking admin status')
      return false
    }
  }
}
