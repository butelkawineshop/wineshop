import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { FlatWineVariant } from '@/payload-types'
import { STORE_CONSTANTS } from '@/constants/store'

// State interface
interface WineGridState {
  variants: FlatWineVariant[]
  totalDocs: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  isLoading: boolean
}

// Actions interface
interface WineGridActions {
  setVariants: (variants: FlatWineVariant[]) => void
  setPaginationInfo: (info: {
    totalDocs: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }) => void
  setCurrentPage: (page: number) => void
  setLoading: (loading: boolean) => void
  updatePage: (newPage: number) => void
  reset: () => void
}

// Selectors interface
interface WineGridSelectors {
  getVariants: () => FlatWineVariant[]
  getTotalDocs: () => number
  getTotalPages: () => number
  getCurrentPage: () => number
  getHasNextPage: () => boolean
  getHasPrevPage: () => boolean
  getIsLoading: () => boolean
  getIsEmpty: () => boolean
  getVariantCount: () => number
  getPageInfo: () => { current: number; total: number; hasNext: boolean; hasPrev: boolean }
}

// Combined store interface
interface WineGridStore extends WineGridState, WineGridActions, WineGridSelectors {}

const initialState: WineGridState = {
  variants: [],
  totalDocs: 0,
  totalPages: 0,
  currentPage: 1,
  hasNextPage: false,
  hasPrevPage: false,
  isLoading: false,
}

export const useWineGridStore = create<WineGridStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      setVariants: (variants: FlatWineVariant[]): void => {
        set({ variants })
      },

      setPaginationInfo: (info: {
        totalDocs: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
      }): void => {
        set({
          totalDocs: info.totalDocs,
          totalPages: info.totalPages,
          hasNextPage: info.hasNextPage,
          hasPrevPage: info.hasPrevPage,
        })
      },

      setCurrentPage: (page: number): void => {
        set({ currentPage: page })
      },

      setLoading: (loading: boolean): void => {
        set({ isLoading: loading })
      },

      updatePage: (newPage: number): void => {
        const state = get()
        if (state.isLoading || newPage === state.currentPage) return

        set({ currentPage: newPage })
      },

      reset: (): void => {
        set(initialState)
      },

      // Selectors
      getVariants: (): FlatWineVariant[] => {
        return get().variants
      },

      getTotalDocs: (): number => {
        return get().totalDocs
      },

      getTotalPages: (): number => {
        return get().totalPages
      },

      getCurrentPage: (): number => {
        return get().currentPage
      },

      getHasNextPage: (): boolean => {
        return get().hasNextPage
      },

      getHasPrevPage: (): boolean => {
        return get().hasPrevPage
      },

      getIsLoading: (): boolean => {
        return get().isLoading
      },

      getIsEmpty: (): boolean => {
        return get().variants.length === 0
      },

      getVariantCount: (): number => {
        return get().variants.length
      },

      getPageInfo: (): { current: number; total: number; hasNext: boolean; hasPrev: boolean } => {
        const state = get()
        return {
          current: state.currentPage,
          total: state.totalPages,
          hasNext: state.hasNextPage,
          hasPrev: state.hasPrevPage,
        }
      },
    }),
    {
      name: STORE_CONSTANTS.WINE_GRID_STORE_NAME,
    },
  ),
)
