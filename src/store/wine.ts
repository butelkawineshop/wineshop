import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { STORE_CONSTANTS } from '@/constants/store'
import type { FlatWineVariant } from '@/payload-types'

// Types
export interface WineFilters {
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
  priceRange: [number, number]
  tastingNotes: {
    dry: [number, number]
    ripe: [number, number]
    creamy: [number, number]
    oaky: [number, number]
    complex: [number, number]
    light: [number, number]
    smooth: [number, number]
    youthful: [number, number]
    energetic: [number, number]
    alcohol: [number, number]
  }
}

export interface SortState {
  field: 'createdAt' | 'price' | 'name'
  direction: 'asc' | 'desc'
}

export interface WineState {
  // Data
  variants: FlatWineVariant[]
  filteredVariants: FlatWineVariant[]
  isLoading: boolean
  error: string | null
  hasFetched: boolean

  // Pagination
  totalDocs: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean

  // Filters
  filters: WineFilters

  // Sorting
  sort: SortState
}

export interface WineActions {
  // Data actions
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
  setHasFetched: (hasFetched: boolean) => void

  // Filter actions
  setFilter: <K extends keyof WineFilters>(key: K, values: WineFilters[K]) => void
  clearFilter: (key: keyof WineFilters) => void
  clearAllFilters: () => void

  // Sort actions
  setSort: (field: SortState['field'], direction?: SortState['direction']) => void
  toggleSortDirection: () => void

  // Utility actions
  reset: () => void
  clearError: () => void
  updatePage: (newPage: number) => void
}

export interface WineSelectors {
  // Data selectors
  getVariants: () => FlatWineVariant[]
  getFilteredVariants: () => FlatWineVariant[]
  getFilteredCount: () => number
  getTotalCount: () => number
  getIsEmpty: () => boolean
  getVariantCount: () => number

  // Pagination selectors
  getTotalDocs: () => number
  getTotalPages: () => number
  getCurrentPage: () => number
  getHasNextPage: () => boolean
  getHasPrevPage: () => boolean
  getPageInfo: () => { current: number; total: number; hasNext: boolean; hasPrev: boolean }

  // Status selectors
  getIsLoading: () => boolean
  getError: () => string | null
  hasError: () => boolean
  getHasFetched: () => boolean

  // Filter selectors
  isFilterActive: (key: keyof WineFilters) => boolean
  isPriceFilterActive: () => boolean
  isTastingNotesFilterActive: () => boolean
  hasActiveFilters: () => boolean

  // Sort selectors
  getCurrentSort: () => SortState
}

// Initial state
const initialState: WineState = {
  variants: [],
  filteredVariants: [],
  isLoading: false,
  error: null,
  hasFetched: false,
  totalDocs: 0,
  totalPages: 0,
  currentPage: STORE_CONSTANTS.DEFAULT_PAGE,
  hasNextPage: false,
  hasPrevPage: false,
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
    priceRange: [0, 1000],
    tastingNotes: {
      dry: [0, 10],
      ripe: [0, 10],
      creamy: [0, 10],
      oaky: [0, 10],
      complex: [0, 10],
      light: [0, 10],
      smooth: [0, 10],
      youthful: [0, 10],
      energetic: [0, 10],
      alcohol: [0, 20],
    },
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
}

