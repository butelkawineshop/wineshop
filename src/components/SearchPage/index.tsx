'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { search } from '@/features/search/actions'
import type { SearchResult } from '@/features/search/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { SEARCH_CONSTANTS } from '@/constants/search'
import { Icon } from '@/components/Icon'
import { CollectionLink } from '@/components/ui/CollectionLink'
import Image from 'next/image'

type SearchPageProps = {
  locale: 'sl' | 'en'
  basePath: string
}

const SearchPage: React.FC<SearchPageProps> = ({ locale, basePath }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const debouncedQuery = useDebounce(searchQuery, SEARCH_CONSTANTS.DEBOUNCE_DELAY)

  const lastResultRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isLoadingMore) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoading, isLoadingMore, hasMore],
  )

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery) {
        setResults([])
        setPage(1)
        setHasMore(true)
        return
      }

      if (page === 1) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      try {
        const docs = await search(debouncedQuery, locale)
        const startIndex = (page - 1) * SEARCH_CONSTANTS.MAX_RESULTS_PER_PAGE
        const endIndex = page * SEARCH_CONSTANTS.MAX_RESULTS_PER_PAGE
        const newResults = docs.slice(startIndex, endIndex)

        if (page === 1) {
          setResults(newResults)
        } else {
          setResults((prev) => [...prev, ...newResults])
        }

        setHasMore(endIndex < docs.length)
        router.push(`${basePath}?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false })
      } catch (error) {
        console.error('Search failed:', error)
        if (page === 1) {
          setResults([])
        }
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }

    performSearch()
  }, [debouncedQuery, router, basePath, page, locale])

  // Reset page when search query changes
  useEffect(() => {
    setPage(1)
    setHasMore(true)
  }, [debouncedQuery])

  const getCategoryName = (type: SearchResult['type']) => {
    const typeToName: Record<SearchResult['type'], string> = {
      wineVariant: locale === 'sl' ? 'vino' : 'wine',
      winery: locale === 'sl' ? 'vinogradništvo' : 'wineries',
      region: locale === 'sl' ? 'regija' : 'region',
      wineCountry: locale === 'sl' ? 'država' : 'country',
      grapeVariety: locale === 'sl' ? 'sorta grozdja' : 'grape variety',
      aroma: locale === 'sl' ? 'aroma' : 'aroma',
      climate: locale === 'sl' ? 'podnebje' : 'climate',
      food: locale === 'sl' ? 'hrana' : 'food',
      mood: locale === 'sl' ? 'razpoloženje' : 'mood',
      tag: locale === 'sl' ? 'oznaka' : 'tag',
    }

    return typeToName[type] || ''
  }

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

  const getCollectionForType = (type: SearchResult['type']) => {
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

    return collectionMap[type]
  }

  const SearchImage = ({ src, alt }: { src: string; alt: string }) => {
    const [error, setError] = useState(false)

    if (error) {
      return (
        <div className="w-full h-full bg-muted rounded flex items-center justify-center">
          <Icon name="image" width={48} height={48} className="text-muted-foreground" />
        </div>
      )
    }

    return (
      <Image
        src={src}
        alt={alt || 'Search result image'}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-accent mb-8">{locale === 'sl' ? 'Iskanje' : 'Search'}</h1>

      {/* Search input */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'sl'
                ? 'Išči vino, vinogradništvo, regijo...'
                : 'Search wine, winery, region...'
            }
            className="w-full px-4 py-2 pl-10 text-lg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
          <Icon
            name="search"
            width={24}
            height={24}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          {locale === 'sl' ? 'Iskanje...' : 'Searching...'}
        </div>
      ) : results.length > 0 ? (
        <div
          className={`grid ${SEARCH_CONSTANTS.UI.GRID_BREAKPOINTS.MOBILE} ${SEARCH_CONSTANTS.UI.GRID_BREAKPOINTS.TABLET} ${SEARCH_CONSTANTS.UI.GRID_BREAKPOINTS.DESKTOP} ${SEARCH_CONSTANTS.UI.GRID_BREAKPOINTS.WIDE} gap-6`}
        >
          {results.map((result, index) => {
            const imageUrl =
              result.media?.media &&
              typeof result.media.media === 'object' &&
              'url' in result.media.media
                ? result.media.media.url
                : undefined

            const isLastResult = index === results.length - 1
            const collection = getCollectionForType(result.type)
            const slug = locale === 'sl' ? result.slug : result.slugEn || result.slug

            return (
              <div
                key={`${result.type}-${result.id}`}
                ref={isLastResult ? lastResultRef : undefined}
                className="group relative aspect-square border border-border overflow-hidden rounded-lg bg-background"
              >
                <CollectionLink
                  collection={collection}
                  slug={slug}
                  locale={locale}
                  className="block h-full"
                >
                  {imageUrl && (
                    <div className="absolute inset-0">
                      <SearchImage src={imageUrl} alt={result.title || ''} />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent" />
                    </div>
                  )}
                  <div className="absolute inset-0 p-4 flex flex-col justify-center items-center text-shadow-lg">
                    <span
                      className={`text-xs font-medium ${imageUrl ? 'text-white/80' : 'text-foreground'} capitalize mb-1`}
                    >
                      {getCategoryName(result.type)}
                    </span>
                    <h3
                      className={`text-sm font-medium text-center ${imageUrl ? 'text-white' : 'text-foreground'} line-clamp-2`}
                    >
                      {getWineVariantTitle(result)}
                    </h3>
                    {result.description && (
                      <p
                        className={`text-xs ${imageUrl ? 'text-white/80' : 'text-foreground'} line-clamp-2 mt-1`}
                      >
                        {result.description}
                      </p>
                    )}
                    {result.price && (
                      <p
                        className={`text-sm font-medium ${imageUrl ? 'text-white' : 'text-primary'} mt-2`}
                      >
                        €{result.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </CollectionLink>
              </div>
            )
          })}
          {/* Observer element for infinite scroll */}
          {hasMore && <div ref={lastResultRef} className="h-4" />}
        </div>
      ) : searchQuery ? (
        <div className="text-center text-muted-foreground">
          {locale === 'sl' ? 'Ni rezultatov' : 'No results found'}
        </div>
      ) : null}

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="text-center py-8 text-muted-foreground">
          {locale === 'sl' ? 'Nalaganje več rezultatov...' : 'Loading more results...'}
        </div>
      )}
    </div>
  )
}

export default SearchPage
