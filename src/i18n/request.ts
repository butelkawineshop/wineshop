import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
import { defaultLocale, Locale } from './locales'

export default getRequestConfig(async () => {
  try {
    const headersList = await headers()
    const locale = (headersList.get('x-locale') as Locale) || defaultLocale

    return {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default,
    }
  } catch (error) {
    // Fallback to default locale if there's an error
    console.error('Failed to load i18n config:', error)
    return {
      locale: defaultLocale,
      messages: (await import(`../../messages/${defaultLocale}.json`)).default,
    }
  }
})
