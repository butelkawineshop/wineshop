'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { ROUTE_MAPPINGS, type Locale } from '@/constants/routes'

// Canonical list of wine navigation collections and their i18n keys
const WINE_NAV_CONFIG = [
  { collection: 'wines', i18n: 'wine.list.title' },
  { collection: 'styles', i18n: 'style.list.title' },
  { collection: 'wineCountries', i18n: 'wineCountry.list.title' },
  { collection: 'regions', i18n: 'region.list.title' },
  { collection: 'wineries', i18n: 'winery.list.title' },
  { collection: 'grape-varieties', i18n: 'grapeVariety.list.title' },
  { collection: 'moods', i18n: 'mood.list.title' },
  { collection: 'tags', i18n: 'tag.list.title' },
  { collection: 'dishes', i18n: 'dish.list.title' },
  { collection: 'climates', i18n: 'climate.list.title' },
  { collection: 'aromas', i18n: 'aroma.list.title' },
]

function getSegmentForCollection(collection: string, locale: Locale): string | null {
  // Find the first routeMappings entry with this collection
  const entry = Object.entries(ROUTE_MAPPINGS).find(([, v]) => v.collection === collection)
  return entry ? entry[1][locale] : null
}

function getWineNavItems(locale: Locale) {
  return WINE_NAV_CONFIG.map(({ collection, i18n }) => {
    const segment = getSegmentForCollection(collection, locale)
    if (!segment) return null
    // Compose the correct public href for each locale
    const href = locale === 'sl' ? `/${segment}` : `/en/${segment}`
    return { key: collection, href, label: i18n }
  }).filter((item): item is { key: string; href: string; label: string } => !!item)
}

interface WineNavBarProps {
  locale: Locale
}

export const WineNavBar: React.FC<WineNavBarProps> = ({ locale }) => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const navItems = getWineNavItems(locale)

  // Find the active index for Swiper centering
  const activeIndex = navItems.findIndex((item) => pathname?.startsWith(item.href))

  return (
    <div className=" relative w-full flex justify-center text-center items-center py-2">
      {/* Swiper nav */}
      <Swiper
        spaceBetween={8}
        slidesPerView={5}
        slideToClickedSlide={true}
        centeredSlides
        initialSlide={activeIndex > -1 ? activeIndex : 0}
        className="w-full"
        freeMode
        style={{ zIndex: 2 }}
      >
        {navItems.map((item, index) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <SwiperSlide
              key={`${item.key}-${index}`}
              className="flex justify-center items-center text-center h-full"
            >
              <div
                className={`transition-all duration-300 ease-out ${
                  isActive ? 'scale-115' : 'scale-100'
                }`}
              >
                <Link
                  href={item.href}
                  className={`px-4 py-2 items-center justify-center ${
                    isActive
                      ? 'text-foreground opacity-100' // active style
                      : 'text-foreground/60 hover:text-foreground/80 font-medium'
                  }`}
                  tabIndex={0}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <h2 className="heading-3 font-accent whitespace-nowrap">{t(item.label)}</h2>
                </Link>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="w-full h-full absolute top-0 left-0 z-10"
          style={{
            background:
              'linear-gradient(to right, hsl(var(--background)) 0%, transparent 50%, transparent 80%, hsl(var(--background)) 100%)',
          }}
        />
      </div>
    </div>
  )
}
