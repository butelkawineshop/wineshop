import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import { graphqlRequest } from '@/lib/graphql-client'
import {
  GetFlatCollectionDocument,
  GetFlatCollectionsDocument,
  GetFlatWineVariantDocument,
  GetFlatWineVariantsDocument,
  GetWineVariantDocument,
  GetWineVariantsDocument,
  WineDetailDocument,
  GetRelatedWineVariantsDocument,
} from '@/graphql/documents'
import type {
  GetFlatCollectionQueryResult,
  GetFlatCollectionQueryVariables,
  GetFlatCollectionsQueryResult,
  GetFlatCollectionsQueryVariables,
  GetFlatWineVariantQueryResult,
  GetFlatWineVariantQueryVariables,
  GetFlatWineVariantsQueryResult,
  GetFlatWineVariantsQueryVariables,
  GetWineVariantQueryResult,
  GetWineVariantQueryVariables,
  GetWineVariantsQueryResult,
  GetWineVariantsQueryVariables,
  WineDetailQueryResult,
  WineDetailQueryVariables,
  GetRelatedWineVariantsQueryResult,
  GetRelatedWineVariantsQueryVariables,
} from '@/generated/graphql'
import type { Locale } from '@/constants/routes'

// FlatCollection hooks
export function useFlatCollection(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['flatCollection', slug, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetFlatCollectionQueryResult>({
        query: GetFlatCollectionDocument,
        variables: { slug, locale: locale as any },
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
        query: GetFlatCollectionsDocument,
        variables: {
          collectionType: collectionType as any,
          locale: locale as any,
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
        query: GetFlatWineVariantDocument,
        variables: { slug, locale: locale as any },
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
        query: GetFlatWineVariantsDocument,
        variables: { wineTitle, locale: locale as any },
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
        query: GetWineVariantDocument,
        variables: { slug, locale: locale as any },
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
        query: GetWineVariantsDocument,
        variables: { wineTitle, locale: locale as any },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(wineTitle && locale),
  })
}

// WineDetail hook (custom resolver)
export function useWineDetail(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['wineDetail', slug, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<WineDetailQueryResult>({
        query: WineDetailDocument,
        variables: { slug, locale },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(slug && locale),
  })
}

// RelatedWineVariants hook
export function useRelatedWineVariants(variantId: number, locale: Locale) {
  return useQuery({
    queryKey: ['relatedWineVariants', variantId, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<GetRelatedWineVariantsQueryResult>({
        query: GetRelatedWineVariantsDocument,
        variables: { variantId, locale: locale as any },
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
        query: GetFlatCollectionDocument,
        variables: { slug, locale: locale as any },
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
        query: GetFlatCollectionsDocument,
        variables: {
          collectionType: collectionType as any,
          locale: locale as any,
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
        query: GetWineVariantDocument,
        variables: { slug, locale: locale as any },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(slug && locale),
  })

export const wineDetailOptions = (slug: string, locale: Locale) =>
  queryOptions({
    queryKey: ['wineDetail', slug, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<WineDetailQueryResult>({
        query: WineDetailDocument,
        variables: { slug, locale },
      })
      if (error) throw new Error(error)
      return data
    },
    enabled: Boolean(slug && locale),
  })
