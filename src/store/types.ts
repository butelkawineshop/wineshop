// Shared types for all stores
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

// Generic store structure following conventions
export interface DomainStore<S, A, Sel> {
  state: S
  actions: A
  selectors: Sel
}
