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
import { FILTER_CONSTANTS, FILTER_COLLECTIONS, TASTING_NOTES } from '@/constants/filters'
import { useWineStore } from '@/store/wineStore'

interface WineFiltersClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collectionItems: Record<string, any[]>
  currentCollection?: {
    id: string
    type: string
  }
  locale: Locale
}

export default function WineFiltersClient({
  collectionItems,
  currentCollection,
  locale,
}: WineFiltersClientProps): React.JSX.Element {
  const { t } = useTranslation()
  const { filters, setFilter, clearFilter, isFilterActive, hasActiveFilters } = useWineStore()

  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({})
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const toggleFilter = (key: string, value: string): void => {
    const currentValues = filters[key as keyof typeof filters] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    setFilter(key as keyof typeof filters, newValues)
  }

  const updateTastingNoteRange = (key: string, value: [number, number]): void => {
    // TODO: Implement tasting notes filtering
    // For now, this is disabled as the flat collection stores tastingProfile as a string
    console.log('Tasting note range update:', { key, value })
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
    return filters[key as keyof typeof filters] || []
  }

  const getTastingNoteRange = (key: string): [number, number] => {
    // TODO: Implement tasting notes range
    const tastingNote = TASTING_NOTES.find((note) => note.key === key)
    const maxValue = tastingNote?.maxValue || 10
    return [0, maxValue] as [number, number]
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
                      <Input
                        placeholder={t('filters.search')}
                        value={searchQueries[collection] || ''}
                        onChange={(e) => handleSearchChange(collection, e.target.value)}
                        className="mb-2"
                      />
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
          title={t('filters.tastingNotes')}
          isOpen={openAccordion === 'tastingNotes'}
          onToggle={() => toggleAccordion('tastingNotes')}
          icon="tastings"
          className="rounded-b-lg border-0"
        >
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
        </Accordion>
      </div>
    </div>
  )
}
