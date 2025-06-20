import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { type Locale } from '@/i18n/locales'
import slMessages from '../../../messages/sl.json'
import enMessages from '../../../messages/en.json'

interface HomePageProps {
  locale: Locale
}

export function HomePage({ locale }: HomePageProps): React.ReactElement {
  const messages = locale === 'en' ? enMessages : slMessages
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: unknown = messages
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return typeof value === 'string' ? value : key
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Media
            src="9de8a83a-19aa-4ab7-1ce4-dae6ef427d00/hero"
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
            {/* Wine Card 1 */}
            <div className="card-hover">
              <div className="relative h-64">
                <Media
                  src="654641b3-2a5b-4689-b9a3-2fd4c679b200/square"
                  alt={t('home.featured.wines.rebula.alt')}
                  className="h-full"
                  fill
                />
              </div>
              <div className="p-6">
                <h3 className="heading-3 mb-2">{t('home.featured.wines.rebula.name')}</h3>
                <p className="subtitle mb-4">{t('home.featured.wines.rebula.region')}</p>
                <Link href="/wineshop/rebula" className="interactive-text">
                  {t('home.featured.wines.learnMore')} →
                </Link>
              </div>
            </div>

            {/* Wine Card 2 */}
            <div className="card-hover">
              <div className="relative h-64">
                <Media
                  src="654641b3-2a5b-4689-b9a3-2fd4c679b200/square"
                  alt={t('home.featured.wines.teran.alt')}
                  className="h-full"
                  fill
                />
              </div>
              <div className="p-6">
                <h3 className="heading-3 mb-2">{t('home.featured.wines.teran.name')}</h3>
                <p className="subtitle mb-4">{t('home.featured.wines.teran.region')}</p>
                <Link href="/wineshop/teran" className="interactive-text">
                  {t('home.featured.wines.learnMore')} →
                </Link>
              </div>
            </div>

            {/* Wine Card 3 */}
            <div className="card-hover">
              <div className="relative h-64">
                <Media
                  src="654641b3-2a5b-4689-b9a3-2fd4c679b200/square"
                  alt={t('home.featured.wines.malvazija.alt')}
                  className="h-full"
                  fill
                />
              </div>
              <div className="p-6">
                <h3 className="heading-3 mb-2">{t('home.featured.wines.malvazija.name')}</h3>
                <p className="subtitle mb-4">{t('home.featured.wines.malvazija.region')}</p>
                <Link href="/wineshop/malvazija" className="interactive-text">
                  {t('home.featured.wines.learnMore')} →
                </Link>
              </div>
            </div>
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
