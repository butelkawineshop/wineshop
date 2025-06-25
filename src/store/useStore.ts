import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { auth, AuthState, AuthActions, AuthSelectors } from './auth'
import { cart, CartState, CartActions, CartSelectors } from './cart'
import { ui, UIState, UIActions, UISelectors } from './ui'
import { wineGrid, WineGridState, WineGridActions, WineGridSelectors } from './wineGrid'
import { language, LanguageState, LanguageActions, LanguageSelectors } from './language'
import { STORE_CONSTANTS } from '@/constants/store'
import type { DomainStore } from './types'
import { LanguageService } from '@/services/LanguageService'
import { logger } from '@/lib/logger'

export interface RootStore {
  auth: DomainStore<AuthState, AuthActions, AuthSelectors>
  cart: DomainStore<CartState, CartActions, CartSelectors>
  ui: DomainStore<UIState, UIActions, UISelectors>
  wineGrid: DomainStore<WineGridState, WineGridActions, WineGridSelectors>
  language: DomainStore<LanguageState, LanguageActions, LanguageSelectors>
}

export const useStore = create<RootStore>()(
  devtools(
    persist(
      (set, get) => ({
        auth: {
          state: { ...auth.state },
          actions: {
            setUser: (user) =>
              set((state) => ({
                auth: {
                  ...state.auth,
                  state: { ...state.auth.state, user, isAuthenticated: !!user },
                },
              })),
            setToken: (token) =>
              set((state) => ({ auth: { ...state.auth, state: { ...state.auth.state, token } } })),
            setLoading: (loading) =>
              set((state) => ({
                auth: { ...state.auth, state: { ...state.auth.state, isLoading: loading } },
              })),
            setError: (error) =>
              set((state) => ({ auth: { ...state.auth, state: { ...state.auth.state, error } } })),
            logout: () => set((_state) => ({ auth: { ...auth, state: { ...auth.state } } })),
            login: (user, token) =>
              set((state) => ({
                auth: {
                  ...state.auth,
                  state: { ...state.auth.state, user, token, isAuthenticated: true, error: null },
                },
              })),
          },
          selectors: {
            getUser: () => get().auth.state.user,
            getToken: () => get().auth.state.token,
            getIsAuthenticated: () => get().auth.state.isAuthenticated,
            getIsLoading: () => get().auth.state.isLoading,
            getError: () => get().auth.state.error,
            getIsAdmin: () => get().auth.state.user?.role === 'admin',
            getIsCustomer: () => get().auth.state.user?.role === 'user',
          },
        },
        cart: {
          state: { ...cart.state },
          actions: {
            addItem: (item) =>
              set((state) => {
                const existingItem = state.cart.state.items.find((i) => i.id === item.id)
                if (existingItem) {
                  return {
                    cart: {
                      ...state.cart,
                      state: {
                        ...state.cart.state,
                        items: state.cart.state.items.map((i) =>
                          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
                        ),
                      },
                    },
                  }
                }
                return {
                  cart: {
                    ...state.cart,
                    state: { ...state.cart.state, items: [...state.cart.state.items, item] },
                  },
                }
              }),
            removeItem: (itemId) =>
              set((state) => ({
                cart: {
                  ...state.cart,
                  state: {
                    ...state.cart.state,
                    items: state.cart.state.items.filter((item) => item.id !== itemId),
                  },
                },
              })),
            updateItemQuantity: (itemId, quantity) =>
              set((state) => ({
                cart: {
                  ...state.cart,
                  state: {
                    ...state.cart.state,
                    items: state.cart.state.items.map((item) =>
                      item.id === itemId ? { ...item, quantity } : item,
                    ),
                  },
                },
              })),
            clearCart: () => set((_state) => ({ cart: { ...cart, state: { ...cart.state } } })),
            setLoading: (loading) =>
              set((state) => ({
                cart: { ...state.cart, state: { ...state.cart.state, isLoading: loading } },
              })),
            setError: (error) =>
              set((state) => ({ cart: { ...state.cart, state: { ...state.cart.state, error } } })),
          },
          selectors: {
            getItems: () => get().cart.state.items,
            getItemCount: () => get().cart.state.items.length,
            getTotalPrice: () =>
              get().cart.state.items.reduce((total, item) => total + item.price * item.quantity, 0),
            getItemById: (itemId) => get().cart.state.items.find((item) => item.id === itemId),
            getIsEmpty: () => get().cart.state.items.length === 0,
            getIsLoading: () => get().cart.state.isLoading,
            getError: () => get().cart.state.error,
            getTotalItems: () =>
              get().cart.state.items.reduce((total, item) => total + item.quantity, 0),
          },
        },
        ui: {
          state: { ...ui.state },
          actions: {
            setLoading: (loading) =>
              set((state) => ({
                ui: { ...state.ui, state: { ...state.ui.state, isLoading: loading } },
              })),
            setError: (error) =>
              set((state) => ({ ui: { ...state.ui, state: { ...state.ui.state, error } } })),
            setTheme: (theme) =>
              set((state) => ({ ui: { ...state.ui, state: { ...state.ui.state, theme } } })),
            setSidebarOpen: (open) =>
              set((state) => ({
                ui: { ...state.ui, state: { ...state.ui.state, sidebarOpen: open } },
              })),
            setModalOpen: (open) =>
              set((state) => ({
                ui: { ...state.ui, state: { ...state.ui.state, modalOpen: open } },
              })),
            setActiveModal: (modal) =>
              set((state) => ({
                ui: { ...state.ui, state: { ...state.ui.state, activeModal: modal } },
              })),
            clearError: () =>
              set((state) => ({ ui: { ...state.ui, state: { ...state.ui.state, error: null } } })),
            toggleSidebar: () =>
              set((state) => ({
                ui: {
                  ...state.ui,
                  state: { ...state.ui.state, sidebarOpen: !state.ui.state.sidebarOpen },
                },
              })),
            toggleTheme: () =>
              set((state) => ({
                ui: {
                  ...state.ui,
                  state: {
                    ...state.ui.state,
                    theme: state.ui.state.theme === 'light' ? 'dark' : 'light',
                  },
                },
              })),
          },
          selectors: {
            getIsLoading: () => get().ui.state.isLoading,
            getError: () => get().ui.state.error,
            getTheme: () => get().ui.state.theme,
            getSidebarOpen: () => get().ui.state.sidebarOpen,
            getModalOpen: () => get().ui.state.modalOpen,
            getActiveModal: () => get().ui.state.activeModal,
            getIsDarkTheme: () => get().ui.state.theme === 'dark',
            getIsLightTheme: () => get().ui.state.theme === 'light',
            hasError: () => get().ui.state.error !== null,
          },
        },
        wineGrid: {
          state: { ...wineGrid.state },
          actions: {
            setVariants: (variants) =>
              set((state) => ({
                wineGrid: { ...state.wineGrid, state: { ...state.wineGrid.state, variants } },
              })),
            setPaginationInfo: (info) =>
              set((state) => ({
                wineGrid: { ...state.wineGrid, state: { ...state.wineGrid.state, ...info } },
              })),
            setCurrentPage: (page) =>
              set((state) => ({
                wineGrid: {
                  ...state.wineGrid,
                  state: { ...state.wineGrid.state, currentPage: page },
                },
              })),
            setLoading: (loading) =>
              set((state) => ({
                wineGrid: {
                  ...state.wineGrid,
                  state: { ...state.wineGrid.state, isLoading: loading },
                },
              })),
            setError: (error) =>
              set((state) => ({
                wineGrid: { ...state.wineGrid, state: { ...state.wineGrid.state, error } },
              })),
            updatePage: (newPage) =>
              set((state) => {
                if (state.wineGrid.state.isLoading || newPage === state.wineGrid.state.currentPage)
                  return {}
                return {
                  wineGrid: {
                    ...state.wineGrid,
                    state: { ...state.wineGrid.state, currentPage: newPage },
                  },
                }
              }),
            reset: () =>
              set((_state) => ({ wineGrid: { ...wineGrid, state: { ...wineGrid.state } } })),
            clearError: () =>
              set((state) => ({
                wineGrid: { ...state.wineGrid, state: { ...state.wineGrid.state, error: null } },
              })),
          },
          selectors: {
            getVariants: () => get().wineGrid.state.variants,
            getTotalDocs: () => get().wineGrid.state.totalDocs,
            getTotalPages: () => get().wineGrid.state.totalPages,
            getCurrentPage: () => get().wineGrid.state.currentPage,
            getHasNextPage: () => get().wineGrid.state.hasNextPage,
            getHasPrevPage: () => get().wineGrid.state.hasPrevPage,
            getIsLoading: () => get().wineGrid.state.isLoading,
            getError: () => get().wineGrid.state.error,
            getIsEmpty: () => get().wineGrid.state.variants.length === 0,
            getVariantCount: () => get().wineGrid.state.variants.length,
            getPageInfo: () => {
              const state = get().wineGrid.state
              return {
                current: state.currentPage,
                total: state.totalPages,
                hasNext: state.hasNextPage,
                hasPrev: state.hasPrevPage,
              }
            },
            hasError: () => get().wineGrid.state.error !== null,
          },
        },
        language: {
          state: { ...language.state },
          actions: {
            setLanguage: (lang) =>
              set((state) => ({
                language: {
                  ...state.language,
                  state: { ...state.language.state, currentLanguage: lang },
                },
              })),
            setSwitching: (switching) =>
              set((state) => ({
                language: {
                  ...state.language,
                  state: { ...state.language.state, isSwitching: switching },
                },
              })),
            setError: (error) =>
              set((state) => ({
                language: { ...state.language, state: { ...state.language.state, error } },
              })),
            clearError: () =>
              set((state) => ({
                language: { ...state.language, state: { ...state.language.state, error: null } },
              })),
            switchLanguage: async (newLanguage, pathname) => {
              try {
                set((state) => ({
                  language: {
                    ...state.language,
                    state: { ...state.language.state, isSwitching: true, error: null },
                  },
                }))

                logger.info({ newLanguage, pathname }, 'Starting language switch in store')

                const { newPath } = await LanguageService.switchLanguage({
                  currentPathname: pathname,
                  newLanguage,
                })

                if (newPath) {
                  // Set the locale cookie
                  document.cookie = `NEXT_LOCALE=${newLanguage};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`

                  // Update the store with new language
                  set((state) => ({
                    language: {
                      ...state.language,
                      state: { ...state.language.state, currentLanguage: newLanguage },
                    },
                  }))

                  // Navigate to new path
                  window.location.href = newPath
                } else {
                  throw new Error('LanguageService failed to calculate new path')
                }
              } catch (error) {
                logger.error({ error, newLanguage, pathname }, 'Language switch failed in store')
                set((state) => ({
                  language: {
                    ...state.language,
                    state: {
                      ...state.language.state,
                      error: 'Failed to switch language. Please try again.',
                    },
                  },
                }))
              } finally {
                set((state) => ({
                  language: {
                    ...state.language,
                    state: { ...state.language.state, isSwitching: false },
                  },
                }))
              }
            },
            toggleLanguage: async (pathname) => {
              try {
                const currentLanguage = get().language.state.currentLanguage
                const newLanguage = currentLanguage === 'en' ? 'sl' : 'en'

                // Use the switchLanguage action
                set((state) => ({
                  language: {
                    ...state.language,
                    state: { ...state.language.state, isSwitching: true, error: null },
                  },
                }))

                const { newPath } = await LanguageService.switchLanguage({
                  currentPathname: pathname,
                  newLanguage,
                })

                if (newPath) {
                  // Set the locale cookie
                  document.cookie = `NEXT_LOCALE=${newLanguage};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`

                  // Update the store with new language
                  set((state) => ({
                    language: {
                      ...state.language,
                      state: { ...state.language.state, currentLanguage: newLanguage },
                    },
                  }))

                  // Navigate to new path
                  window.location.href = newPath
                } else {
                  throw new Error('LanguageService failed to calculate new path')
                }
              } catch (error) {
                logger.error({ error, pathname }, 'Language toggle failed in store')
                set((state) => ({
                  language: {
                    ...state.language,
                    state: {
                      ...state.language.state,
                      error: 'Failed to toggle language. Please try again.',
                    },
                  },
                }))
              } finally {
                set((state) => ({
                  language: {
                    ...state.language,
                    state: { ...state.language.state, isSwitching: false },
                  },
                }))
              }
            },
          },
          selectors: {
            getCurrentLanguage: () => get().language.state.currentLanguage,
            getIsSwitching: () => get().language.state.isSwitching,
            getError: () => get().language.state.error,
            getIsEnglish: () => get().language.state.currentLanguage === 'en',
            getIsSlovenian: () => get().language.state.currentLanguage === 'sl',
            hasError: () => get().language.state.error !== null,
          },
        },
      }),
      {
        name: STORE_CONSTANTS.AUTH_STORE_NAME,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          auth: state.auth,
          cart: state.cart,
          language: state.language,
        }),
      },
    ),
    {
      name: 'wineshop-root-store',
    },
  ),
)
