import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { STORE_CONSTANTS } from '@/constants/store'

// Types
export interface CartItem {
  id: string
  quantity: number
  price: number
  name: string
  image?: string
}

// State interface
interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
}

// Actions interface
interface CartActions {
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// Selectors interface
interface CartSelectors {
  getItems: () => CartItem[]
  getItemCount: () => number
  getTotalPrice: () => number
  getItemById: (itemId: string) => CartItem | undefined
  getIsEmpty: () => boolean
  getIsLoading: () => boolean
  getError: () => string | null
  getTotalItems: () => number
}

// Combined store interface
interface CartStore extends CartState, CartActions, CartSelectors {}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        addItem: (item: CartItem): void => {
          set((state) => {
            const existingItem = state.items.find((i) => i.id === item.id)
            if (existingItem) {
              return {
                items: state.items.map((i) =>
                  i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
                ),
              }
            }
            return { items: [...state.items, item] }
          })
        },

        removeItem: (itemId: string): void => {
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          }))
        },

        updateItemQuantity: (itemId: string, quantity: number): void => {
          set((state) => ({
            items: state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
          }))
        },

        clearCart: (): void => {
          set({ items: [] })
        },

        setLoading: (loading: boolean): void => {
          set({ isLoading: loading })
        },

        setError: (error: string | null): void => {
          set({ error })
        },

        // Selectors
        getItems: (): CartItem[] => {
          return get().items
        },

        getItemCount: (): number => {
          return get().items.length
        },

        getTotalPrice: (): number => {
          return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
        },

        getItemById: (itemId: string): CartItem | undefined => {
          return get().items.find((item) => item.id === itemId)
        },

        getIsEmpty: (): boolean => {
          return get().items.length === 0
        },

        getIsLoading: (): boolean => {
          return get().isLoading
        },

        getError: (): string | null => {
          return get().error
        },

        getTotalItems: (): number => {
          return get().items.reduce((total, item) => total + item.quantity, 0)
        },
      }),
      {
        name: STORE_CONSTANTS.CART_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
        }),
      },
    ),
    {
      name: STORE_CONSTANTS.CART_STORE_NAME,
    },
  ),
)
