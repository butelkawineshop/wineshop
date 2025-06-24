import 'dotenv/config'
import { readdir } from 'fs/promises'
import path from 'path'

interface MappingResult {
  wineTitle: string
  expectedSlug: string
  imageFile?: string
  hasImage: boolean
  exactMatch: boolean
}

/**
 * Verify that image filenames match expected wine variant slugs
 */
async function verifyImageMapping(
  imagesDirectory: string,
  wineVariantSlugs: string[],
): Promise<MappingResult[]> {
  const results: MappingResult[] = []

  try {
    // Get list of image files
    const files = await readdir(imagesDirectory)
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))

    console.log(`Found ${imageFiles.length} image files`)
    console.log(`Checking ${wineVariantSlugs.length} wine variant slugs`)

    for (const wineVariantSlug of wineVariantSlugs) {
      // Find matching image file
      const matchingFile = imageFiles.find((file) => {
        const fileNameWithoutExt = file.replace(/\.[^/.]+$/, '')
        return fileNameWithoutExt === wineVariantSlug
      })

      const hasImage = !!matchingFile
      const exactMatch = hasImage

      results.push({
        wineTitle: wineVariantSlug,
        expectedSlug: wineVariantSlug,
        imageFile: matchingFile,
        hasImage,
        exactMatch,
      })
    }
  } catch (error) {
    console.error('Error reading images directory:', error)
  }

  return results
}

/**
 * Generate wine variant slugs from your seed data
 */
function getWineVariantSlugs(): string[] {
  return [
    // Format: winery-wine-vintage-sizeml (without region/country)
    'thomas-morey-staubin-1er-cru-les-castets-2022-750ml',
    'batic-marlon-2022-750ml',
    'gaja-idda-white-2020-750ml',
    'movia-veliko-chardonnay-2022-750ml',
    'edi-simcic-fojana-rebula-2021-750ml',
    'kristian-keber-brda-2021-750ml',
    'vincent-girardin-pouilly-fuisse-vieilles-vignes-2022-750ml',
    'burja-stranice-2020-750ml',
    'livon-braide-alte-2021-750ml',
    'pichler-krutzler-riesling-pfaffenberg-2022-750ml',
    // Add more wine variant slugs from your CSV here...
  ]
}

/**
 * Main function
 */
async function main() {
  const imagesDirectory = process.argv[2]

  if (!imagesDirectory) {
    console.error('Usage: npm run verify-image-mapping <images-directory>')
    console.error('Example: npm run verify-image-mapping ./wine-images')
    process.exit(1)
  }

  const wineVariantSlugs = getWineVariantSlugs()
  const results = await verifyImageMapping(imagesDirectory, wineVariantSlugs)

  // Summary
  const exactMatches = results.filter((r) => r.exactMatch)
  const missingImages = results.filter((r) => !r.hasImage)
  const partialMatches = results.filter((r) => r.hasImage && !r.exactMatch)

  console.log('\n📊 Mapping Summary:')
  console.log(`✅ Exact matches: ${exactMatches.length}`)
  console.log(`❌ Missing images: ${missingImages.length}`)
  console.log(`⚠️  Partial matches: ${partialMatches.length}`)

  if (exactMatches.length > 0) {
    console.log('\n✅ Exact matches:')
    exactMatches.forEach((result) => {
      console.log(`  - ${result.wineTitle} -> ${result.imageFile}`)
    })
  }

  if (missingImages.length > 0) {
    console.log('\n❌ Missing images:')
    missingImages.forEach((result) => {
      console.log(`  - ${result.wineTitle} (expected: ${result.expectedSlug}.jpg)`)
    })
  }

  if (partialMatches.length > 0) {
    console.log('\n⚠️  Partial matches:')
    partialMatches.forEach((result) => {
      console.log(
        `  - ${result.wineTitle} -> ${result.imageFile} (expected: ${result.expectedSlug})`,
      )
    })
  }

  // Success rate
  const successRate = (exactMatches.length / results.length) * 100
  console.log(`\n🎯 Success rate: ${successRate.toFixed(1)}%`)

  if (successRate === 100) {
    console.log('🎉 Perfect! All images match their expected slugs exactly.')
  } else if (successRate >= 90) {
    console.log('👍 Great! Most images match their expected slugs.')
  } else {
    console.log('⚠️  Some images need to be renamed to match their expected slugs.')
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { verifyImageMapping, getWineVariantSlugs }
