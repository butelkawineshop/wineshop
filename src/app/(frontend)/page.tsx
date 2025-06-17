import React from 'react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Media } from '@/components/Media'

export const metadata: Metadata = {
  title: 'Butelka - Fine Wines',
  description: 'Discover and order fine wines from Slovenia',
}

export default async function HomePage(): Promise<React.ReactElement> {
  const t = await getTranslations('home')

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Media
            src="9de8a83a-19aa-4ab7-1ce4-dae6ef427d00/hero"
            alt={t('hero.alt')}
            className="w-full h-full"
            priority
            fill
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-accent mb-6">{t('hero.title')}</h1>
          <p className="text-xl md:text-2xl mb-8">{t('hero.subtitle')}</p>
          <Link
            href="/wineshop"
            className="inline-block bg-white text-black px-8 py-3 rounded-full font-asap hover:bg-opacity-90 transition-all"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </section>

      {/* Featured Wines */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-tanker text-center mb-12">
            {t('featured.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wine Card 1 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64">
                <Media
                  src="654641b3-2a5b-4689-b9a3-2fd4c679b200/square"
                  alt={t('featured.wines.rebula.alt')}
                  className="h-full"
                  fill
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-tanker mb-2">{t('featured.wines.rebula.name')}</h3>
                <p className="text-gray-600 mb-4">{t('featured.wines.rebula.region')}</p>
                <Link href="/wineshop/rebula" className="text-black font-asap hover:underline">
                  {t('featured.wines.learnMore')} →
                </Link>
              </div>
            </div>

            {/* Wine Card 2 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64">
                <Media
                  src="654641b3-2a5b-4689-b9a3-2fd4c679b200/square"
                  alt={t('featured.wines.teran.alt')}
                  className="h-full"
                  fill
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-tanker mb-2">{t('featured.wines.teran.name')}</h3>
                <p className="text-gray-600 mb-4">{t('featured.wines.teran.region')}</p>
                <Link href="/wineshop/teran" className="text-black font-asap hover:underline">
                  {t('featured.wines.learnMore')} →
                </Link>
              </div>
            </div>

            {/* Wine Card 3 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64">
                <Media
                  src="654641b3-2a5b-4689-b9a3-2fd4c679b200/square"
                  alt={t('featured.wines.malvazija.alt')}
                  className="h-full"
                  fill
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-tanker mb-2">{t('featured.wines.malvazija.name')}</h3>
                <p className="text-gray-600 mb-4">{t('featured.wines.malvazija.region')}</p>
                <Link href="/wineshop/malvazija" className="text-black font-asap hover:underline">
                  {t('featured.wines.learnMore')} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-tanker mb-8">{t('about.title')}</h2>
          <p className="text-lg text-gray-700 mb-8">{t('about.description')}</p>
          <Link
            href="/about"
            className="inline-block bg-black text-white px-8 py-3 rounded-full font-asap hover:bg-opacity-90 transition-all"
          >
            {t('about.cta')}
          </Link>
        </div>
      </section>
    </div>
  )
}
