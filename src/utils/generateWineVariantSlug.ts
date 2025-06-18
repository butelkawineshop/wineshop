import { generateSlug } from '@/lib/slug'

interface GenerateWineVariantSlugArgs {
  wineryName: string
  wineName: string
  regionName: string
  countryName: string
  vintage: string
  size: string
}

/**
 * Generates a composite slug for a wine variant, combining winery, wine, region, country, vintage, and size.
 * All parts are normalized and joined with dashes. The size part is appended with 'ml'.
 */
export function generateWineVariantSlug({
  wineryName,
  wineName,
  regionName,
  countryName,
  vintage,
  size,
}: GenerateWineVariantSlugArgs): string {
  const parts = [wineryName, wineName, regionName, countryName, vintage, `${size}ml`]
    .map((part) => generateSlug(part))
    .filter(Boolean)
  return parts.join('-')
}
