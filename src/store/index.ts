import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { StateCreator } from 'zustand'

// Types
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

export interface CartItem {
  id: string
  quantity: number
  price: number
  name: string
  image?: string
}

interface AppState {
  // Auth
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void

  // Cart
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateCartItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void

  // UI
  isLoading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

type AppStore = StateCreator<AppState, [['zustand/devtools', never], ['zustand/persist', unknown]]>

const createStore: AppStore = (set) => ({
  // Auth
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
  setToken: (token: string | null) => set({ token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),

  // Cart
  cart: [],
  addToCart: (item: CartItem) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id)
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
          ),
        }
      }
      return { cart: [...state.cart, item] }
    }),
  removeFromCart: (itemId: string) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== itemId),
    })),
  updateCartItemQuantity: (itemId: string, quantity: number) =>
    set((state) => ({
      cart: state.cart.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    })),
  clearCart: () => set({ cart: [] }),

  // UI
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  error: null,
  setError: (error: string | null) => set({ error }),
})

export const useStore = create<AppState>()(
  devtools(
    persist(createStore, {
      name: 'wineshop-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        cart: state.cart,
      }),
    }),
  ),
)
