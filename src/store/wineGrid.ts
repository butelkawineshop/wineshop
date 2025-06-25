import { STORE_CONSTANTS } from '@/constants/store'
import type { FlatWineVariant } from '@/payload-types'

export interface WineGridState {
  variants: FlatWineVariant[]
  totalDocs: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  isLoading: boolean
  error: string | null
}

export interface WineGridActions {
  setVariants: (variants: FlatWineVariant[]) => void
  setPaginationInfo: (info: {
    totalDocs: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }) => void
  setCurrentPage: (page: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updatePage: (newPage: number) => void
  reset: () => void
  clearError: () => void
}

export interface WineGridSelectors {
  getVariants: () => FlatWineVariant[]
  getTotalDocs: () => number
  getTotalPages: () => number
  getCurrentPage: () => number
  getHasNextPage: () => boolean
  getHasPrevPage: () => boolean
  getIsLoading: () => boolean
  getError: () => string | null
  getIsEmpty: () => boolean
  getVariantCount: () => number
  getPageInfo: () => { current: number; total: number; hasNext: boolean; hasPrev: boolean }
  hasError: () => boolean
}

export const wineGrid = {
  state: {
    variants: [],
    totalDocs: 0,
    totalPages: 0,
    currentPage: STORE_CONSTANTS.DEFAULT_PAGE,
    hasNextPage: false,
    hasPrevPage: false,
    isLoading: false,
    error: null,
  } as WineGridState,
  actions: {} as WineGridActions, // To be implemented in useStore
  selectors: {} as WineGridSelectors, // To be implemented in useStore
}
