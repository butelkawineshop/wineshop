'use client'

import { useParams } from 'next/navigation'
import { TastingCard } from './TastingCard'
import { TastingDetail } from './TastingDetail'
import { useTastings, useTastingBySlug, Tasting as TastingType } from '@/hooks/useTastings'
import type { Locale } from '@/constants/routes'
import { useTranslation } from '@/hooks/useTranslation'
import { CollectionPageLayout } from '../ui/CollectionPageLayout'
import { CollectionDetailLayout } from '../ui/CollectionDetailLayout'
import { HeroCarouselSlide } from '../ui/HeroCarousel'

interface TastingPageProps {
  locale: Locale
  slug?: string
}

export function TastingPage({ locale, slug: propSlug }: TastingPageProps) {
  const { t } = useTranslation()
  const params = useParams()
  const urlSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug
  const slug = propSlug || urlSlug

  const {
    data: tastingsData,
    isLoading: tastingsLoading,
    error: tastingsError,
  } = useTastings(locale)
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
  const {
    data: tastingData,
    isLoading: tastingLoading,
    error: tastingError,
  } = useTastingBySlug(slug || '', locale)
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

  const media = tasting?.media || []
  const content = {
    sl: {
      overview: {
        title: 'Pregled',
        content:
          'Pri Butelki verjamemo, da je vino najboljše v dobri družbi, z napolnjenimi kozarci in brez kančka vzvišenosti. Naše degustacije so sproščeni, vodeni sprehodi skozi različne vinske teme — zasnovani tako, da se nekaj naučiš, ne da bi imel občutek, da si na predavanju.',
      },
      experience: {
        title: 'Izkušnja',
        content:
          'Poskusiš štiri cele steklenice (da, cele – ne le požirkov), dobiš konkreten narezek, da te ne odnese prehitro, in preživiš dve uri zabavne vinske izkušnje, polne zgodb, presenečenj in smeha. Včasih tudi kakšno mini tekmovanje ali celo sabraža – odvisno od izbrane teme.',
      },
      details: {
        title: 'Podrobnosti',
        content:
          'Vse degustacije so za 4 do 8 oseb in potekajo v našem prijetnem degustacijskem prostoru v Kopru. Lahko jih rezerviraš zase, podariš komu, ki potrebuje več veselja (ali vina) v življenju, ali pa si preprosto poiščeš razlog za večer v dobri družbi ob vrhunskem vinu.',
      },
      welcome: {
        title: 'Dobrodošli',
        content: 'Brez snobizma. Z veliko užitka. Dobrodošel v Butelki.',
      },
    },
    en: {
      overview: {
        title: 'Overview',
        content:
          'At Butelka, we believe wine is best enjoyed in good company, with full glasses and zero pretension. Our wine tastings are relaxed, guided adventures through different wine themes — designed to teach you something new without ever sounding like a textbook.',
      },
      experience: {
        title: 'Experience',
        content:
          "You'll taste four full bottles (yep, the real deal — not just sips), get a snack platter to keep you upright, and enjoy two hours of unapologetically fun wine talk. Expect stories, surprises, laughter, and maybe even a mini competition or sabrage moment — depending on the theme you choose.",
      },
      details: {
        title: 'Details',
        content:
          'All tastings are for 4–8 people, hosted in our cozy Koper tasting room. You can book them for yourself, gift them to someone who needs more joy (or alcohol) in their life, or just use them as an excuse to drink really good wine with really good people.',
      },
      welcome: {
        title: 'Welcome',
        content: 'Zero snobbery. Maximum enjoyment. Welcome to Butelka.',
      },
    },
  }
  const localeContent = content[locale]

  if (!slug) {
    // List view
    const heroSlides: HeroCarouselSlide[] = tastings[0]
      ? [
          {
            id: 'overview',
            title: localeContent.overview.title,
            content: localeContent.overview.content,
            mediaUrl: tastings[0].media?.[0]?.url,
            alt: localeContent.overview.title,
          },
          {
            id: 'experience',
            title: localeContent.experience.title,
            content: localeContent.experience.content,
            mediaUrl: tastings[0].media?.[1]?.url || tastings[0].media?.[0]?.url,
            alt: localeContent.experience.title,
          },
          {
            id: 'details',
            title: localeContent.details.title,
            content: localeContent.details.content,
            mediaUrl: tastings[0].media?.[2]?.url || tastings[0].media?.[0]?.url,
            alt: localeContent.details.title,
          },
          {
            id: 'welcome',
            title: localeContent.welcome.title,
            content: localeContent.welcome.content,
            mediaUrl: tastings[0].media?.[3]?.url || tastings[0].media?.[0]?.url,
            alt: localeContent.welcome.title,
          },
        ]
      : []
    return (
      <CollectionPageLayout
        heroSlides={heroSlides}
        items={tastings}
        renderCard={(tasting) => <TastingCard tasting={tasting} locale={locale} />}
        emptyMessage={t('tasting.empty')}
        loading={tastingsLoading}
        error={tastingsError?.message || null}
      />
    )
  }

  // Detail view
  const heroSlides: HeroCarouselSlide[] = tasting
    ? [
        {
          id: 'overview',
          title: localeContent.overview.title,
          content: localeContent.overview.content,
          mediaUrl: tasting.media?.[0]?.url,
          alt: localeContent.overview.title,
        },
        {
          id: 'experience',
          title: localeContent.experience.title,
          content: localeContent.experience.content,
          mediaUrl: tasting.media?.[1]?.url || tasting.media?.[0]?.url,
          alt: localeContent.experience.title,
        },
        {
          id: 'details',
          title: localeContent.details.title,
          content: localeContent.details.content,
          mediaUrl: tasting.media?.[2]?.url || tasting.media?.[0]?.url,
          alt: localeContent.details.title,
        },
        {
          id: 'welcome',
          title: localeContent.welcome.title,
          content: localeContent.welcome.content,
          mediaUrl: tasting.media?.[3]?.url || tasting.media?.[0]?.url,
          alt: localeContent.welcome.title,
        },
      ]
    : []
  return (
    <CollectionDetailLayout
      heroSlides={heroSlides}
      detailContent={tasting && <TastingDetail tasting={tasting} locale={locale} />}
      loading={tastingLoading}
      error={tastingError?.message || null}
    />
  )
}
