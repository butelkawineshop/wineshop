import { useQuery, queryOptions } from '@tanstack/react-query'
import { graphqlRequest } from '@/lib/graphql-client'
import {
  GetFlatCollection,
  GetFlatCollections,
  GetFlatWineVariant,
  GetFlatWineVariants,
  GetWineGridVariants,
  GetWineVariant,
  GetWineVariants,
  GetRelatedWineVariants,
} from '@/generated/graphql'
import type {
  GetFlatCollectionQueryResult,
  GetFlatCollectionsQueryResult,
  GetFlatWineVariantQueryResult,
  GetFlatWineVariantsQueryResult,
  GetWineGridVariantsQueryResult,
  GetWineVariantQueryResult,
  GetWineVariantsQueryResult,
  GetRelatedWineVariantsQueryResult,
} from '@/generated/graphql'
import type { Locale } from '@/constants/routes'

// FlatCollection hooks
export function useFlatCollection(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['flatCollection', slug, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetFlatCollectionQueryResult>({
        query: GetFlatCollection,
        variables: { slug, locale },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(slug && locale),
  })
}

export function useFlatCollections(
  collectionType: string,
  locale: Locale,
  limit: number = 18,
  page: number = 1,
) {
  return useQuery({
    queryKey: ['flatCollections', collectionType, locale, limit, page],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetFlatCollectionsQueryResult>({
        query: GetFlatCollections,
        variables: {
          collectionType,
          locale,
          limit,
          page,
        },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(collectionType && locale),
  })
}

// FlatWineVariant hooks
export function useFlatWineVariant(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['flatWineVariant', slug, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetFlatWineVariantQueryResult>({
        query: GetFlatWineVariant,
        variables: { slug, locale },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(slug && locale),
  })
}

export function useFlatWineVariants(wineTitle: string, locale: Locale) {
  return useQuery({
    queryKey: ['flatWineVariants', wineTitle, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetFlatWineVariantsQueryResult>({
        query: GetFlatWineVariants,
        variables: { wineTitle, locale },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(wineTitle && locale),
  })
}

// WineVariant hooks (with isPublished filter)
export function useWineVariant(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['wineVariant', slug, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetWineVariantQueryResult>({
        query: GetWineVariant,
        variables: { slug, locale },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(slug && locale),
  })
}

export function useWineVariants(wineTitle: string, locale: Locale) {
  return useQuery({
    queryKey: ['wineVariants', wineTitle, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetWineVariantsQueryResult>({
        query: GetWineVariants,
        variables: { wineTitle, locale },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(wineTitle && locale),
  })
}

// RelatedWineVariants hook
export function useRelatedWineVariants(variantId: number, locale: Locale) {
  return useQuery({
    queryKey: ['relatedWineVariants', variantId, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetRelatedWineVariantsQueryResult>({
        query: GetRelatedWineVariants,
        variables: { variantId, locale },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(variantId && locale),
  })
}

// Query options for prefetching
export const flatCollectionOptions = (slug: string, locale: Locale) =>
  queryOptions({
    queryKey: ['flatCollection', slug, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetFlatCollectionQueryResult>({
        query: GetFlatCollection,
        variables: { slug, locale },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(slug && locale),
  })

export const flatCollectionsOptions = (
  collectionType: string,
  locale: Locale,
  limit: number = 18,
  page: number = 1,
) =>
  queryOptions({
    queryKey: ['flatCollections', collectionType, locale, limit, page],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetFlatCollectionsQueryResult>({
        query: GetFlatCollections,
        variables: {
          collectionType,
          locale,
          limit,
          page,
        },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(collectionType && locale),
  })

export const wineVariantOptions = (slug: string, locale: Locale) =>
  queryOptions({
    queryKey: ['wineVariant', slug, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetWineVariantQueryResult>({
        query: GetWineVariant,
        variables: { slug, locale },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(slug && locale),
  })

// WineGrid hook for fetching wine variants with filtering and pagination
export function useWineGridVariants(
  locale: Locale,
  options: {
    where?: Record<string, unknown>
    sort?: string
    page?: number
    limit?: number
  } = {},
) {
  const { where, sort = '-syncedAt', page = 1, limit = 24 } = options

  return useQuery({
    queryKey: ['wineGridVariants', locale, where, sort, page, limit],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetWineGridVariantsQueryResult>({
        query: GetWineGridVariants,
        variables: { locale, where, sort, page, limit },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(locale),
  })
}
