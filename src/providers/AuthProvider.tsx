import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { logger } from '@/lib/logger'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { token, isAuthenticated } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated && !token) {
        logger.info({ route: '/login' }, 'Redirecting to login')
        navigate('/login')
      }
    } catch (error) {
      logger.error({ err: error, route: '/login' }, 'Auth check failed')
      navigate('/login')
    }
  }, [isAuthenticated, token, navigate])

  return <>{children}</>
}
