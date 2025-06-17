/** Supported locales in the application */
export const locales = ['sl', 'en'] as const

/** Type representing a valid locale */
export type Locale = (typeof locales)[number]

/** Default locale used when no locale is specified */
export const defaultLocale: Locale = 'sl'
