'use client'

import React, { useState } from 'react'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion } from '@/components/Accordion'
import type { Locale } from '@/i18n/locales'
import { useTranslation } from '@/hooks/useTranslation'
import { useDebounce } from '@/hooks/useDebounce'
import {
  FILTER_CONSTANTS,
  FILTER_COLLECTIONS,
  TASTING_NOTES,
  DEFAULT_TASTING_NOTES,
} from '@/constants/filters'
import { useWineStore } from '@/store/wine'
import { ResetFilterButton } from './ResetFilterButton'
import { logger } from '@/lib/logger'
import type { FlatWineVariant } from '@/payload-types'

// Use the actual structure from GraphQL function
interface CollectionItem {
  id: string
  title:
    | string
    | {
        sl: string
        en?: string
      }
  slug?: string
}

type CollectionItemsMap = Record<string, CollectionItem[]>

// Tasting notes range type - matches DEFAULT_TASTING_NOTES structure
type TastingNotesRange = {
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

interface WineFiltersClientProps {
  collectionItems: CollectionItemsMap
  currentCollection?: {
    id: string
    type: string
  }
  locale: Locale
}

// Helper function to check if a filter key is an array filter
const isArrayFilter = (key: string): key is (typeof FILTER_CONSTANTS.VALID_FILTER_KEYS)[number] => {
  return FILTER_CONSTANTS.VALID_FILTER_KEYS.includes(key as any)
}

// Helper to get the effective price (future-proof for discounts)
function getEffectivePrice(item: FlatWineVariant): number | undefined {
  // In the future, check for discountedPrice here
  return typeof item.price === 'number' ? item.price : undefined
}

// Helper to get min/max price from wine variants in the store
function getPriceBounds(wineVariants: FlatWineVariant[]): [number, number] {
  let min = Infinity
  let max = -Infinity
  wineVariants.forEach((item) => {
    const price = getEffectivePrice(item)
    if (typeof price === 'number') {
      if (price < min) min = price
      if (price > max) max = price
    }
  })
  if (min === Infinity || max === -Infinity) {
    return [FILTER_CONSTANTS.PRICE.DEFAULT_MIN, FILTER_CONSTANTS.PRICE.DEFAULT_MAX]
  }
  return [Math.floor(min), Math.ceil(max)]
}

// Helper to get localized title from collection item
function getLocalizedTitle(item: CollectionItem, locale: Locale): string {
  if (typeof item.title === 'object') {
    return locale === 'en' && item.title.en ? item.title.en : item.title.sl || item.title.en || ''
  }
  return item.title || ''
}

export default function WineFiltersClient({
  collectionItems,
  currentCollection,
  locale,
}: WineFiltersClientProps): React.JSX.Element {
  const { t } = useTranslation()
  const { filters, setFilter, clearFilter, variants } = useWineStore()

  // Migrate filters if needed (for persisted data) - removed _migrateFilters as it's not in new store
  React.useEffect(() => {
    // Migration is handled automatically in the new store
  }, [])

  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({})
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  // Debounced search queries for filtering
  const debouncedSearchQueries = useDebounce(searchQueries, FILTER_CONSTANTS.DEBOUNCE.SEARCH)

  // Calculate price bounds from wine variants in the store
  const [priceMin, priceMax] = React.useMemo(
    () => getPriceBounds(variants as unknown as FlatWineVariant[]),
    [variants],
  )

  // Debounced state for immediate UI updates
  const [immediatePriceRange, setImmediatePriceRange] = useState<[number, number]>(
    filters?.priceRange || [priceMin, priceMax],
  )
  const [immediateTastingNotes, setImmediateTastingNotes] = useState<TastingNotesRange>(
    filters?.tastingNotes || DEFAULT_TASTING_NOTES,
  )

  // Debounced values that will trigger API calls
  const debouncedPriceRange = useDebounce(
    immediatePriceRange,
    FILTER_CONSTANTS.DEBOUNCE.PRICE_RANGE,
  )
  const debouncedTastingNotes = useDebounce(
    immediateTastingNotes,
    FILTER_CONSTANTS.DEBOUNCE.TASTING_NOTES,
  )

  // If price bounds change and current range is out of bounds, update it
  React.useEffect(() => {
    if (
      immediatePriceRange[0] < priceMin ||
      immediatePriceRange[1] > priceMax ||
      immediatePriceRange[0] > immediatePriceRange[1] ||
      immediatePriceRange[0] === immediatePriceRange[1]
    ) {
      setImmediatePriceRange([priceMin, priceMax])
    }
  }, [priceMin, priceMax, immediatePriceRange])

  // Update filters when debounced values change
  React.useEffect(() => {
    if (filters?.priceRange !== debouncedPriceRange) {
      setFilter('priceRange', debouncedPriceRange)
    }
  }, [debouncedPriceRange, setFilter, filters?.priceRange])

  React.useEffect(() => {
    if (JSON.stringify(filters?.tastingNotes) !== JSON.stringify(debouncedTastingNotes)) {
      setFilter('tastingNotes', debouncedTastingNotes)
    }
  }, [debouncedTastingNotes, setFilter, filters?.tastingNotes])

  // Update immediate state when filters change externally
  React.useEffect(() => {
    if (filters?.priceRange) {
      setImmediatePriceRange(filters.priceRange)
    } else {
      setImmediatePriceRange([priceMin, priceMax])
    }
  }, [filters?.priceRange, priceMin, priceMax])

  React.useEffect(() => {
    if (filters?.tastingNotes) {
      setImmediateTastingNotes(filters.tastingNotes)
    }
  }, [filters?.tastingNotes])

  // Safety check - ensure filters are properly initialized
  if (!filters) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div>{t('common.loading')}</div>
        <Button
          onClick={() => {
            localStorage.removeItem('wine-store')
            window.location.reload()
          }}
          variant="outline"
        >
          {t('common.reset')}
        </Button>
      </div>
    )
  }

  const toggleFilter = (key: string, value: string): void => {
    if (!isArrayFilter(key)) return

    const currentValues = filters[key] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    setFilter(key, newValues)
  }

  const updateTastingNoteRange = (key: string, value: [number, number]): void => {
    setImmediateTastingNotes((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updatePriceRange = (value: [number, number]): void => {
    setImmediatePriceRange(value)
  }

  const resetCollectionFilter = (key: string): void => {
    if (isArrayFilter(key)) {
      clearFilter(key)
    } else {
      logger.warn(`Invalid filter key: ${key}`)
    }
  }

  const resetPriceFilter = (): void => {
    setImmediatePriceRange([priceMin, priceMax])
  }

  const resetTastingNotesFilter = (): void => {
    setImmediateTastingNotes(DEFAULT_TASTING_NOTES)
  }

  const handleSearchChange = (collection: string, value: string): void => {
    setSearchQueries((prev: Record<string, string>) => ({
      ...prev,
      [collection]: value,
    }))
  }

  const getFilteredItems = (collection: string): CollectionItem[] => {
    const items = collectionItems[collection] || []
    const searchQuery = debouncedSearchQueries[collection] || ''

    if (!searchQuery) return items

    return items.filter((item) => {
      const title = getLocalizedTitle(item, locale)
      return title.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }

  const toggleAccordion = (key: string): void => {
    setOpenAccordion((prev: string | null) => (prev === key ? null : key))
  }

  const getActiveFilters = (key: string): string[] => {
    if (!isArrayFilter(key)) return []
    return filters[key] as string[]
  }

  const getTastingNoteRange = (key: string): [number, number] => {
    return (
      immediateTastingNotes[key as keyof typeof immediateTastingNotes] ||
      DEFAULT_TASTING_NOTES[key as keyof typeof DEFAULT_TASTING_NOTES]
    )
  }

  const getPriceRange = (): [number, number] => {
    return immediatePriceRange
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
        <Accordion
          title={t('filters.collections')}
          isOpen={openAccordion === 'collections'}
          onToggle={() => toggleAccordion('collections')}
          icon="filters"
          className="rounded-t-lg border-0"
        >
          <div className={`grid ${FILTER_CONSTANTS.COLLECTION_GRID} ${FILTER_CONSTANTS.GRID_GAP}`}>
            {FILTER_COLLECTIONS.map(({ key, icon, translationKey, collection }) => {
              const filteredItems = getFilteredItems(collection)
              const activeFilters = getActiveFilters(key)
              const isCurrentCollection = currentCollection?.type === collection

              return (
                <DropdownMenu
                  key={key}
                  trigger={
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Icon name={icon} className="w-5 h-5" variant="color" />
                      <span className="flex-1 text-left">{t(translationKey)}</span>
                      {activeFilters.length > 0 && (
                        <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                          {activeFilters.length}
                        </span>
                      )}
                    </Button>
                  }
                >
                  <DropdownMenuContent className="w-[300px] p-2 bg-background">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder={t('filters.search')}
                          value={searchQueries[collection] || ''}
                          onChange={(e) => handleSearchChange(collection, e.target.value)}
                          className="flex-1"
                        />
                        {activeFilters.length > 0 && (
                          <ResetFilterButton
                            onReset={() => resetCollectionFilter(key)}
                            className="ml-2"
                          />
                        )}
                      </div>
                      <div className={`${FILTER_CONSTANTS.DROPDOWN_MAX_HEIGHT} overflow-y-auto`}>
                        {filteredItems.map((item) => {
                          const filterValue = getLocalizedTitle(item, locale)
                          const isSelected = activeFilters.includes(filterValue)
                          const isLocked = isCurrentCollection && item.id === currentCollection.id

                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                            >
                              <Checkbox
                                id={`${key}-${item.id}`}
                                checked={isSelected}
                                onChange={() => !isLocked && toggleFilter(key, filterValue)}
                                disabled={isLocked}
                              />
                              <label
                                htmlFor={`${key}-${item.id}`}
                                className="flex-1 cursor-pointer text-sm"
                              >
                                {getLocalizedTitle(item, locale)}
                              </label>
                              {isLocked && (
                                <Icon
                                  name="lock"
                                  className="w-4 h-4 text-muted-foreground"
                                  variant="color"
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}
          </div>
        </Accordion>

        <Accordion
          title={t('filters.price')}
          isOpen={openAccordion === 'price'}
          onToggle={() => toggleAccordion('price')}
          icon="price"
          className="border-0"
        >
          <div className="flex flex-col gap-4">
            {priceMin === priceMax ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                {t('filters.noPricesFound')}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between text-sm flex-1">
                    <span>€{getPriceRange()[0]}</span>
                    <span>€{getPriceRange()[1]}</span>
                  </div>
                  {getPriceRange()[0] !== priceMin || getPriceRange()[1] !== priceMax ? (
                    <ResetFilterButton onReset={resetPriceFilter} className="ml-2" />
                  ) : null}
                </div>
                <Slider
                  value={getPriceRange()}
                  onValueChange={updatePriceRange}
                  min={priceMin}
                  max={priceMax}
                  step={1}
                  className="w-full"
                />
              </>
            )}
          </div>
        </Accordion>

        <Accordion
          title={t('filters.tastingNotes')}
          isOpen={openAccordion === 'tastingNotes'}
          onToggle={() => toggleAccordion('tastingNotes')}
          icon="tastings"
          className="rounded-b-lg border-0"
        >
          <div className="flex flex-col gap-4">
            <div
              className={`grid ${FILTER_CONSTANTS.TASTING_NOTES_GRID} ${FILTER_CONSTANTS.GRID_GAP}`}
            >
              {TASTING_NOTES.map(({ key, left, right, maxValue }) => (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-foreground/60">
                    <div className="flex items-center gap-2">
                      <Icon
                        name={left.icon}
                        width={20}
                        height={20}
                        className="flex-shrink-0"
                        variant="color"
                      />
                      <span>{t(`tasting.notes.${left.translationKey}`)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{t(`tasting.notes.${right.translationKey}`)}</span>
                      <Icon
                        name={right.icon}
                        width={20}
                        height={20}
                        className="flex-shrink-0"
                        variant="color"
                      />
                    </div>
                  </div>
                  <Slider
                    value={getTastingNoteRange(key)}
                    onValueChange={(value: [number, number]) => updateTastingNoteRange(key, value)}
                    min={0}
                    max={maxValue}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            {/* Reset button for tasting notes */}
            {(() => {
              const hasNonDefaultRanges = Object.entries(immediateTastingNotes).some(
                ([key, range]) => {
                  const defaultRange =
                    DEFAULT_TASTING_NOTES[key as keyof typeof DEFAULT_TASTING_NOTES]
                  return range[0] !== defaultRange[0] || range[1] !== defaultRange[1]
                },
              )

              return hasNonDefaultRanges ? (
                <div className="flex justify-center pt-2">
                  <ResetFilterButton onReset={resetTastingNotesFilter} />
                </div>
              ) : null
            })()}
          </div>
        </Accordion>
      </div>
    </div>
  )
}
