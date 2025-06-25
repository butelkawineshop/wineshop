export interface UIState {
  isLoading: boolean
  error: string | null
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  modalOpen: boolean
  activeModal: string | null
}

export interface UIActions {
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

export interface UISelectors {
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

export const ui = {
  state: {
    isLoading: false,
    error: null,
    theme: 'light',
    sidebarOpen: false,
    modalOpen: false,
    activeModal: null,
  } as UIState,
  actions: {} as UIActions, // To be implemented in useStore
  selectors: {} as UISelectors, // To be implemented in useStore
}
