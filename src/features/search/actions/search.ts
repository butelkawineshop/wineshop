'use server'

import { search as typesenseSearch } from '@/typesense'
import type { SearchResult } from '../types'
import { SEARCH_CONSTANTS } from '@/constants/search'
import { logger } from '@/lib/logger'

// Simple in-memory cache for search results
const searchCache = new Map<string, { results: SearchResult[]; timestamp: number }>()
const CACHE_TTL = 30000 // 30 seconds

export async function search(query: string, locale: 'sl' | 'en' = 'sl'): Promise<SearchResult[]> {
  if (!query || query.length < SEARCH_CONSTANTS.MIN_QUERY_LENGTH) {
    return []
  }

  // Check cache first
  const cacheKey = `${query}:${locale}`
  const cached = searchCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results
  }

  try {
    const results: SearchResult[] = []

    // Search only the most important collections for popup performance
    // Prioritize wines, wineries, and regions as these are most commonly searched
    const [wineVariantsResults, wineriesResults, regionsResults] = await Promise.all([
      searchWineVariants(query, locale),
      searchWineries(query, locale),
      searchRegions(query, locale),
    ])

    results.push(...wineVariantsResults, ...wineriesResults, ...regionsResults)

    // Only search additional collections if we have few results
    if (results.length < 5) {
      const [wineCountriesResults, grapeVarietiesResults, tagsResults] = await Promise.all([
        searchWineCountries(query, locale),
        searchGrapeVarieties(query, locale),
        searchTags(query, locale),
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

async function searchWineVariants(query: string, locale: 'sl' | 'en'): Promise<SearchResult[]> {
  const searchFields =
    locale === 'sl'
      ? [
          'wineTitle',
          'wineryTitle',
          'regionTitle',
          'countryTitle',
          'styleTitle',
          'tastingProfile',
          'description',
        ]
      : [
          'wineTitle',
          'wineryTitle',
          'regionTitle',
          'countryTitleEn',
          'styleTitleEn',
          'tastingProfile',
          'descriptionEn',
        ]

  const searchParameters = {
    q: query,
    query_by: searchFields.join(','),
    filter_by: 'isPublished:=true',
    sort_by: '_text_match:desc,price:asc',
    per_page: 4,
    num_typos: 2,
    prefix: true,
  }

  try {
    const wineVariants = await typesenseSearch.search<any>(
      SEARCH_CONSTANTS.COLLECTIONS.WINE_VARIANTS,
      searchParameters,
    )

    return wineVariants.map(
      (variant: any): SearchResult => ({
        id: String(variant.id),
        title: variant.wineTitle || '',
        titleEn: variant.wineTitle || '',
        slug: variant.slug || '',
        slugEn: variant.slug || '',
        media: variant.primaryImageUrl
          ? { media: { url: variant.primaryImageUrl } as any }
          : undefined,
        description: locale === 'sl' ? variant.description : variant.descriptionEn,
        descriptionEn: variant.descriptionEn,
        type: SEARCH_CONSTANTS.RESULT_TYPES.WINE_VARIANT,
        vintage: variant.vintage,
        size: variant.size,
        price: variant.price,
        wineryTitle: variant.wineryTitle,
        regionTitle: variant.regionTitle,
        countryTitle: locale === 'sl' ? variant.countryTitle : variant.countryTitleEn,
        styleTitle: locale === 'sl' ? variant.styleTitle : variant.styleTitleEn,
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

async function searchWineries(query: string, locale: 'sl' | 'en'): Promise<SearchResult[]> {
  const searchFields = locale === 'sl' ? ['title', 'description'] : ['titleEn', 'descriptionEn']

  const searchParameters = {
    q: query,
    query_by: searchFields.join(','),
    sort_by: '_text_match:desc,title:asc',
    per_page: 3,
    num_typos: 2,
    prefix: true,
  }

  try {
    const wineries = await typesenseSearch.search<any>('wineries', searchParameters)

    return wineries.map(
      (winery: any): SearchResult => ({
        id: String(winery.id),
        title: locale === 'sl' ? winery.title : winery.titleEn || winery.title,
        titleEn: winery.titleEn || winery.title,
        slug: winery.slug || '',
        slugEn: winery.slug || '',
        description: locale === 'sl' ? winery.description : winery.descriptionEn,
        descriptionEn: winery.descriptionEn,
        type: SEARCH_CONSTANTS.RESULT_TYPES.WINERY,
        searchScore: winery.text_match,
        matchedFields: getMatchedFields(winery, searchFields, query),
      }),
    )
  } catch (error) {
    logger.warn({ err: error, collection: 'wineries' }, 'Wineries search failed')
    return []
  }
}

async function searchRegions(query: string, locale: 'sl' | 'en'): Promise<SearchResult[]> {
  const searchFields = locale === 'sl' ? ['title', 'description'] : ['titleEn', 'descriptionEn']

  const searchParameters = {
    q: query,
    query_by: searchFields.join(','),
    sort_by: '_text_match:desc,title:asc',
    per_page: 3,
    num_typos: 2,
    prefix: true,
  }

  try {
    const regions = await typesenseSearch.search<any>('regions', searchParameters)

    return regions.map(
      (region: any): SearchResult => ({
        id: String(region.id),
        title: locale === 'sl' ? region.title : region.titleEn || region.title,
        titleEn: region.titleEn || region.title,
        slug: region.slug || '',
        slugEn: region.slug || '',
        description: locale === 'sl' ? region.description : region.descriptionEn,
        descriptionEn: region.descriptionEn,
        type: SEARCH_CONSTANTS.RESULT_TYPES.REGION,
        searchScore: region.text_match,
        matchedFields: getMatchedFields(region, searchFields, query),
      }),
    )
  } catch (error) {
    logger.warn({ err: error, collection: 'regions' }, 'Regions search failed')
    return []
  }
}

async function searchWineCountries(query: string, locale: 'sl' | 'en'): Promise<SearchResult[]> {
  const searchFields = locale === 'sl' ? ['title', 'description'] : ['titleEn', 'descriptionEn']

  const searchParameters = {
    q: query,
    query_by: searchFields.join(','),
    sort_by: '_text_match:desc,title:asc',
    per_page: 3,
    num_typos: 2,
    prefix: true,
  }

  try {
    const countries = await typesenseSearch.search<any>('wineCountries', searchParameters)

    return countries.map(
      (country: any): SearchResult => ({
        id: String(country.id),
        title: locale === 'sl' ? country.title : country.titleEn || country.title,
        titleEn: country.titleEn || country.title,
        slug: country.slug || '',
        slugEn: country.slug || '',
        description: locale === 'sl' ? country.description : country.descriptionEn,
        descriptionEn: country.descriptionEn,
        type: SEARCH_CONSTANTS.RESULT_TYPES.WINE_COUNTRY,
        searchScore: country.text_match,
        matchedFields: getMatchedFields(country, searchFields, query),
      }),
    )
  } catch (error) {
    logger.warn({ err: error, collection: 'wineCountries' }, 'Wine countries search failed')
    return []
  }
}

async function searchGrapeVarieties(query: string, locale: 'sl' | 'en'): Promise<SearchResult[]> {
  const searchFields = locale === 'sl' ? ['title', 'description'] : ['titleEn', 'descriptionEn']

  const searchParameters = {
    q: query,
    query_by: searchFields.join(','),
    sort_by: '_text_match:desc,title:asc',
    per_page: 3,
    num_typos: 2,
    prefix: true,
  }

  try {
    const varieties = await typesenseSearch.search<any>('grape-varieties', searchParameters)

    return varieties.map(
      (variety: any): SearchResult => ({
        id: String(variety.id),
        title: locale === 'sl' ? variety.title : variety.titleEn || variety.title,
        titleEn: variety.titleEn || variety.title,
        slug: variety.slug || '',
        slugEn: variety.slug || '',
        description: locale === 'sl' ? variety.description : variety.descriptionEn,
        descriptionEn: variety.descriptionEn,
        type: SEARCH_CONSTANTS.RESULT_TYPES.GRAPE_VARIETY,
        searchScore: variety.text_match,
        matchedFields: getMatchedFields(variety, searchFields, query),
      }),
    )
  } catch (error) {
    logger.warn({ err: error, collection: 'grape-varieties' }, 'Grape varieties search failed')
    return []
  }
}

async function searchTags(query: string, locale: 'sl' | 'en'): Promise<SearchResult[]> {
  const searchFields = locale === 'sl' ? ['title', 'description'] : ['titleEn', 'descriptionEn']

  const searchParameters = {
    q: query,
    query_by: searchFields.join(','),
    sort_by: '_text_match:desc,title:asc',
    per_page: 3,
    num_typos: 2,
    prefix: true,
  }

  try {
    const tags = await typesenseSearch.search<any>('tags', searchParameters)

    return tags.map(
      (tag: any): SearchResult => ({
        id: String(tag.id),
        title: locale === 'sl' ? tag.title : tag.titleEn || tag.title,
        titleEn: tag.titleEn || tag.title,
        slug: tag.slug || '',
        slugEn: tag.slug || '',
        description: locale === 'sl' ? tag.description : tag.descriptionEn,
        descriptionEn: tag.descriptionEn,
        type: SEARCH_CONSTANTS.RESULT_TYPES.TAG,
        searchScore: tag.text_match,
        matchedFields: getMatchedFields(tag, searchFields, query),
      }),
    )
  } catch (error) {
    logger.warn({ err: error, collection: 'tags' }, 'Tags search failed')
    return []
  }
}

function getMatchedFields(doc: any, searchFields: string[], query: string): string[] {
  // This is a simplified implementation - Typesense doesn't directly provide matched fields
  // In a real implementation, you might need to analyze the search results differently
  return searchFields.filter((field) => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], doc)
    return value && typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())
  })
}

function sortSearchResults(results: SearchResult[], query: string): SearchResult[] {
  return results.sort((a, b) => {
    // Priority by type (wine variants first)
    const typePriority = {
      [SEARCH_CONSTANTS.RESULT_TYPES.WINE_VARIANT]: 1,
      [SEARCH_CONSTANTS.RESULT_TYPES.WINERY]: 2,
      [SEARCH_CONSTANTS.RESULT_TYPES.REGION]: 3,
      [SEARCH_CONSTANTS.RESULT_TYPES.WINE_COUNTRY]: 4,
      [SEARCH_CONSTANTS.RESULT_TYPES.GRAPE_VARIETY]: 5,
      [SEARCH_CONSTANTS.RESULT_TYPES.AROMA]: 6,
      [SEARCH_CONSTANTS.RESULT_TYPES.CLIMATE]: 7,
      [SEARCH_CONSTANTS.RESULT_TYPES.FOOD]: 8,
      [SEARCH_CONSTANTS.RESULT_TYPES.MOOD]: 9,
      [SEARCH_CONSTANTS.RESULT_TYPES.TAG]: 10,
    }

    const aPriority = typePriority[a.type] || 999
    const bPriority = typePriority[b.type] || 999

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
