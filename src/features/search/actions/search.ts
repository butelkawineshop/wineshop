'use server'

import { search as typesenseSearch } from '@/typesense'
import type { SearchResult, WineVariantSearchResult, GeneralSearchResult } from '../types'
import { SEARCH_CONSTANTS } from '@/constants/search'
import { logger } from '@/lib/logger'

// Simple in-memory cache for search results
const searchCache = new Map<string, { results: SearchResult[]; timestamp: number }>()

// Typesense search result interface
interface TypesenseResult {
  id: string | number
  text_match?: number
  [key: string]: unknown
}

export async function search(query: string, locale: 'sl' | 'en' = 'sl'): Promise<SearchResult[]> {
  if (!query || query.length < SEARCH_CONSTANTS.SEARCH.MIN_QUERY_LENGTH) {
    return []
  }

  // Check cache first
  const cacheKey = `${query}:${locale}`
  const cached = searchCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < SEARCH_CONSTANTS.CACHE.TTL_MS) {
    return cached.results
  }

  try {
    const results: SearchResult[] = []

    // Search only the most important collections for popup performance
    // Prioritize wines, wineries, and regions as these are most commonly searched
    const [wineVariantsResults, wineriesResults, regionsResults] = await Promise.all([
      searchWineVariants(query, locale),
      searchCollection(
        query,
        locale,
        SEARCH_CONSTANTS.COLLECTIONS.WINERIES,
        SEARCH_CONSTANTS.RESULT_TYPES.WINERY,
        SEARCH_CONSTANTS.PAGE_SIZES.WINERIES,
      ),
      searchCollection(
        query,
        locale,
        SEARCH_CONSTANTS.COLLECTIONS.REGIONS,
        SEARCH_CONSTANTS.RESULT_TYPES.REGION,
        SEARCH_CONSTANTS.PAGE_SIZES.REGIONS,
      ),
    ])

    results.push(...wineVariantsResults, ...wineriesResults, ...regionsResults)

    // Only search additional collections if we have few results
    if (results.length < SEARCH_CONSTANTS.SEARCH.RESULTS_THRESHOLD) {
      const [wineCountriesResults, grapeVarietiesResults, tagsResults] = await Promise.all([
        searchCollection(
          query,
          locale,
          SEARCH_CONSTANTS.COLLECTIONS.WINE_COUNTRIES,
          SEARCH_CONSTANTS.RESULT_TYPES.WINE_COUNTRY,
          SEARCH_CONSTANTS.PAGE_SIZES.WINE_COUNTRIES,
        ),
        searchCollection(
          query,
          locale,
          SEARCH_CONSTANTS.COLLECTIONS.GRAPE_VARIETIES,
          SEARCH_CONSTANTS.RESULT_TYPES.GRAPE_VARIETY,
          SEARCH_CONSTANTS.PAGE_SIZES.GRAPE_VARIETIES,
        ),
        searchCollection(
          query,
          locale,
          SEARCH_CONSTANTS.COLLECTIONS.TAGS,
          SEARCH_CONSTANTS.RESULT_TYPES.TAG,
          SEARCH_CONSTANTS.PAGE_SIZES.TAGS,
        ),
      ])

      results.push(...wineCountriesResults, ...grapeVarietiesResults, ...tagsResults)
    }

    // Sort results by relevance
    const sortedResults = sortSearchResults(results, query)

    // Cache the results
    searchCache.set(cacheKey, { results: sortedResults, timestamp: Date.now() })

    return sortedResults
  } catch (error) {
    logger.error({ err: error, query }, 'Search failed')
    return []
  }
}

