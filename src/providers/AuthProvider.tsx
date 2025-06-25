'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { AuthService } from '@/services/AuthService'
import { logger } from '@/lib/logger'
import { PROVIDER_CONSTANTS } from '@/constants/providers'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider component that handles authentication state and redirects
 * Uses Next.js App Router and follows separation of concerns
 */
export const AuthProvider = ({ children }: AuthProviderProps): React.JSX.Element => {
  const { auth } = useStore()
  const router = useRouter()

  useEffect(() => {
    const checkAuthentication = async (): Promise<void> => {
      try {
        logger.info('Checking authentication status')

        // Check if user is authenticated
        if (!auth.state.isAuthenticated && !auth.state.token) {
          logger.info({ route: PROVIDER_CONSTANTS.AUTH.ROUTES.LOGIN }, 'Redirecting to login')
          router.push(PROVIDER_CONSTANTS.AUTH.ROUTES.LOGIN)
          return
        }

        // Verify authentication with server
        const isAuthenticated = await AuthService.isAuthenticated()
        if (!isAuthenticated) {
          logger.warn('Server authentication check failed, redirecting to login')
          auth.actions.logout()
          router.push(PROVIDER_CONSTANTS.AUTH.ROUTES.LOGIN)
          return
        }

        logger.debug('Authentication check passed')
      } catch (error) {
        logger.error({ error, route: PROVIDER_CONSTANTS.AUTH.ROUTES.LOGIN }, 'Auth check failed')
        router.push(PROVIDER_CONSTANTS.AUTH.ROUTES.LOGIN)
      }
    }

    checkAuthentication()
  }, [auth.state.isAuthenticated, auth.state.token, auth.actions, router])

  return <>{children}</>
}
