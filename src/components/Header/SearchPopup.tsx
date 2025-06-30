'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '@/components/Icon'
import { useDebounce } from '@/hooks/useDebounce'
import { CollectionLink } from '@/components/ui/CollectionLink'
import type { SearchResult } from '@/features/search/types'
import { isWineVariantResult } from '@/features/search/types'
import { search } from '@/features/search/actions'
import { SEARCH_CONSTANTS } from '@/constants/search'
import Image from 'next/image'
import { ROUTE_MAPPINGS } from '@/constants/routes'
import { usePathname } from 'next/navigation'
import { detectLocaleFromPath } from '@/utils/routeUtils'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'

type SearchPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const SearchImage = ({ src, alt }: { src: string; alt: string }) => {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
        <Icon name="image" width={24} height={24} className="text-gray-400" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt || 'Search result image'}
      width={48}
      height={48}
      className="w-12 h-12 object-cover rounded"
      onError={() => setError(true)}
    />
  )
}

export const SearchPopup: React.FC<SearchPopupProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(searchQuery, SEARCH_CONSTANTS.DEBOUNCE_DELAY)
  const pathname = usePathname()
  const locale = detectLocaleFromPath(pathname)
  const { t } = useTranslation()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.length < SEARCH_CONSTANTS.SEARCH.MIN_QUERY_LENGTH) {
        setResults([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const docs = await search(debouncedQuery, locale)
        setResults(docs.slice(0, SEARCH_CONSTANTS.MAX_POPUP_RESULTS))
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, locale])

  const getCategoryName = (type: SearchResult['type']) => {
    const typeToCollection: Record<SearchResult['type'], string> = {
      aroma: 'aromas',
      climate: 'climates',
      food: 'foods',
      grapeVariety: 'grape-varieties',
      mood: 'moods',
      region: 'regions',
      tag: 'tags',
      wineCountry: 'wineCountries',
      winery: 'wineries',
      wineVariant: 'flat-wine-variants',
    }

    const collection = typeToCollection[type]
    if (type === 'wineCountry' && locale === 'sl') {
      return 'države'
    }
    const mapping = Object.entries(ROUTE_MAPPINGS).find(([, m]) => m.collection === collection)?.[1]
    if (!mapping) return ''
    return mapping[locale]
  }

  const renderResult = (result: SearchResult) => {
    const collectionMap: Record<SearchResult['type'], string> = {
      aroma: 'aromas',
      climate: 'climates',
      food: 'foods',
      grapeVariety: 'grape-varieties',
      mood: 'moods',
      region: 'regions',
      tag: 'tags',
      wineCountry: 'wineCountries',
      winery: 'wineries',
      wineVariant: 'flat-wine-variants',
    }

    const collection = collectionMap[result.type]

    const getWineVariantTitle = (result: SearchResult) => {
      if (result.type !== 'wineVariant') return result.title

      const parts = [
        result.wineryTitle,
        result.title,
        result.regionTitle,
        result.countryTitle,
        result.vintage,
        result.size,
      ].filter(Boolean)

      return parts.join(', ')
    }

    return (
      <div key={`${result.type}-${result.id}`} className="space-y-2">
        {/* Main result */}
        <div className="flex items-center gap-4 p-2 hover:bg-blue-400 w-fit ml-auto rounded-xl transition-colors bg-blue-300">
          <CollectionLink
            collection={collection}
            slug={result.slug}
            locale={locale}
            className="flex items-center gap-4"
          >
            {result.media?.url && (
              <SearchImage src={result.media.url} alt={result.media.alt || result.title || ''} />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm text-black">{getWineVariantTitle(result)}</h3>
              </div>
              {result.description && <p className="text-sm text-black">{result.description}</p>}
              {isWineVariantResult(result) && result.price && (
                <p className="text-sm text-black">€{result.price.toFixed(2)}</p>
              )}
            </div>
          </CollectionLink>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-2xl px-8 pt-40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Speech bubble */}
            <div className="relative bg-white text-black rounded-3xl p-6 shadow-xl">
              {/* Speech bubble tail pointing up */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[20px] border-l-transparent border-r-transparent border-b-white" />

              <div className="flex flex-col gap-4 max-h-[350px] sm:max-h-[500px] overflow-y-auto">
                {/* Question message */}
                <div className="flex flex-row items-center justify-between">
                  <div className="font-accent text-2xl w-full">{t('header.search.title')}</div>
                  <button
                    onClick={onClose}
                    className="p-2 icon-container rounded-full transition-colors"
                  >
                    <Icon name="close" width={24} height={24} />
                  </button>
                </div>

                {/* Messages and Results Container */}
                <div className="flex-1 overflow-y-auto space-y-2 px-2">
                  <div className="text-sm text-black bg-green-400 w-fit rounded-xl p-2 mb-2">
                    {t('header.search.whatAreYouLookingFor')}
                  </div>
                  {isLoading ? (
                    <div className="text-center py-4 text-black">{t('header.search.loading')}</div>
                  ) : results.length > 0 ? (
                    // Group results by category
                    Object.entries(
                      results.reduce(
                        (acc, result) => {
                          const categoryName = getCategoryName(result.type)
                          if (!acc[categoryName]) {
                            acc[categoryName] = []
                          }
                          acc[categoryName].push(result)
                          return acc
                        },
                        {} as Record<string, SearchResult[]>,
                      ),
                    ).map(([categoryName, categoryResults], categoryIndex) => (
                      <div key={categoryName} className="space-y-2 w-full flex flex-col">
                        {/* Response message - only once per category */}
                        <div className="text-sm text-black bg-green-400 w-fit rounded-xl p-2">
                          {categoryIndex === 0
                            ? t('header.search.didYouMeanCategory', { category: categoryName })
                            : t('header.search.orThisCategory', { category: categoryName })}
                        </div>

                        {/* Results for this category */}
                        {categoryResults.map((result) => renderResult(result))}
                      </div>
                    ))
                  ) : debouncedQuery &&
                    debouncedQuery.length >= SEARCH_CONSTANTS.SEARCH.MIN_QUERY_LENGTH ? (
                    <div className="text-sm text-black bg-green-400 w-fit rounded-xl p-2">
                      {t('header.search.noResults')}
                    </div>
                  ) : null}

                  {/* View all results link */}
                  {results.length > 0 && (
                    <div className="text-sm text-black bg-green-400 hover:bg-green-500 w-fit underline rounded-xl p-2">
                      <Link
                        href={`/${locale === 'en' ? 'en/' : ''}${ROUTE_MAPPINGS.search[locale]}?q=${encodeURIComponent(
                          debouncedQuery,
                        )}`}
                        className="text-black hover:text-black/80"
                      >
                        {t('header.search.viewAllResults')}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Search input - always at bottom */}
                <div className="flex items-center gap-4 border px-8 py-4 rounded-full border-border">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('header.search.searchPlaceholder')}
                    className="flex-1 text-lg outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
