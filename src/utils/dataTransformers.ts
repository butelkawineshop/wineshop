/**
 * Shared data transformation utilities
 * Used across multiple services to avoid code duplication
 */

/**
 * Convert snake_case database fields to camelCase
 * Used in database query results to match TypeScript interfaces
 */
export function mapSnakeToCamel(obj: Record<string, unknown>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    mapped[camelKey] = value
  }
  return mapped
}

/**
 * Convert camelCase object keys to snake_case
 * Used when sending data to database
 */
export function mapCamelToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    mapped[snakeKey] = value
  }
  return mapped
}

/**
 * Safely convert a value to string, handling null/undefined
 */
export function safeToString(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value)
}

/**
 * Safely convert a value to number, handling null/undefined
 */
export function safeToNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null
  }
  const num = Number(value)
  return isNaN(num) ? null : num
}

/**
 * Check if a value is a valid object (not null, not array)
 */
export function isValidObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Deep clone an object, removing specified keys recursively
 */
export function deepCloneWithoutKeys<T>(obj: T, keysToRemove: string[] = ['id']): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCloneWithoutKeys(item, keysToRemove)) as T
  }

  if (isValidObject(obj)) {
    const cleaned: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (!keysToRemove.includes(key)) {
        cleaned[key] = deepCloneWithoutKeys(value, keysToRemove)
      }
    }
    return cleaned as T
  }

  return obj
}
