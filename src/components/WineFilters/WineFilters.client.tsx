'use client'

import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
import { logger } from '@/lib/logger'

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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({})
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const updateURL = (updates: Record<string, string | null>): void => {
    try {
      const params = new URLSearchParams(searchParams)

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      // Reset to page 1 when filters change
      params.delete('page')

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    } catch (error) {
      logger.error('Failed to update URL with filter changes', { error, updates })
    }
  }

  const toggleFilter = (key: string, value: string): void => {
    try {
      const currentValues = searchParams.get(key)?.split(',').filter(Boolean) || []

      // For title fields, we need to get the title from the collection item
      const titleFields = ['regions', 'wineries', 'wineCountries']
      const isTitleField = titleFields.includes(key)

      // Find the collection name from the key
      const filterCollection = FILTER_COLLECTIONS.find((fc) => fc.key === key)
      const collectionName = filterCollection?.collection || key

      let filterValue = value
      if (isTitleField) {
        // Find the item and get its title
        const item = collectionItems[collectionName]?.find((item) => item.id === value)
        if (item) {
          const title =
            typeof item.title === 'object'
              ? locale === 'en' && item.title.en
                ? item.title.en
                : item.title.sl || item.title.en
              : item.title
          filterValue = title
        }
      }

      const newValues = currentValues.includes(filterValue)
        ? currentValues.filter((v) => v !== filterValue)
        : [...currentValues, filterValue]

      updateURL({
        [key]: newValues.length > 0 ? newValues.join(',') : null,
      })
    } catch (error) {
      logger.error('Failed to toggle filter', { error, key, value })
    }
  }

  const updateTastingNoteRange = (key: string, value: [number, number]): void => {
    try {
      const [min, max] = value
      const updates: Record<string, string | null> = {}
      const tastingNote = TASTING_NOTES.find((note) => note.key === key)
      const maxValue = tastingNote?.maxValue || 10

      if (min > 0) {
        updates[`${key}Min`] = min.toString()
      } else {
        updates[`${key}Min`] = null
      }

      if (max < maxValue) {
        updates[`${key}Max`] = max.toString()
      } else {
        updates[`${key}Max`] = null
      }

      updateURL(updates)
    } catch (error) {
      logger.error('Failed to update tasting note range', { error, key, value })
    }
  }

  const handleSearchChange = (collection: string, value: string): void => {
    setSearchQueries((prev) => ({
      ...prev,
      [collection]: value,
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFilteredItems = (collection: string): any[] => {
    try {
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
    } catch (error) {
      logger.error('Failed to filter items', { error, collection })
      return []
    }
  }

  const toggleAccordion = (key: string): void => {
    setOpenAccordion((prev) => (prev === key ? null : key))
  }

  const getActiveFilters = (key: string): string[] => {
    try {
      const values = searchParams.get(key)?.split(',').filter(Boolean) || []

      // For title fields, we need to check if the stored titles match the item titles
      const titleFields = ['regions', 'wineries', 'wineCountries']
      const isTitleField = titleFields.includes(key)

      if (isTitleField) {
        // Find the collection name from the key
        const filterCollection = FILTER_COLLECTIONS.find((fc) => fc.key === key)
        const collectionName = filterCollection?.collection || key

        // Return IDs of items whose titles match the stored values
        return (
          collectionItems[collectionName]
            ?.filter((item) => {
              const itemTitle =
                typeof item.title === 'object'
                  ? locale === 'en' && item.title.en
                    ? item.title.en
                    : item.title.sl || item.title.en
                  : item.title
              return values.includes(itemTitle)
            })
            .map((item) => item.id) || []
        )
      }

      return values
    } catch (error) {
      logger.error('Failed to get active filters', { error, key })
      return []
    }
  }

  const getTastingNoteRange = (key: string): [number, number] => {
    try {
      const min = searchParams.get(`${key}Min`)
      const max = searchParams.get(`${key}Max`)
      const tastingNote = TASTING_NOTES.find((note) => note.key === key)
      const maxValue = tastingNote?.maxValue || 10

      return [min ? Number(min) : 0, max ? Number(max) : maxValue] as [number, number]
    } catch (error) {
      logger.error('Failed to get tasting note range', { error, key })
      return [0, 10]
    }
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
                          const isSelected = activeFilters.includes(item.id)
                          const isLocked = isCurrentCollection && item.id === currentCollection.id

                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                            >
                              <Checkbox
                                id={`${key}-${item.id}`}
                                checked={isSelected}
                                onChange={() => !isLocked && toggleFilter(key, item.id)}
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
