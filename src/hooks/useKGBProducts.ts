import { useQuery } from '@tanstack/react-query'
import { graphqlRequest } from '@/lib/graphql-client'
import type { Locale } from '@/constants/routes'

const GET_KGB_PRODUCTS = `
  query GetKGBProducts($locale: LocaleInputType) {
    KGBProducts(where: { _status: { equals: published } }, locale: $locale) {
      docs {
        id
        title
        description
        slug
        media { id url alt }
        bottleQuantity
        price
        frequencyOptions { frequency }
        active
        isDefault
        exampleWines {
          id
          wineTitle
          primaryImageUrl
          originalVariant { id slug }
          updatedAt
          createdAt
          slug
          sku
          wineID
          wineryID
          wineryTitle
          wineryCode
          winerySlug
          regionID
          regionTitle
          regionSlug
          countryID
          countryTitle
          countrySlug
          styleID
          styleTitle
          styleIconKey
          styleSlug
          size
          vintage
          price
          stockOnHand
          canBackorder
          maxBackorderQuantity
          servingTemp
          decanting
          tastingProfile
          description
          syncedAt
          relatedWineries { id }
          relatedRegions { id }
          wineryTags { title id slug }
          tastingNotes { dry ripe creamy oaky complex light smooth youthful energetic alcohol }
          aromas { id title slug }
          tags { id title slug }
          moods { id title slug }
          grapeVarieties { id title slug percentage }
          climates { id title slug }
          dishes { id title slug }
        }
      }
    }
  }
`

const GET_KGB_PRODUCT_BY_SLUG = `
  query GetKGBProductBySlug($slug: String!, $locale: LocaleInputType) {
    KGBProducts(where: { slug: { equals: $slug }, _status: { equals: published } }, locale: $locale) {
      docs {
        id
        title
        description
        slug
        media { id url alt }
        bottleQuantity
        price
        frequencyOptions { frequency }
        active
        isDefault
        exampleWines {
          id
          wineTitle
          primaryImageUrl
          originalVariant { id slug }
          updatedAt
          createdAt
          slug
          sku
          wineID
          wineryID
          wineryTitle
          wineryCode
          winerySlug
          regionID
          regionTitle
          regionSlug
          countryID
          countryTitle
          countrySlug
          styleID
          styleTitle
          styleIconKey
          styleSlug
          size
          vintage
          price
          stockOnHand
          canBackorder
          maxBackorderQuantity
          servingTemp
          decanting
          tastingProfile
          description
          syncedAt
          relatedWineries { id }
          relatedRegions { id }
          wineryTags { title id slug }
          tastingNotes { dry ripe creamy oaky complex light smooth youthful energetic alcohol }
          aromas { id title slug }
          tags { id title slug }
          moods { id title slug }
          grapeVarieties { id title slug percentage }
          climates { id title slug }
          dishes { id title slug }
        }
      }
    }
  }
`

export interface KGBProduct {
  id: string
  slug: string
  title: string
  description?: string
  media?: Array<{ id?: string; url?: string; alt?: string }>
  bottleQuantity: number
  price: number
  frequencyOptions: Array<{ frequency: string }>
  active: boolean
  isDefault: boolean
  exampleWines?: Array<number | import('@/payload-types').FlatWineVariant>
}

export function useKGBProducts(locale: Locale) {
  return useQuery({
    queryKey: ['kgb-products', locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<{ KGBProducts?: { docs: KGBProduct[] } }>({
        query: GET_KGB_PRODUCTS,
        variables: { locale },
      })
      if (error) throw new Error(error)
      return data?.KGBProducts?.docs || []
    },
  })
}

export function useKGBProductBySlug(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['kgb-product', slug, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<{ KGBProducts?: { docs: KGBProduct[] } }>({
        query: GET_KGB_PRODUCT_BY_SLUG,
        variables: { slug, locale },
      })
      if (error) throw new Error(error)
      return data?.KGBProducts?.docs?.[0] || null
    },
    enabled: !!slug,
  })
}
