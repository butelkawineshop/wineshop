import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale, type Locale } from './locales'

export default getRequestConfig(
  async ({ locale }): Promise<{ locale: Locale; messages: Record<string, unknown> }> => {
    // Validate that the incoming `locale` parameter is valid
    const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale

    return {
      locale: validLocale,
      messages: (await import(`../../messages/${validLocale}.json`)).default,
    }
  },
)
