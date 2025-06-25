import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { STORE_CONSTANTS } from '@/constants/store'

// Types
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

// State interface
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Actions interface
interface AuthActions {
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  login: (user: User, token: string) => void
}

// Selectors interface
interface AuthSelectors {
  getUser: () => User | null
  getToken: () => string | null
  getIsAuthenticated: () => boolean
  getIsLoading: () => boolean
  getError: () => string | null
  getIsAdmin: () => boolean
  getIsCustomer: () => boolean
}

// Combined store interface
interface AuthStore extends AuthState, AuthActions, AuthSelectors {}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        setUser: (user: User | null): void => {
          set({ user, isAuthenticated: !!user })
        },

        setToken: (token: string | null): void => {
          set({ token })
        },

        setLoading: (loading: boolean): void => {
          set({ isLoading: loading })
        },

        setError: (error: string | null): void => {
          set({ error })
        },

        logout: (): void => {
          set({ user: null, token: null, isAuthenticated: false, error: null })
        },

        login: (user: User, token: string): void => {
          set({ user, token, isAuthenticated: true, error: null })
        },

        // Selectors
        getUser: (): User | null => {
          return get().user
        },

        getToken: (): string | null => {
          return get().token
        },

        getIsAuthenticated: (): boolean => {
          return get().isAuthenticated
        },

        getIsLoading: (): boolean => {
          return get().isLoading
        },

        getError: (): string | null => {
          return get().error
        },

        getIsAdmin: (): boolean => {
          const user = get().user
          return user?.role === 'admin'
        },

        getIsCustomer: (): boolean => {
          const user = get().user
          return user?.role === 'user'
        },
      }),
      {
        name: STORE_CONSTANTS.AUTH_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: STORE_CONSTANTS.AUTH_STORE_NAME,
    },
  ),
)