// Sort logic
const applySort = (variants: FlatWineVariant[], sort: SortState): FlatWineVariant[] => {
  const sortedVariants = [...variants]

  sortedVariants.sort((a, b) => {
    let aValue: string | number | Date
    let bValue: string | number | Date

    switch (sort.field) {
      case 'createdAt':
        aValue = new Date(a.createdAt || 0)
        bValue = new Date(b.createdAt || 0)
        break
      case 'price':
        aValue = a.price || 0
        bValue = b.price || 0
        break
      case 'name':
        aValue = a.slug || ''
        bValue = b.slug || ''
        break
      default:
        return 0
    }

    if (sort.direction === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })

  return sortedVariants
}

// Filter logic
const applyFilters = (variants: FlatWineVariant[], filters: WineFilters): FlatWineVariant[] => {
  return variants.filter((variant) => {
    // Region filter
    if (filters.regions.length > 0 && variant.regionTitle) {
      const regionMatch = filters.regions.some((filterRegion) => {
        if (typeof filterRegion === 'string' && filterRegion.length > 0) {
          return variant.regionTitle?.toLowerCase().includes(filterRegion.toLowerCase())
        }
        return false
      })
      if (!regionMatch) return false
    }

    // Winery filter
    if (filters.wineries.length > 0 && variant.wineryTitle) {
      const wineryMatch = filters.wineries.some((filterWinery) => {
        if (typeof filterWinery === 'string' && filterWinery.length > 0) {
          return variant.wineryTitle?.toLowerCase().includes(filterWinery.toLowerCase())
        }
        return false
      })
      if (!wineryMatch) return false
    }

    // Country filter
    if (filters.wineCountries.length > 0 && variant.countryTitle) {
      const countryMatch = filters.wineCountries.some((filterCountry) => {
        if (typeof filterCountry === 'string' && filterCountry.length > 0) {
          return variant.countryTitle?.toLowerCase().includes(filterCountry.toLowerCase())
        }
        return false
      })
      if (!countryMatch) return false
    }

    // Style filter
    if (filters.styles.length > 0 && variant.styleTitle) {
      const styleMatch = filters.styles.some((filterStyle) => {
        if (typeof filterStyle === 'string' && filterStyle.length > 0) {
          return variant.styleTitle?.toLowerCase().includes(filterStyle.toLowerCase())
        }
        return false
      })
      if (!styleMatch) return false
    }

    // Price range filter
    if (variant.price !== null && variant.price !== undefined) {
      const [minPrice, maxPrice] = filters.priceRange
      if (variant.price < minPrice || variant.price > maxPrice) {
        return false
      }
    }

    // Tasting notes filters
    const defaultRanges = {
      dry: [0, 10],
      ripe: [0, 10],
      creamy: [0, 10],
      oaky: [0, 10],
      complex: [0, 10],
      light: [0, 10],
      smooth: [0, 10],
      youthful: [0, 10],
      energetic: [0, 10],
      alcohol: [0, 20],
    }

    const hasActiveTastingNotesFilters = Object.entries(filters.tastingNotes).some(
      ([key, range]) => {
        const defaultRange = defaultRanges[key as keyof typeof defaultRanges]
        return range[0] !== defaultRange[0] || range[1] !== defaultRange[1]
      },
    )

    if (hasActiveTastingNotesFilters && variant.tastingNotes) {
      const tastingNoteKeys = [
        'dry',
        'ripe',
        'creamy',
        'oaky',
        'complex',
        'light',
        'smooth',
        'youthful',
        'energetic',
        'alcohol',
      ] as const

      for (const key of tastingNoteKeys) {
        const variantValue = variant.tastingNotes[key]
        const [minValue, maxValue] = filters.tastingNotes[key]

        const defaultRange = defaultRanges[key]
        const isFilterActive = minValue !== defaultRange[0] || maxValue !== defaultRange[1]

        if (isFilterActive) {
          if (
            variantValue === null ||
            variantValue === undefined ||
            variantValue < minValue ||
            variantValue > maxValue
          ) {
            return false
          }
        }
      }
    }

    // Array filters
    const arrayFilters = [
      { key: 'aromas' as const, field: variant.aromas },
      { key: 'moods' as const, field: variant.moods },
      { key: 'grape-varieties' as const, field: variant.grapeVarieties },
      { key: 'tags' as const, field: variant.tags, additionalField: variant.wineryTags },
      { key: 'climates' as const, field: variant.climates },
      { key: 'dishes' as const, field: variant.dishes },
    ]

    for (const { key, field, additionalField } of arrayFilters) {
      if (filters[key].length > 0 && (field || additionalField)) {
        const filterTitles = filters[key]

        let fieldTitles: string[] = []
        if (field) {
          fieldTitles = field
            .map((item) => item.title)
            .filter((title): title is string => Boolean(title))
        }
        if (additionalField && key === 'tags') {
          const wineryTagTitles = additionalField
            .map((item) => item.title)
            .filter((title): title is string => Boolean(title))
          fieldTitles = [...fieldTitles, ...wineryTagTitles]
        }

        const hasMatch = filterTitles.some((filterTitle) => {
          return fieldTitles.some((title) => title === filterTitle)
        })

        if (!hasMatch) {
          return false
        }
      }
    }

    return true
  })
}

// Create store
export const useWineStore = create<WineState & WineActions & WineSelectors>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Data actions
        setVariants: (variants) => {
          const { filters, sort } = get()
          const filteredVariants = applyFilters(variants, filters)
          const sortedAndFilteredVariants = applySort(filteredVariants, sort)

          set({
            variants,
            filteredVariants: sortedAndFilteredVariants,
            hasFetched: true,
          })
        },

        setPaginationInfo: (info) =>
          set((state) => ({
            ...state,
            ...info,
          })),

        setCurrentPage: (page) =>
          set((state) => ({
            ...state,
            currentPage: page,
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        setHasFetched: (hasFetched) => set({ hasFetched }),

        // Filter actions
        setFilter: (key, values) => {
          const { variants, filters, sort } = get()
          const newFilters = { ...filters, [key]: values }
          const filteredVariants = applyFilters(variants, newFilters)
          const sortedAndFilteredVariants = applySort(filteredVariants, sort)

          set({
            filters: newFilters,
            filteredVariants: sortedAndFilteredVariants,
          })
        },

        clearFilter: (key) => {
          const { variants, filters, sort } = get()
          const newFilters = { ...filters, [key]: [] }
          const filteredVariants = applyFilters(variants, newFilters)
          const sortedAndFilteredVariants = applySort(filteredVariants, sort)

          set({
            filters: newFilters,
            filteredVariants: sortedAndFilteredVariants,
          })
        },

        clearAllFilters: () => {
          const { variants, sort } = get()
          const filteredVariants = applyFilters(variants, initialState.filters)
          const sortedAndFilteredVariants = applySort(filteredVariants, sort)

          set({
            filters: initialState.filters,
            filteredVariants: sortedAndFilteredVariants,
          })
        },

        // Sort actions
        setSort: (field, direction) => {
          const { variants, filters, sort } = get()
          const newSort: SortState = {
            field,
            direction:
              direction || (sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc'),
          }
          const filteredVariants = applyFilters(variants, filters)
          const sortedAndFilteredVariants = applySort(filteredVariants, newSort)

          set({
            sort: newSort,
            filteredVariants: sortedAndFilteredVariants,
          })
        },

        toggleSortDirection: () => {
          const { variants, filters, sort } = get()
          const newSort: SortState = {
            ...sort,
            direction: sort.direction === 'asc' ? 'desc' : 'asc',
          }
          const filteredVariants = applyFilters(variants, filters)
          const sortedAndFilteredVariants = applySort(filteredVariants, newSort)

          set({
            sort: newSort,
            filteredVariants: sortedAndFilteredVariants,
          })
        },

        // Utility actions
        reset: () => set(initialState),

        clearError: () => set({ error: null }),

        updatePage: (newPage) => {
          const { isLoading, currentPage } = get()
          if (isLoading || newPage === currentPage) return
          set({ currentPage: newPage })
        },

        // Selectors
        getVariants: () => get().variants,
        getFilteredVariants: () => get().filteredVariants,
        getFilteredCount: () => get().filteredVariants.length,
        getTotalCount: () => get().variants.length,
        getIsEmpty: () => get().filteredVariants.length === 0,
        getVariantCount: () => get().filteredVariants.length,
        getTotalDocs: () => get().totalDocs,
        getTotalPages: () => get().totalPages,
        getCurrentPage: () => get().currentPage,
        getHasNextPage: () => get().hasNextPage,
        getHasPrevPage: () => get().hasPrevPage,
        getPageInfo: () => {
          const state = get()
          return {
            current: state.currentPage,
            total: state.totalPages,
            hasNext: state.hasNextPage,
            hasPrev: state.hasPrevPage,
          }
        },
        getIsLoading: () => get().isLoading,
        getError: () => get().error,
        hasError: () => get().error !== null,
        getHasFetched: () => get().hasFetched,
        isFilterActive: (key) => {
          const { filters } = get()
          const arrayFilterKeys = [
            'regions',
            'wineries',
            'wineCountries',
            'styles',
            'aromas',
            'moods',
            'grape-varieties',
            'tags',
            'dishes',
            'climates',
          ] as const

          if (arrayFilterKeys.includes(key as (typeof arrayFilterKeys)[number])) {
            const filterValue = filters[key] as string[]
            return filterValue.length > 0
          }
          return false
        },
        isPriceFilterActive: () => {
          const { filters } = get()
          return filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000
        },
        isTastingNotesFilterActive: () => {
          const { filters } = get()
          const defaultRanges = {
            dry: [0, 10],
            ripe: [0, 10],
            creamy: [0, 10],
            oaky: [0, 10],
            complex: [0, 10],
            light: [0, 10],
            smooth: [0, 10],
            youthful: [0, 10],
            energetic: [0, 10],
            alcohol: [0, 20],
          }

          return Object.entries(filters.tastingNotes).some(([key, range]) => {
            const defaultRange = defaultRanges[key as keyof typeof defaultRanges]
            return range[0] !== defaultRange[0] || range[1] !== defaultRange[1]
          })
        },
        hasActiveFilters: () => {
          const { filters } = get()

          const hasArrayFilters =
            filters.regions.length > 0 ||
            filters.wineries.length > 0 ||
            filters.wineCountries.length > 0 ||
            filters.styles.length > 0 ||
            filters.aromas.length > 0 ||
            filters.moods.length > 0 ||
            filters['grape-varieties'].length > 0 ||
            filters.tags.length > 0 ||
            filters.dishes.length > 0 ||
            filters.climates.length > 0

          const hasPriceFilter = filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000

          const defaultRanges = {
            dry: [0, 10],
            ripe: [0, 10],
            creamy: [0, 10],
            oaky: [0, 10],
            complex: [0, 10],
            light: [0, 10],
            smooth: [0, 10],
            youthful: [0, 10],
            energetic: [0, 10],
            alcohol: [0, 20],
          }

          const hasTastingNotesFilter = Object.entries(filters.tastingNotes).some(
            ([key, range]) => {
              const defaultRange = defaultRanges[key as keyof typeof defaultRanges]
              return range[0] !== defaultRange[0] || range[1] !== defaultRange[1]
            },
          )

          return hasArrayFilters || hasPriceFilter || hasTastingNotesFilter
        },
        getCurrentSort: () => get().sort,
      }),
      {
        name: STORE_CONSTANTS.WINE_STORE_NAME,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          filters: state.filters,
          sort: state.sort,
          currentPage: state.currentPage,
        }),
      },
    ),
    {
      name: 'wine-store',
    },
  ),
)

// Export store structure following conventions
export const wine = {
  state: initialState,
  actions: {} as WineActions, // Implemented in useWineStore
  selectors: {} as WineSelectors, // Implemented in useWineStore
}
