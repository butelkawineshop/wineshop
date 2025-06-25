import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { useTranslation } from '@/hooks/useTranslation'
import { UI_CONSTANTS } from '@/constants/ui'

interface HomePageProps {
  locale: string
}

interface WineCardProps {
  nameKey: string
  regionKey: string
  altKey: string
  href: string
}

function WineCard({ nameKey, regionKey, altKey, href }: WineCardProps): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="card-hover">
      <div className={`relative ${UI_CONSTANTS.WINE_CARD_HEIGHT}`}>
        <Media src="/images/placeholder.jpg" alt={t(altKey)} className="h-full" fill />
      </div>
      <div className="p-6">
        <h3 className="heading-3 mb-2">{t(nameKey)}</h3>
        <p className="subtitle mb-4">{t(regionKey)}</p>
        <Link href={href} className="interactive-text">
          {t('home.featured.wines.learnMore')} →
        </Link>
      </div>
    </div>
  )
}

export function HomePage({ locale: _locale }: HomePageProps): React.JSX.Element {
  const { t } = useTranslation()

  const featuredWines = [
    {
      nameKey: 'home.featured.wines.rebula.name',
      regionKey: 'home.featured.wines.rebula.region',
      altKey: 'home.featured.wines.rebula.alt',
      href: '/wineshop/rebula',
    },
    {
      nameKey: 'home.featured.wines.teran.name',
      regionKey: 'home.featured.wines.teran.region',
      altKey: 'home.featured.wines.teran.alt',
      href: '/wineshop/teran',
    },
    {
      nameKey: 'home.featured.wines.malvazija.name',
      regionKey: 'home.featured.wines.malvazija.region',
      altKey: 'home.featured.wines.malvazija.alt',
      href: '/wineshop/malvazija',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Media
            src="/images/placeholder.jpg"
            alt={t('home.hero.alt')}
            className="w-full h-full"
            priority
            fill
          />
          <div className="absolute inset-0 bg-other-bg/40" />
        </div>
        <div className="relative z-10 text-center text-other-fg px-4">
          <h1 className="heading-1 mb-6">{t('home.hero.title')}</h1>
          <p className="text-xl md:text-2xl mb-8">{t('home.hero.subtitle')}</p>
          <Link href="/wineshop" className="btn-primary">
            {t('home.hero.cta')}
          </Link>
        </div>
      </section>

      {/* Featured Wines */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <h2 className="heading-2 text-center mb-12">{t('home.featured.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredWines.map((wine) => (
              <WineCard key={wine.nameKey} {...wine} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-background">
        <div className="container-narrow text-center">
          <h2 className="heading-2 mb-8">{t('home.about.title')}</h2>
          <p className="text-lg text-foreground/70 mb-8">{t('home.about.description')}</p>
          <Link href="/about" className="btn-secondary">
            {t('home.about.cta')}
          </Link>
        </div>
      </section>
    </div>
  )
}
