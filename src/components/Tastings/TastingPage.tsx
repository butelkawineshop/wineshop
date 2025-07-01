'use client'

import { useParams } from 'next/navigation'
import { TastingCarousel } from './TastingCarousel'
import { TastingCardsCarousel } from './TastingCardsCarousel'
import { TastingDetail } from './TastingDetail'
import { useTastings, useTastingBySlug, Tasting as TastingType } from '@/hooks/useTastings'
import { LoadingSpinner } from '@/components/ui/loading'
import type { Locale } from '@/constants/routes'

interface TastingPageProps {
  locale: Locale
  slug?: string
}

export function TastingPage({ locale, slug: propSlug }: TastingPageProps) {
  const params = useParams()
  const urlSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug
  const slug = propSlug || urlSlug

  const {
    data: tastingsData,
    isLoading: tastingsLoading,
    error: tastingsError,
  } = useTastings(locale)
  const {
    data: tastingData,
    isLoading: tastingLoading,
    error: tastingError,
  } = useTastingBySlug(slug || '', locale)

  if (tastingsLoading || tastingLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (tastingsError || tastingError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading tastings: {tastingsError?.message || tastingError?.message}
        </div>
      </div>
    )
  }

  // Filter and cast to ensure type safety
  const tastings: TastingType[] = (tastingsData?.Tastings?.docs || [])
    .filter((t): t is typeof t & { id: string; slug: string; title: string } =>
      Boolean(t && t.id && t.slug && t.title),
    )
    .map((t) => ({
      ...t,
      title: t.title ? String(t.title) : '',
      description: t.description ? String(t.description) : undefined,
      updatedAt: t.updatedAt ? String(t.updatedAt) : '',
      createdAt: t.createdAt ? String(t.createdAt) : '',
      exampleWines: Array.isArray(t.exampleWines)
        ? t.exampleWines
            .map((w) =>
              typeof w === 'number'
                ? w
                : typeof w === 'object' && w !== null && 'id' in w
                  ? { ...w, id: typeof w.id === 'string' ? parseInt(w.id, 10) : w.id }
                  : null,
            )
            .filter(
              (w): w is number | import('@/payload-types').FlatWineVariant =>
                typeof w === 'number' ||
                Boolean(w && typeof w === 'object' && typeof w.id === 'number'),
            )
        : [],
    }))
  const tasting: TastingType | null =
    tastingData?.Tastings?.docs?.[0] &&
    tastingData.Tastings.docs[0].id &&
    tastingData.Tastings.docs[0].slug &&
    tastingData.Tastings.docs[0].title
      ? ({
          ...tastingData.Tastings.docs[0],
          title: tastingData.Tastings.docs[0].title
            ? String(tastingData.Tastings.docs[0].title)
            : '',
          description: tastingData.Tastings.docs[0].description
            ? String(tastingData.Tastings.docs[0].description)
            : undefined,
          updatedAt: tastingData.Tastings.docs[0].updatedAt
            ? String(tastingData.Tastings.docs[0].updatedAt)
            : '',
          createdAt: tastingData.Tastings.docs[0].createdAt
            ? String(tastingData.Tastings.docs[0].createdAt)
            : '',
          exampleWines: Array.isArray(tastingData.Tastings.docs[0].exampleWines)
            ? tastingData.Tastings.docs[0].exampleWines
                .map((w) =>
                  typeof w === 'number'
                    ? w
                    : typeof w === 'object' && w !== null && 'id' in w
                      ? { ...w, id: typeof w.id === 'string' ? parseInt(w.id, 10) : w.id }
                      : null,
                )
                .filter(
                  (w): w is number | import('@/payload-types').FlatWineVariant =>
                    typeof w === 'number' ||
                    Boolean(w && typeof w === 'object' && typeof w.id === 'number'),
                )
            : [],
        } as TastingType)
      : tastings[0] || null

  if (!slug) {
    // List view - show carousel and grid
    return (
      <div className="container-narrow mx-auto py-8 space-y-8">
        {tastings[0] && <TastingCarousel tasting={tastings[0]} locale={locale} />}
        <TastingCardsCarousel tastings={tastings} locale={locale} />
      </div>
    )
  }

  // Detail view - show carousel and detail
  return (
    <div className="container-narrow mx-auto py-8">
      {tasting || tastings[0] ? (
        <TastingCarousel tasting={(tasting || tastings[0]) as TastingType} locale={locale} />
      ) : null}
      {tasting && <TastingDetail tasting={tasting} locale={locale} />}
    </div>
  )
}
