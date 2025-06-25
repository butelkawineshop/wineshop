import type { CartItem } from './types'

export interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
}

export interface CartActions {
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export interface CartSelectors {
  getItems: () => CartItem[]
  getItemCount: () => number
  getTotalPrice: () => number
  getItemById: (itemId: string) => CartItem | undefined
  getIsEmpty: () => boolean
  getIsLoading: () => boolean
  getError: () => string | null
  getTotalItems: () => number
}

export const cart = {
  state: {
    items: [],
    isLoading: false,
    error: null,
  } as CartState,
  actions: {} as CartActions, // To be implemented in useStore
  selectors: {} as CartSelectors, // To be implemented in useStore
}
