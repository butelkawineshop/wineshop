import { STORE_CONSTANTS } from '@/constants/store'
import { type Locale } from '@/i18n/locales'

export interface LanguageState {
  currentLanguage: Locale
  isSwitching: boolean
  error: string | null
}

export interface LanguageActions {
  setLanguage: (lang: Locale) => void
  setSwitching: (switching: boolean) => void
  setError: (error: string | null) => void
  switchLanguage: (newLanguage: Locale, pathname: string) => Promise<void>
  toggleLanguage: (pathname: string) => Promise<void>
  clearError: () => void
}

export interface LanguageSelectors {
  getCurrentLanguage: () => Locale
  getIsSwitching: () => boolean
  getError: () => string | null
  getIsEnglish: () => boolean
  getIsSlovenian: () => boolean
  hasError: () => boolean
}

export const language = {
  state: {
    currentLanguage: STORE_CONSTANTS.DEFAULT_LOCALE,
    isSwitching: false,
    error: null,
  } as LanguageState,
  actions: {} as LanguageActions, // To be implemented in useStore
  selectors: {} as LanguageSelectors, // To be implemented in useStore
}
