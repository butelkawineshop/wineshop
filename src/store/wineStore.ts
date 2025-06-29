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
  // Price range
  priceRange: [number, number]
  // Tasting notes ranges
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

interface SortState {
  field: 'createdAt' | 'price' | 'name'
  direction: 'asc' | 'desc'
}

interface WineState {
  // Data
  wineVariants: FlatWineVariant[]
  filteredVariants: FlatWineVariant[]
  isLoading: boolean
  error: string | null
  hasFetched: boolean
  // Filters
  filters: WineFilters
  // Sorting
  sort: SortState
}

interface WineActions {
  // Data actions
  setWineVariants: (variants: FlatWineVariant[]) => void
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

  // Migration function
  _migrateFilters: () => void
}

interface WineSelectors {
  getFilteredCount: () => number
  getTotalCount: () => number
  isFilterActive: (key: keyof WineFilters) => boolean
  isPriceFilterActive: () => boolean
  isTastingNotesFilterActive: () => boolean
  hasActiveFilters: () => boolean
  getCurrentSort: () => SortState
}

type WineStore = WineState & WineActions & WineSelectors

// Initial state
const initialState: WineState = {
  wineVariants: [],
  filteredVariants: [],
  isLoading: false,
  error: null,
  hasFetched: false,
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

    // Price range filter
    if (variant.price !== null && variant.price !== undefined) {
      const [minPrice, maxPrice] = filters.priceRange
      if (variant.price < minPrice || variant.price > maxPrice) {
        return false
      }
    }

    // Tasting notes filters - only apply if user has set non-default ranges
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

    // Check if any tasting notes filters are active (non-default ranges)
    const hasActiveTastingNotesFilters = Object.entries(filters.tastingNotes).some(
      ([key, range]) => {
        const defaultRange = defaultRanges[key as keyof typeof defaultRanges]
        return range[0] !== defaultRange[0] || range[1] !== defaultRange[1]
      },
    )

    // Only apply tasting notes filtering if user has set non-default ranges
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

        // Only filter if the user has set a non-default range for this specific tasting note
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

    // Array filters (aromas, moods, grape varieties, tags, climates, dishes) - these are always IDs
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
        // For array filters, we now use titles for both filter values and matching
        const filterTitles = filters[key] // These are now titles, not IDs

        // For tags, also include winery tags
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

        // Match by title
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
export const useWineStore = create<WineStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Migration function to ensure proper initialization
        _migrateFilters: () => {
          const { filters } = get()
          if (!filters.priceRange) {
            set({ filters: { ...filters, priceRange: [0, 1000] } })
          }
          if (!filters.tastingNotes) {
            set({
              filters: {
                ...filters,
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
            })
          }

          // Reset price range if it's too restrictive (less than 100)
          if (filters.priceRange && filters.priceRange[1] < 100) {
            console.log('🍷 Resetting restrictive price range filter')
            set({ filters: { ...filters, priceRange: [0, 1000] } })
          }
        },

        // Data actions
        setWineVariants: (variants) => {
          const { filters, sort } = get()
          const filteredVariants = applyFilters(variants, filters)
          const sortedAndFilteredVariants = applySort(filteredVariants, sort)

          set({
            wineVariants: variants,
            filteredVariants: sortedAndFilteredVariants,
            hasFetched: true,
          })
        },

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        setHasFetched: (hasFetched: boolean) => set({ hasFetched }),

        // Filter actions
        setFilter: (key, values) => {
          const { wineVariants, filters, sort } = get()
          const newFilters = { ...filters, [key]: values }
          const filteredVariants = applyFilters(wineVariants, newFilters)
          const sortedAndFilteredVariants = applySort(filteredVariants, sort)

          set({
            filters: newFilters,
            filteredVariants: sortedAndFilteredVariants,
          })
        },

        clearFilter: (key) => {
          const { wineVariants, filters, sort } = get()
          const newFilters = { ...filters, [key]: [] }
          const filteredVariants = applyFilters(wineVariants, newFilters)
          const sortedAndFilteredVariants = applySort(filteredVariants, sort)

          set({
            filters: newFilters,
            filteredVariants: sortedAndFilteredVariants,
          })
        },

        clearAllFilters: () => {
          const { wineVariants, sort } = get()
          const filteredVariants = applyFilters(wineVariants, initialState.filters)
          const sortedAndFilteredVariants = applySort(filteredVariants, sort)

          set({
            filters: initialState.filters,
            filteredVariants: sortedAndFilteredVariants,
          })
        },

        // Sort actions
        setSort: (field, direction) => {
          const { wineVariants, filters, sort } = get()
          const newSort: SortState = {
            field,
            direction:
              direction || (sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc'),
          }
          const filteredVariants = applyFilters(wineVariants, filters)
          const sortedAndFilteredVariants = applySort(filteredVariants, newSort)

          set({
            sort: newSort,
            filteredVariants: sortedAndFilteredVariants,
          })
        },

        toggleSortDirection: () => {
          const { wineVariants, filters, sort } = get()
          const newSort: SortState = {
            ...sort,
            direction: sort.direction === 'asc' ? 'desc' : 'asc',
          }
          const filteredVariants = applyFilters(wineVariants, filters)
          const sortedAndFilteredVariants = applySort(filteredVariants, newSort)

          set({
            sort: newSort,
            filteredVariants: sortedAndFilteredVariants,
          })
        },

        // Selectors
        getFilteredCount: () => get().filteredVariants.length,

        getTotalCount: () => get().wineVariants.length,

        getCurrentSort: () => get().sort,

        isFilterActive: (key) => {
          const { filters } = get()
          // Only check array-based filters
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

          // Check array filters (these are string arrays)
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

          // Check price range (if not default)
          const hasPriceFilter = filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000

          // Check tasting notes (if any are not at default range)
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
      }),
      {
        name: 'wine-store',
        partialize: (state) => ({
          filters: state.filters,
          sort: state.sort,
        }),
      },
    ),
    {
      name: 'wine-store',
    },
  ),
)
