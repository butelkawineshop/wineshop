'use client'

import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { IconColor } from '@/components/IconColor'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion } from '@/components/Accordion'
import type { Locale } from '@/i18n/locales'
import { useTranslation } from '@/hooks/useTranslation'
import { FILTER_CONSTANTS } from '@/constants/filters'
import { logger } from '@/lib/logger'

type FilterCollection = {
  key: string
  icon: string
  translationKey: string
  collection: string
}

const FILTER_COLLECTIONS: FilterCollection[] = [
  { key: 'aromas', icon: 'aroma', translationKey: 'filters.aromas', collection: 'aromas' },
  { key: 'climates', icon: 'climate', translationKey: 'filters.climates', collection: 'climates' },
  { key: 'dishes', icon: 'pairing', translationKey: 'filters.foods', collection: 'dishes' },
  {
    key: 'grape-varieties',
    icon: 'grape',
    translationKey: 'filters.grapeVarieties',
    collection: 'grape-varieties',
  },
  { key: 'moods', icon: 'mood', translationKey: 'filters.moods', collection: 'moods' },
  { key: 'regions', icon: 'region', translationKey: 'filters.regions', collection: 'regions' },
  { key: 'styles', icon: 'style', translationKey: 'filters.styles', collection: 'styles' },
  { key: 'tags', icon: 'tags', translationKey: 'filters.tags', collection: 'tags' },
  {
    key: 'wineCountries',
    icon: 'country',
    translationKey: 'filters.countries',
    collection: 'wineCountries',
  },
  { key: 'wineries', icon: 'winery', translationKey: 'filters.wineries', collection: 'wineries' },
]

type TastingNote = {
  key: string
  left: {
    icon: string
    translationKey: string
  }
  right: {
    icon: string
    translationKey: string
  }
  maxValue: number
}

const TASTING_NOTES: TastingNote[] = [
  {
    key: 'dry',
    left: { icon: 'dry', translationKey: 'dry' },
    right: { icon: 'sweetness', translationKey: 'sweet' },
    maxValue: 10,
  },
  {
    key: 'light',
    left: { icon: 'skinny', translationKey: 'light' },
    right: { icon: 'fat', translationKey: 'rich' },
    maxValue: 10,
  },
  {
    key: 'smooth',
    left: { icon: 'soft', translationKey: 'smooth' },
    right: { icon: 'sharp', translationKey: 'austere' },
    maxValue: 10,
  },
  {
    key: 'creamy',
    left: { icon: 'crisp', translationKey: 'crisp' },
    right: { icon: 'cream', translationKey: 'creamy' },
    maxValue: 10,
  },
  {
    key: 'alcohol',
    left: { icon: 'water', translationKey: 'noAlcohol' },
    right: { icon: 'alcohol', translationKey: 'highAlcohol' },
    maxValue: 20,
  },
  {
    key: 'ripe',
    left: { icon: 'fruit', translationKey: 'freshFruit' },
    right: { icon: 'jam', translationKey: 'ripeFruit' },
    maxValue: 10,
  },
  {
    key: 'oaky',
    left: { icon: 'steel', translationKey: 'noOak' },
    right: { icon: 'oak', translationKey: 'oaky' },
    maxValue: 10,
  },
  {
    key: 'complex',
    left: { icon: 'simple', translationKey: 'simple' },
    right: { icon: 'complex', translationKey: 'complex' },
    maxValue: 10,
  },
  {
    key: 'youthful',
    left: { icon: 'baby', translationKey: 'youthful' },
    right: { icon: 'old', translationKey: 'mature' },
    maxValue: 10,
  },
  {
    key: 'energetic',
    left: { icon: 'calm', translationKey: 'restrained' },
    right: { icon: 'energy', translationKey: 'energetic' },
    maxValue: 10,
  },
]

interface WineFiltersClientProps {
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
                      <IconColor name={icon} className="w-5 h-5" theme="color" />
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
                                <IconColor
                                  name="lock"
                                  className="w-4 h-4 text-muted-foreground"
                                  theme="color"
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
                    <IconColor
                      name={left.icon}
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                      theme="color"
                    />
                    <span>{t(`tasting.notes.${left.translationKey}`)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{t(`tasting.notes.${right.translationKey}`)}</span>
                    <IconColor
                      name={right.icon}
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                      theme="color"
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
