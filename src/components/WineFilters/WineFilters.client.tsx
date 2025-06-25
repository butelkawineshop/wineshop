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
import {
  FILTER_CONSTANTS,
  FILTER_COLLECTIONS,
  TASTING_NOTES,
  DEFAULT_TASTING_NOTES,
  DEFAULT_PRICE_RANGE,
} from '@/constants/filters'
import { useWineStore } from '@/store/wineStore'
import { ResetFilterButton } from './ResetFilterButton'

interface WineFiltersClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collectionItems: Record<string, any[]>
  currentCollection?: {
    id: string
    type: string
  }
  locale: Locale
}

// Helper function to check if a filter key is an array filter
const isArrayFilter = (key: string): boolean => {
  return [
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
  ].includes(key)
}

export default function WineFiltersClient({
  collectionItems,
  currentCollection,
  locale,
}: WineFiltersClientProps): React.JSX.Element {
  const { t } = useTranslation()
  const { filters, setFilter, clearFilter, _migrateFilters } = useWineStore()

  // Migrate filters if needed (for persisted data)
  React.useEffect(() => {
    _migrateFilters()
  }, [_migrateFilters])

  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({})
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

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

    const currentValues = filters[key as keyof typeof filters] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    setFilter(key as keyof typeof filters, newValues)
  }

  const updateTastingNoteRange = (key: string, value: [number, number]): void => {
    const currentTastingNotes = { ...(filters.tastingNotes || {}) }
    currentTastingNotes[key as keyof typeof currentTastingNotes] = value
    setFilter('tastingNotes', currentTastingNotes)
  }

  const updatePriceRange = (value: [number, number]): void => {
    setFilter('priceRange', value)
  }

  const resetCollectionFilter = (key: string): void => {
    clearFilter(key as keyof typeof filters)
  }

  const resetPriceFilter = (): void => {
    setFilter('priceRange', DEFAULT_PRICE_RANGE)
  }

  const resetTastingNotesFilter = (): void => {
    setFilter('tastingNotes', DEFAULT_TASTING_NOTES)
  }

  const handleSearchChange = (collection: string, value: string): void => {
    setSearchQueries((prev) => ({
      ...prev,
      [collection]: value,
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFilteredItems = (collection: string): any[] => {
    const items = collectionItems[collection] || []
    const searchQuery = searchQueries[collection] || ''

    if (!searchQuery) return items

    return items.filter((item) => {
      const title =
        typeof item.title === 'object'
          ? locale === 'en' && item.title.en
            ? item.title.en
            : item.title.sl || item.title.en
          : item.title || ''
      const titleEn =
        typeof item.titleEn === 'object'
          ? item.titleEn.en || item.titleEn.sl || ''
          : item.titleEn || ''
      const query = searchQuery.toLowerCase()
      return title.toLowerCase().includes(query) || titleEn.toLowerCase().includes(query)
    })
  }

  const toggleAccordion = (key: string): void => {
    setOpenAccordion((prev) => (prev === key ? null : key))
  }

  const getActiveFilters = (key: string): string[] => {
    if (!isArrayFilter(key)) return []
    return filters[key as keyof typeof filters] as string[]
  }

  const getTastingNoteRange = (key: string): [number, number] => {
    const tastingNotes = filters.tastingNotes || {}
    return (
      tastingNotes[key as keyof typeof tastingNotes] ||
      DEFAULT_TASTING_NOTES[key as keyof typeof DEFAULT_TASTING_NOTES]
    )
  }

  const getPriceRange = (): [number, number] => {
    return filters.priceRange || DEFAULT_PRICE_RANGE
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
                          // Get the appropriate value based on filter type
                          const getFilterValue = (filterKey: string) => {
                            // String-based filters use titles
                            if (
                              ['regions', 'wineries', 'wineCountries', 'styles'].includes(filterKey)
                            ) {
                              return typeof item.title === 'object'
                                ? locale === 'en' && item.title.en
                                  ? item.title.en
                                  : item.title.sl || item.title.en
                                : item.title || ''
                            }
                            // Array-based filters use IDs
                            return item.id
                          }

                          const filterValue = getFilterValue(key)
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
                                {typeof item.title === 'object'
                                  ? locale === 'en' && item.title.en
                                    ? item.title.en
                                    : item.title.sl || item.title.en
                                  : item.title}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between text-sm flex-1">
                <span>€{getPriceRange()[0]}</span>
                <span>€{getPriceRange()[1]}</span>
              </div>
              {getPriceRange()[0] !== DEFAULT_PRICE_RANGE[0] ||
              getPriceRange()[1] !== DEFAULT_PRICE_RANGE[1] ? (
                <ResetFilterButton onReset={resetPriceFilter} className="ml-2" />
              ) : null}
            </div>
            <Slider
              value={getPriceRange()}
              onValueChange={updatePriceRange}
              min={0}
              max={1000}
              step={10}
              className="w-full"
            />
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
              const hasNonDefaultRanges = Object.entries(filters.tastingNotes || {}).some(
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