async function searchWineVariants(
  query: string,
  locale: 'sl' | 'en',
): Promise<WineVariantSearchResult[]> {
  const searchFields = Array.from(
    SEARCH_CONSTANTS.SEARCH_FIELDS[locale === 'sl' ? 'SL' : 'EN'].WINE_VARIANTS,
  )

  const searchParameters = {
    q: query,
    query_by: searchFields.join(','),
    filter_by: 'isPublished:=true',
    sort_by: SEARCH_CONSTANTS.SORT.WINE_VARIANTS,
    per_page: SEARCH_CONSTANTS.PAGE_SIZES.WINE_VARIANTS,
    num_typos: SEARCH_CONSTANTS.SEARCH.DEFAULT_NUM_TYPOS,
    prefix: SEARCH_CONSTANTS.SEARCH.DEFAULT_PREFIX,
  }

  try {
    const wineVariants = await typesenseSearch.search<TypesenseResult>(
      SEARCH_CONSTANTS.COLLECTIONS.WINE_VARIANTS,
      searchParameters,
    )

    return wineVariants.map(
      (variant): WineVariantSearchResult => ({
        id: String(variant.id),
        title: (variant.wineTitle as string) || '',
        titleEn: (variant.wineTitle as string) || '',
        slug: (variant.slug as string) || '',
        slugEn: (variant.slug as string) || '',
        media: variant.primaryImageUrl ? { url: variant.primaryImageUrl as string } : undefined,
        description:
          locale === 'sl' ? (variant.description as string) : (variant.descriptionEn as string),
        descriptionEn: variant.descriptionEn as string,
        type: SEARCH_CONSTANTS.RESULT_TYPES.WINE_VARIANT,
        vintage: variant.vintage as string,
        size: variant.size as string,
        price: variant.price as number,
        wineryTitle: variant.wineryTitle as string,
        regionTitle: variant.regionTitle as string,
        countryTitle:
          locale === 'sl' ? (variant.countryTitle as string) : (variant.countryTitleEn as string),
        styleTitle:
          locale === 'sl' ? (variant.styleTitle as string) : (variant.styleTitleEn as string),
        searchScore: variant.text_match,
        matchedFields: getMatchedFields(variant, searchFields, query),
      }),
    )
  } catch (error) {
    logger.warn(
      { err: error, collection: SEARCH_CONSTANTS.COLLECTIONS.WINE_VARIANTS },
      'Wine variants search failed',
    )
    return []
  }
}

async function searchCollection(
  query: string,
  locale: 'sl' | 'en',
  collection: string,
  resultType: string,
  pageSize: number,
): Promise<GeneralSearchResult[]> {
  const searchFields = Array.from(
    SEARCH_CONSTANTS.SEARCH_FIELDS[locale === 'sl' ? 'SL' : 'EN'].GENERAL,
  )

  const searchParameters = {
    q: query,
    query_by: searchFields.join(','),
    sort_by: SEARCH_CONSTANTS.SORT.GENERAL,
    per_page: pageSize,
    num_typos: SEARCH_CONSTANTS.SEARCH.DEFAULT_NUM_TYPOS,
    prefix: SEARCH_CONSTANTS.SEARCH.DEFAULT_PREFIX,
  }

  try {
    const results = await typesenseSearch.search<TypesenseResult>(collection, searchParameters)

    return results.map(
      (item): GeneralSearchResult => ({
        id: String(item.id),
        title:
          locale === 'sl'
            ? (item.title as string)
            : (item.titleEn as string) || (item.title as string),
        titleEn: (item.titleEn as string) || (item.title as string),
        slug: (item.slug as string) || '',
        slugEn: (item.slug as string) || '',
        description:
          locale === 'sl' ? (item.description as string) : (item.descriptionEn as string),
        descriptionEn: item.descriptionEn as string,
        type: resultType as GeneralSearchResult['type'],
        searchScore: item.text_match,
        matchedFields: getMatchedFields(item, searchFields, query),
      }),
    )
  } catch (error) {
    logger.warn({ err: error, collection }, `${collection} search failed`)
    return []
  }
}

function getMatchedFields(doc: TypesenseResult, searchFields: string[], query: string): string[] {
  // This is a simplified implementation - Typesense doesn't directly provide matched fields
  // In a real implementation, you might need to analyze the search results differently
  return searchFields.filter((field) => {
    // Simple field access without complex reduce
    const fieldValue = (doc as Record<string, unknown>)[field]
    return (
      fieldValue &&
      typeof fieldValue === 'string' &&
      fieldValue.toLowerCase().includes(query.toLowerCase())
    )
  })
}

function sortSearchResults(results: SearchResult[], query: string): SearchResult[] {
  return results.sort((a, b) => {
    // Priority by type (wine variants first)
    const aPriority =
      SEARCH_CONSTANTS.TYPE_PRIORITY[a.type as keyof typeof SEARCH_CONSTANTS.TYPE_PRIORITY] || 999
    const bPriority =
      SEARCH_CONSTANTS.TYPE_PRIORITY[b.type as keyof typeof SEARCH_CONSTANTS.TYPE_PRIORITY] || 999

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    // Then by search score
    const aScore = a.searchScore || 0
    const bScore = b.searchScore || 0

    if (aScore !== bScore) {
      return bScore - aScore
    }

    // Finally by title relevance
    const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase())
    const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase())

    if (aTitleMatch && !bTitleMatch) return -1
    if (!aTitleMatch && bTitleMatch) return 1

    return 0
  })
}
