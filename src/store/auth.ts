import type { User } from './types'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthActions {
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  login: (user: User, token: string) => void
}

export interface AuthSelectors {
  getUser: () => User | null
  getToken: () => string | null
  getIsAuthenticated: () => boolean
  getIsLoading: () => boolean
  getError: () => string | null
  getIsAdmin: () => boolean
  getIsCustomer: () => boolean
}

export const auth = {
  state: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  } as AuthState,
  actions: {} as AuthActions, // To be implemented in useStore
  selectors: {} as AuthSelectors, // To be implemented in useStore
}
