import { getRequestConfig } from 'next-intl/server'
import { defaultLocale } from './locales'

export default getRequestConfig(async () => {
  // For now, we'll use the default locale
  // Later we can add logic to detect from user settings, cookies, etc.
  const locale = defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Europe/Ljubljana',
    now: new Date(),
  }
})
