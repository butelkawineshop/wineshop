import { useQuery } from '@tanstack/react-query'
import { graphqlRequest } from '@/lib/graphql-client'
import type { Locale } from '@/constants/routes'
import type { Tasting as PayloadTasting } from '@/payload-types'

// GraphQL queries (inline to avoid codegen dependency)
const GET_TASTINGS = `
  query GetTastings($locale: LocaleInputType) {
    Tastings(where: { _status: { equals: published } }, locale: $locale) {
      docs {
        id
        title
        slug
        description
        pricePerPerson
        minPeople
        maxPeople
        duration
        wineTypes { wineType quantity id }
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
        media { id url alt }
      }
    }
  }
`

const GET_TASTING_BY_SLUG = `
  query GetTastingBySlug($slug: String!, $locale: LocaleInputType) {
    Tastings(where: { slug: { equals: $slug }, _status: { equals: published } }, locale: $locale) {
      docs {
        id
        title
        slug
        description
        pricePerPerson
        minPeople
        maxPeople
        duration
        wineTypes { wineType quantity id }
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
        media { id url alt }
      }
    }
  }
`

// Tasting type for components (id as string for compatibility)
export interface Tasting {
  id: string
  slug: string
  title: string
  description?: string
  pricePerPerson: number
  minPeople: number
  maxPeople: number
  wineTypes: Array<{
    wineType: string
    quantity: number
    id?: string
  }>
  duration: number
  media?: Array<{
    id?: string
    url?: string
    alt?: string
  }>
  exampleWines?: (number | import('@/payload-types').FlatWineVariant)[]
}

// Type guards for media and exampleWines
function isMediaObject(m: unknown): m is { id?: string | number; url?: string; alt?: string } {
  return (
    typeof m === 'object' &&
    m !== null &&
    'id' in m &&
    (typeof (m as Record<string, unknown>).id === 'string' ||
      typeof (m as Record<string, unknown>).id === 'number')
  )
}
function isWineObject(w: unknown): w is { id?: string | number } {
  return (
    typeof w === 'object' &&
    w !== null &&
    'id' in w &&
    (typeof (w as Record<string, unknown>).id === 'string' ||
      typeof (w as Record<string, unknown>).id === 'number')
  )
}

// Fetch all tastings
export function useTastings(locale: Locale) {
  return useQuery({
    queryKey: ['tastings', locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<{ Tastings?: { docs: PayloadTasting[] } }>({
        query: GET_TASTINGS,
        variables: { locale },
      })
      if (error) throw new Error(error)
      // Map id to string for compatibility
      const docs =
        data?.Tastings?.docs?.map((t) => ({
          ...t,
          id: String(t.id),
          slug: t.slug ? String(t.slug) : '',
          wineTypes:
            t.wineTypes?.map((wt) => ({
              ...wt,
              id: wt.id ? String(wt.id) : undefined,
              wineType: wt.wineType ? String(wt.wineType) : '',
            })) || [],
          media: Array.isArray(t.media)
            ? t.media.filter(isMediaObject).map((m) => {
                const mediaObj = m as { id?: string | number; url?: string; alt?: string }
                return {
                  id: mediaObj.id ? String(mediaObj.id) : undefined,
                  url: mediaObj.url,
                  alt: mediaObj.alt,
                }
              })
            : [],
          exampleWines: Array.isArray(t.exampleWines)
            ? t.exampleWines.filter(isWineObject).map((w) => {
                if (w && typeof w === 'object' && 'id' in w) {
                  return { ...w, id: w.id ? String(w.id) : '' }
                }
                return w
              })
            : [],
        })) || []
      return { Tastings: { docs } }
    },
    enabled: Boolean(locale),
  })
}

// Fetch a single tasting by slug
export function useTastingBySlug(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['tasting', slug, locale],
    queryFn: async () => {
      const { data, error } = await graphqlRequest<{ Tastings?: { docs: PayloadTasting[] } }>({
        query: GET_TASTING_BY_SLUG,
        variables: { slug, locale },
      })
      if (error) throw new Error(error)
      const docs =
        data?.Tastings?.docs?.map((t) => ({
          ...t,
          id: String(t.id),
          slug: t.slug ? String(t.slug) : '',
          wineTypes:
            t.wineTypes?.map((wt) => ({
              ...wt,
              id: wt.id ? String(wt.id) : undefined,
              wineType: wt.wineType ? String(wt.wineType) : '',
            })) || [],
          media: Array.isArray(t.media)
            ? t.media.filter(isMediaObject).map((m) => {
                const mediaObj = m as { id?: string | number; url?: string; alt?: string }
                return {
                  id: mediaObj.id ? String(mediaObj.id) : undefined,
                  url: mediaObj.url,
                  alt: mediaObj.alt,
                }
              })
            : [],
          exampleWines: Array.isArray(t.exampleWines)
            ? t.exampleWines.filter(isWineObject).map((w) => {
                if (w && typeof w === 'object' && 'id' in w) {
                  return { ...w, id: w.id ? String(w.id) : '' }
                }
                return w
              })
            : [],
        })) || []
      return { Tastings: { docs } }
    },
    enabled: Boolean(slug && locale),
  })
}
