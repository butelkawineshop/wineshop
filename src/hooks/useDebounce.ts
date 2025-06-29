import { useState, useEffect } from 'react'
import { HOOK_CONSTANTS } from '@/constants/hooks'

export function useDebounce<T>(
  value: T,
  delay: number = HOOK_CONSTANTS.DEBOUNCE.DEFAULT_DELAY_MS,
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
