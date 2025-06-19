import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { LanguageProvider } from '@/providers/LanguageProvider'
import { type Locale } from '@/i18n/locales'
import slMessages from '../../../messages/sl.json'
import enMessages from '../../../messages/en.json'
import './styles.css'

const asap = localFont({
  src: [
    {
      path: '../../../public/fonts/asap/Asap-Variable.woff2',
      weight: '200 700',
      style: 'normal',
    },
  ],
  variable: '--font-asap',
})

const tanker = localFont({
  src: [
    {
      path: '../../../public/fonts/tanker/Tanker-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-tanker',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Butelka',
    default: 'Butelka - Fine Wines',
  },
  description: 'Discover and order fine wines from Slovenia',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

interface LayoutProps {
  children: React.ReactNode
  locale: Locale
}

export default function Layout({ children, locale }: LayoutProps): React.ReactElement {
  const messages = locale === 'en' ? enMessages : slMessages

  return (
    <html className={`${tanker.variable} ${asap.variable}`} lang={locale} suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <meta
          name="description"
          content="Butelka - Uncork your mind! We're a wine shop in Koper, Slovenia, offering a carefully curated selection of wines from around the world."
        />
      </head>
      <body className="min-h-screen min-w-full max-w-full bg-background antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LanguageProvider locale={locale}>
            <ThemeProvider>
              <main className="mb-[20px] md:pb-0 h-full w-full flex flex-1 flex-col">
                {children}
              </main>
            </ThemeProvider>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
