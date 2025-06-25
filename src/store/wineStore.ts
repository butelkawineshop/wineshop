import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { FlatWineVariant } from '@/payload-types'

// Types
interface WineFilters {
  regions: string[]
  wineries: string[]
  wineCountries: string[]
  styles: string[]
  aromas: string[]
  moods: string[]
  'grape-varieties': string[]
  tags: string[]
  dishes: string[]
  climates: string[]
}

interface WineState {
  // Data
  wineVariants: FlatWineVariant[]
  filteredVariants: FlatWineVariant[]
  isLoading: boolean
  error: string | null

  // Filters
  filters: WineFilters

  // Pagination
  hasMore: boolean
  currentPage: number
  itemsPerPage: number
}

interface WineActions {
  // Data actions
  setWineVariants: (variants: FlatWineVariant[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Filter actions
  setFilter: <K extends keyof WineFilters>(key: K, values: WineFilters[K]) => void
  clearFilter: (key: keyof WineFilters) => void
  clearAllFilters: () => void

  // Pagination actions
  loadMore: () => void
  resetPagination: () => void
}

interface WineSelectors {
  getFilteredCount: () => number
  getTotalCount: () => number
  isFilterActive: (key: keyof WineFilters) => boolean
  hasActiveFilters: () => boolean
}

type WineStore = WineState & WineActions & WineSelectors

// Initial state
const initialState: WineState = {
  wineVariants: [],
  filteredVariants: [],
  isLoading: false,
  error: null,
  filters: {
    regions: [],
    wineries: [],
    wineCountries: [],
    styles: [],
    aromas: [],
    moods: [],
    'grape-varieties': [],
    tags: [],
    dishes: [],
    climates: [],
  },
  hasMore: true,
  currentPage: 1,
  itemsPerPage: 24,
}

// Filter logic
const applyFilters = (variants: FlatWineVariant[], filters: WineFilters): FlatWineVariant[] => {
  return variants.filter((variant) => {
    // Region filter - string matching only
    if (filters.regions.length > 0 && variant.regionTitle) {
      const regionMatch = filters.regions.some((filterRegion) => {
        if (typeof filterRegion === 'string' && filterRegion.length > 0) {
          return variant.regionTitle?.toLowerCase().includes(filterRegion.toLowerCase())
        }
        return false
      })
      if (!regionMatch) return false
    }

    // Winery filter - string matching only
    if (filters.wineries.length > 0 && variant.wineryTitle) {
      const wineryMatch = filters.wineries.some((filterWinery) => {
        if (typeof filterWinery === 'string' && filterWinery.length > 0) {
          return variant.wineryTitle?.toLowerCase().includes(filterWinery.toLowerCase())
        }
        return false
      })
      if (!wineryMatch) return false
    }

    // Country filter - string matching only
    if (filters.wineCountries.length > 0 && variant.countryTitle) {
      const countryMatch = filters.wineCountries.some((filterCountry) => {
        if (typeof filterCountry === 'string' && filterCountry.length > 0) {
          return variant.countryTitle?.toLowerCase().includes(filterCountry.toLowerCase())
        }
        return false
      })
      if (!countryMatch) return false
    }

    // Style filter - string matching only
    if (filters.styles.length > 0 && variant.styleTitle) {
      const styleMatch = filters.styles.some((filterStyle) => {
        if (typeof filterStyle === 'string' && filterStyle.length > 0) {
          return variant.styleTitle?.toLowerCase().includes(filterStyle.toLowerCase())
        }
        return false
      })
      if (!styleMatch) return false
    }

    // Array filters (aromas, moods, grape varieties, tags) - these are always IDs
    const arrayFilters = [
      { key: 'aromas' as const, field: variant.aromas },
      { key: 'moods' as const, field: variant.moods },
      { key: 'grape-varieties' as const, field: variant.grapeVarieties },
      { key: 'tags' as const, field: variant.tags },
    ]

    for (const { key, field } of arrayFilters) {
      if (filters[key].length > 0 && field) {
        const filterIds = filters[key]
        const fieldIds = field.map((item) => item.id).filter(Boolean)
        const hasMatch = filterIds.some((filterId) => fieldIds.includes(filterId))
        if (!hasMatch) return false
      }
    }

    return true
  })
}

// Create store
export const useWineStore = create<WineStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Data actions
        setWineVariants: (variants) => {
          const { filters } = get()
          const filteredVariants = applyFilters(variants, filters)
          set({
            wineVariants: variants,
            filteredVariants,
            hasMore: filteredVariants.length > get().itemsPerPage,
          })
        },

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        // Filter actions
        setFilter: (key, values) => {
          const { wineVariants, filters } = get()
          const newFilters = { ...filters, [key]: values }
          const filteredVariants = applyFilters(wineVariants, newFilters)

          set({
            filters: newFilters,
            filteredVariants,
            currentPage: 1, // Reset to first page when filtering
            hasMore: filteredVariants.length > get().itemsPerPage,
          })
        },

        clearFilter: (key) => {
          const { wineVariants, filters } = get()
          const newFilters = { ...filters, [key]: [] }
          const filteredVariants = applyFilters(wineVariants, newFilters)

          set({
            filters: newFilters,
            filteredVariants,
            currentPage: 1,
            hasMore: filteredVariants.length > get().itemsPerPage,
          })
        },

        clearAllFilters: () => {
          const { wineVariants } = get()
          const filteredVariants = applyFilters(wineVariants, initialState.filters)

          set({
            filters: initialState.filters,
            filteredVariants,
            currentPage: 1,
            hasMore: filteredVariants.length > get().itemsPerPage,
          })
        },

        // Pagination actions
        loadMore: () => {
          const { currentPage, itemsPerPage, filteredVariants } = get()
          const nextPage = currentPage + 1
          const hasMore = filteredVariants.length > nextPage * itemsPerPage

          set({
            currentPage: nextPage,
            hasMore,
          })
        },

        resetPagination: () => set({ currentPage: 1 }),

        // Selectors
        getFilteredCount: () => get().filteredVariants.length,

        getTotalCount: () => get().wineVariants.length,

        isFilterActive: (key) => {
          const { filters } = get()
          return filters[key].length > 0
        },

        hasActiveFilters: () => {
          const { filters } = get()
          return Object.values(filters).some((values) => values.length > 0)
        },
      }),
      {
        name: 'wine-store',
        partialize: (state) => ({
          filters: state.filters,
        }),
      },
    ),
    {
      name: 'wine-store',
    },
  ),
)
