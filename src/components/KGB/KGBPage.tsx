'use client'

import { useParams } from 'next/navigation'
import { useKGBProducts, useKGBProductBySlug } from '@/hooks/useKGBProducts'
import { KGBProductCard } from './KGBProductCard'
import { KGBProductDetail } from './KGBProductDetail'
import type { Locale } from '@/constants/routes'
import { useTranslation } from '@/hooks/useTranslation'
import { CollectionPageLayout } from '../ui/CollectionPageLayout'
import { CollectionDetailLayout } from '../ui/CollectionDetailLayout'
import { HeroCarouselSlide } from '../ui/HeroCarousel'

interface KGBPageProps {
  locale: Locale
  slug?: string
}

export function KGBPage({ locale, slug: propSlug }: KGBPageProps) {
  const { t } = useTranslation()
  const params = useParams()
  const urlSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug
  const slug = propSlug || urlSlug

  const {
    data: productsRaw,
    isLoading: productsLoading,
    error: productsError,
  } = useKGBProducts(locale)
  const products = productsRaw || []
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useKGBProductBySlug(slug || '', locale)

  if (!slug) {
    // List view
    const heroSlides: HeroCarouselSlide[] = products[0]
      ? [
          {
            id: 'overview',
            title: products[0].title,
            content: products[0].description,
            mediaUrl: products[0].media?.[0]?.url,
            alt: products[0].title,
          },
          {
            id: 'details',
            title: t('kgb.carousel.details'),
            content: `${products[0].bottleQuantity} ${t('kgb.fields.bottles')} | ${products[0].price} €`,
            mediaUrl: products[0].media?.[1]?.url || products[0].media?.[0]?.url,
            alt: products[0].title,
          },
        ]
      : []
    return (
      <CollectionPageLayout
        heroSlides={heroSlides}
        items={products}
        renderCard={(product) => <KGBProductCard product={product} locale={locale} />}
        emptyMessage={t('kgb.empty')}
        loading={productsLoading}
        error={productsError?.message || null}
      />
    )
  }

  // Detail view
  const heroSlides: HeroCarouselSlide[] = product
    ? [
        {
          id: 'overview',
          title: product.title,
          content: product.description,
          mediaUrl: product.media?.[0]?.url,
          alt: product.title,
        },
        {
          id: 'details',
          title: t('kgb.carousel.details'),
          content: `${product.bottleQuantity} ${t('kgb.fields.bottles')} | ${product.price} €`,
          mediaUrl: product.media?.[1]?.url || product.media?.[0]?.url,
          alt: product.title,
        },
      ]
    : []
  return (
    <CollectionDetailLayout
      heroSlides={heroSlides}
      detailContent={product && <KGBProductDetail product={product} locale={locale} />}
      loading={productLoading}
      error={productError?.message || null}
    />
  )
}
