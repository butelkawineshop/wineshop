import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
import { locales, defaultLocale, type Locale } from './locales'

export default getRequestConfig(
  async (): Promise<{ locale: Locale; messages: Record<string, unknown> }> => {
    const headersList = await headers()
    const locale = (headersList.get('x-locale') || defaultLocale) as Locale

    // Validate that the incoming `locale` parameter is valid
    const validLocale = locales.includes(locale) ? locale : defaultLocale

    return {
      locale: validLocale,
      messages: (await import(`../../messages/${validLocale}.json`)).default,
    }
  },
)
