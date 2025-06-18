import { generateSlug } from '@/lib/slug'

interface GenerateWineSlugArgs {
  wineryName: string
  wineName: string
  regionName: string
  countryName: string
}

/**
 * Generates a composite slug for a wine, combining winery, wine, region, and country names.
 * All parts are normalized and joined with dashes.
 */
export function generateWineSlug({
  wineryName,
  wineName,
  regionName,
  countryName,
}: GenerateWineSlugArgs): string {
  const parts = [wineryName, wineName, regionName, countryName]
    .map((part) => generateSlug(part))
    .filter(Boolean)
  return parts.join('-')
}
