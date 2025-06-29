import 'dotenv/config'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { logger } from '../src/lib/logger'

interface WineImage {
  filename: string
  baseName: string
  filePath: string
}

interface WineVariant {
  id: string
  slug: string
  wine: {
    id: string
    slug: string
  }
}

const DRY_RUN = false // Set to false to actually upload

function parseImageBaseName(baseName: string) {
  // Example: batic-marlon-2022-750ml
  //          winery-wine-vintage-size
  const match = baseName.match(/^(.*)-(\d{4}|nv)-(\d+ml)$/i)
  if (!match) return null
  const [_, wineryWine, vintage, size] = match
  return { wineryWine, vintage: vintage.toLowerCase(), size: size.toLowerCase() }
}

async function uploadWineImages() {
  const taskLogger = logger.child({ task: 'uploadWineImages' })
  taskLogger.info('Starting wine image upload via Payload CMS...')

  try {
    // Initialize Payload
    const payload = await getPayload({
      // Pass the config
      config: payloadConfig,
    })

    // Get wine images from the wine-images folder
    const wineImagesDir = join(process.cwd(), 'wine-images')
    const imageFiles = await readdir(wineImagesDir)

    const wineImages: WineImage[] = imageFiles
      .filter((file) => /\.(webp|jpg|jpeg|png)$/i.test(file))
      .map((file) => ({
        filename: file,
        baseName: file.replace(/\.(webp|jpg|jpeg|png)$/i, ''),
        filePath: join(wineImagesDir, file),
      }))

    taskLogger.info(`Found ${wineImages.length} wine images`)

    // Get all wine variants from the database
    const wineVariantsResponse = await payload.find({
      collection: 'wine-variants',
      limit: 1000,
      depth: 1,
    })

    const wineVariants = wineVariantsResponse.docs as WineVariant[]
    taskLogger.info(`Found ${wineVariants.length} wine variants in database`)

    // Create a mapping of wine variant slugs to their IDs
    const wineVariantList = wineVariants

    // Process each image
    let uploadedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const image of wineImages) {
      try {
        taskLogger.debug(`Processing: ${image.filename}`)

        // Parse the image base name
        const parsed = parseImageBaseName(image.baseName)
        if (!parsed) {
          taskLogger.warn(`Could not parse image base name: ${image.baseName}`)
          errorCount++
          continue
        }
        const { wineryWine, vintage, size } = parsed

        // Fuzzy match: slug starts with wineryWine and ends with vintage-size
        const matches = wineVariantList.filter(
          (variant) =>
            variant.slug.startsWith(wineryWine) && variant.slug.endsWith(`${vintage}-${size}`),
        )

        if (matches.length === 0) {
          taskLogger.warn(`No matching wine variant found for: ${image.baseName}`)
          errorCount++
          continue
        }
        if (matches.length > 1) {
          taskLogger.warn(
            `Multiple matches for: ${image.baseName} -> [${matches.map((m) => m.slug).join(', ')}]`,
          )
        }
        const matchingVariant = matches[0]
        taskLogger.debug(`Would match wine variant: ${matchingVariant.slug}`)

        if (DRY_RUN) continue

        // Check if this image already exists in Media collection
        const existingMedia = await payload.find({
          collection: 'media',
          where: {
            filename: {
              equals: image.filename,
            },
          },
          limit: 1,
        })

        if (existingMedia.docs.length > 0) {
          taskLogger.debug(`Already exists, skipping`)
          skippedCount++
          continue
        }

        // Read the image file
        const imageBuffer = await readFile(image.filePath)

        // Create a file object for Payload upload
        const file = {
          data: imageBuffer,
          mimetype: getMimeType(image.filename),
          name: image.filename,
          size: imageBuffer.length,
        }

        // Upload the image through Payload's Media collection
        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `${matchingVariant.slug} wine image`,
            filename: image.filename,
          },
          file: file,
        })

        taskLogger.info(`Uploaded successfully! Media ID: ${mediaDoc.id}`)

        // Update the wine variant with the image
        await payload.update({
          collection: 'wine-variants',
          id: matchingVariant.id,
          data: {
            image: mediaDoc.id,
          },
        })

        taskLogger.info(`Linked image to wine variant: ${matchingVariant.slug}`)
        uploadedCount++
      } catch (error) {
        taskLogger.error(`Error processing ${image.filename}:`, error)
        errorCount++
      }
    }

    taskLogger.info('Upload Summary', {
      uploaded: uploadedCount,
      skipped: skippedCount,
      errors: errorCount,
      total: wineImages.length,
    })
  } catch (error) {
    taskLogger.error('Script failed:', error)
    process.exit(1)
  }
}

function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop()
  switch (ext) {
    case 'webp':
      return 'image/webp'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    default:
      return 'image/webp'
  }
}

// Run the script
uploadWineImages()
  .then(() => {
    console.log('Wine image upload completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
