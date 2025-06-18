import { z } from 'zod'

// Branded type for slugs to ensure type safety
export type Slug = string & { readonly brand: unique symbol }

// Zod schema for slug validation
const slugSchema = z
  .string()
  .min(1, 'Slug cannot be empty')
  .max(100, 'Slug cannot be longer than 100 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .transform((val) => val as Slug)

/**
 * Generates a URL-safe slug from a string
 * @param input - The string to convert to a slug
 * @returns A validated slug string
 * @throws {ZodError} If the generated slug is invalid
 */
export function generateSlug(input: string): Slug {
  if (!input) {
    throw new Error('Input string cannot be empty')
  }

  // Convert to lowercase and normalize
  let slug = input.toLowerCase().trim()

  // Replace special characters and diacritics
  slug = slug
    .normalize('NFD') // Decompose characters with diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen

  // Validate the generated slug
  const result = slugSchema.safeParse(slug)
  if (!result.success) {
    throw new Error(`Invalid slug generated: ${result.error.message}`)
  }

  return result.data
}

/**
 * Type guard to check if a string is a valid slug
 * @param value - The string to check
 * @returns True if the string is a valid slug
 */
export function isValidSlug(value: string): value is Slug {
  return slugSchema.safeParse(value).success
}

/**
 * Ensures a string is a valid slug, generating one if necessary
 * @param input - The input string
 * @param existingSlugs - Optional array of existing slugs to avoid duplicates
 * @returns A unique, valid slug
 */
export function ensureSlug(input: string, existingSlugs: string[] = []): Slug {
  let slug = generateSlug(input)
  let counter = 1

  // If the slug exists, append a number until we find a unique one
  while (existingSlugs.includes(slug)) {
    slug = generateSlug(`${input}-${counter}`)
    counter++
  }

  return slug
}
