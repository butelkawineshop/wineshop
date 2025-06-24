import 'dotenv/config'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { generateCloudflareId } from '../src/utilities/wineImageMapping'
import { generateWineVariantSlug } from '../src/utils/generateWineVariantSlug'

interface ImageUploadResult {
  originalFilename: string
  cloudflareId: string
  wineSlug: string
  wineVariantId: string
  success: boolean
  error?: string
}

/**
 * Get all wine variants from the database and generate their slugs
 */
async function getAllWineVariantSlugs(): Promise<
  Array<{ id: string; slug: string; title: string }>
> {
  const payload = await getPayload({ config: payloadConfig })

  console.log('🔍 Fetching all wine variants from database...')

  const allVariants: Array<{ id: string; slug: string; title: string }> = []
  let page = 1
  const limit = 100

  while (true) {
    const response = await payload.find({
      collection: 'wine-variants',
      limit,
      page,
      depth: 2, // Populate wine relationships
    })

    for (const variant of response.docs) {
      if (variant.wine && typeof variant.wine !== 'number') {
        const wine = variant.wine
        if (
          wine.winery &&
          wine.region &&
          typeof wine.winery !== 'number' &&
          typeof wine.region !== 'number'
        ) {
          const region = wine.region
          if (region.country && typeof region.country !== 'number') {
            const slug = generateWineVariantSlug({
              wineryName: wine.winery.title,
              wineName: wine.title,
              regionName: region.title,
              countryName: region.country.title,
              vintage: variant.vintage,
              size: variant.size,
            })

            allVariants.push({
              id: variant.id.toString(),
              slug,
              title: `${wine.title} ${variant.vintage} ${variant.size}ml`,
            })
          }
        }
      }
    }

    // If we got fewer docs than the limit, we've reached the end
    if (response.docs.length < limit) {
      break
    }

    page++
  }

  console.log(`📊 Found ${allVariants.length} wine variants`)
  return allVariants
}

/**
 * Upload wine images to Cloudflare Images with custom IDs
 * This script assumes your images are in a directory and named to match wine variant slugs
 */
async function uploadWineImages(
  imagesDirectory: string,
  wineVariants: Array<{ id: string; slug: string; title: string }>,
): Promise<ImageUploadResult[]> {
  const results: ImageUploadResult[] = []

  try {
    // Get list of image files
    const files = await readdir(imagesDirectory)
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))

    console.log(`Found ${imageFiles.length} image files`)
    console.log(`Processing ${wineVariants.length} wine variants`)

    for (const wineVariant of wineVariants) {
      try {
        // Find matching image file (try multiple extensions)
        const matchingFile = imageFiles.find((file) => {
          const fileNameWithoutExt = file.replace(/\.[^/.]+$/, '')
          // Since images match slugs exactly, we can do a direct comparison
          return fileNameWithoutExt === wineVariant.slug
        })

        if (matchingFile) {
          console.log(`✅ Found matching image: ${matchingFile} for ${wineVariant.title}`)
        }

        if (!matchingFile) {
          results.push({
            originalFilename: '',
            cloudflareId: '',
            wineSlug: wineVariant.slug,
            wineVariantId: wineVariant.id,
            success: false,
            error: 'No matching image file found',
          })
          continue
        }

        const imagePath = join(imagesDirectory, matchingFile)
        const imageBuffer = await readFile(imagePath)

        // Generate custom Cloudflare ID
        const cloudflareId = generateCloudflareId(wineVariant.slug)

        // Upload to Cloudflare Images
        const uploadResult = await uploadImageToCloudflare(imageBuffer, matchingFile, cloudflareId)

        if (uploadResult.success) {
          results.push({
            originalFilename: matchingFile,
            cloudflareId: cloudflareId,
            wineSlug: wineVariant.slug,
            wineVariantId: wineVariant.id,
            success: true,
          })
          console.log(`✅ Uploaded: ${matchingFile} -> ${cloudflareId}`)
        } else {
          results.push({
            originalFilename: matchingFile,
            cloudflareId: cloudflareId,
            wineSlug: wineVariant.slug,
            wineVariantId: wineVariant.id,
            success: false,
            error: uploadResult.error,
          })
          console.log(`❌ Failed to upload: ${matchingFile} - ${uploadResult.error}`)
        }

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        results.push({
          originalFilename: '',
          cloudflareId: '',
          wineSlug: wineVariant.slug,
          wineVariantId: wineVariant.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        console.log(`❌ Error processing ${wineVariant.title}:`, error)
      }
    }
  } catch (error) {
    console.error('Error reading images directory:', error)
  }

  return results
}

/**
 * Upload a single image to Cloudflare Images
 */
async function uploadImageToCloudflare(
  imageBuffer: Buffer,
  filename: string,
  _customId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get upload URL from Cloudflare
    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      throw new Error(`Failed to get upload URL: ${uploadResponse.statusText} - ${errorText}`)
    }

    const uploadData = await uploadResponse.json()

    if (!uploadData.success) {
      throw new Error('Failed to get upload URL from Cloudflare')
    }

    // Upload the file using multipart/form-data
    const formData = new FormData()

    // Create a File object with the correct mime type (matching Media collection approach)
    const file = new File([imageBuffer], filename, { type: getMimeType(filename) })
    formData.append('file', file)

    const uploadResult = await fetch(uploadData.result.uploadURL, {
      method: 'POST',
      body: formData,
    })

    if (!uploadResult.ok) {
      const errorText = await uploadResult.text()
      throw new Error(`Failed to upload image: ${uploadResult.statusText} - ${errorText}`)
    }

    const result = await uploadResult.json()

    if (result.success) {
      return { success: true }
    } else {
      return { success: false, error: 'Upload failed' }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get MIME type from filename
 */
function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    default:
      return 'image/jpeg'
  }
}

/**
 * Main function
 */
async function main() {
  const imagesDirectory = process.argv[2]

  if (!imagesDirectory) {
    console.error('Usage: npm run upload-wine-images <images-directory>')
    console.error('Example: npm run upload-wine-images ./wine-images')
    process.exit(1)
  }

  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_IMAGES_API_TOKEN) {
    console.error('Missing required environment variables:')
    console.error('- CLOUDFLARE_ACCOUNT_ID')
    console.error('- CLOUDFLARE_IMAGES_API_TOKEN')
    process.exit(1)
  }

  const wineVariants = await getAllWineVariantSlugs()
  console.log(`Generated ${wineVariants.length} wine variants`)

  const results = await uploadWineImages(imagesDirectory, wineVariants)

  // Summary
  const successful = results.filter((r) => r.success)
  const failed = results.filter((r) => !r.success)

  console.log('\n📊 Upload Summary:')
  console.log(`✅ Successful: ${successful.length}`)
  console.log(`❌ Failed: ${failed.length}`)

  if (failed.length > 0) {
    console.log('\n❌ Failed uploads:')
    failed.forEach((result) => {
      console.log(`  - ${result.wineSlug}: ${result.error}`)
    })
  }

  if (successful.length > 0) {
    console.log('\n✅ Successful uploads:')
    successful.forEach((result) => {
      console.log(`  - ${result.originalFilename} -> ${result.cloudflareId}`)
    })
  }
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { uploadWineImages, getAllWineVariantSlugs }
