import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { STORE_CONSTANTS } from '@/constants/store'

// State interface
interface UIState {
  isLoading: boolean
  error: string | null
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  modalOpen: boolean
  activeModal: string | null
}

// Actions interface
interface UIActions {
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  setSidebarOpen: (open: boolean) => void
  setModalOpen: (open: boolean) => void
  setActiveModal: (modal: string | null) => void
  clearError: () => void
  toggleSidebar: () => void
  toggleTheme: () => void
}

// Selectors interface
interface UISelectors {
  getIsLoading: () => boolean
  getError: () => string | null
  getTheme: () => 'light' | 'dark'
  getSidebarOpen: () => boolean
  getModalOpen: () => boolean
  getActiveModal: () => string | null
  getIsDarkTheme: () => boolean
  getIsLightTheme: () => boolean
  hasError: () => boolean
}

// Combined store interface
interface UIStore extends UIState, UIActions, UISelectors {}

const initialState: UIState = {
  isLoading: false,
  error: null,
  theme: 'light',
  sidebarOpen: false,
  modalOpen: false,
  activeModal: null,
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      setLoading: (loading: boolean): void => {
        set({ isLoading: loading })
      },

      setError: (error: string | null): void => {
        set({ error })
      },

      setTheme: (theme: 'light' | 'dark'): void => {
        set({ theme })
      },

      setSidebarOpen: (open: boolean): void => {
        set({ sidebarOpen: open })
      },

      setModalOpen: (open: boolean): void => {
        set({ modalOpen: open })
      },

      setActiveModal: (modal: string | null): void => {
        set({ activeModal: modal })
      },

      clearError: (): void => {
        set({ error: null })
      },

      toggleSidebar: (): void => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      toggleTheme: (): void => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
      },

      // Selectors
      getIsLoading: (): boolean => {
        return get().isLoading
      },

      getError: (): string | null => {
        return get().error
      },

      getTheme: (): 'light' | 'dark' => {
        return get().theme
      },

      getSidebarOpen: (): boolean => {
        return get().sidebarOpen
      },

      getModalOpen: (): boolean => {
        return get().modalOpen
      },

      getActiveModal: (): string | null => {
        return get().activeModal
      },

      getIsDarkTheme: (): boolean => {
        return get().theme === 'dark'
      },

      getIsLightTheme: (): boolean => {
        return get().theme === 'light'
      },

      hasError: (): boolean => {
        return get().error !== null
      },
    }),
    {
      name: STORE_CONSTANTS.UI_STORE_NAME,
    },
  ),
)
