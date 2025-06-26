import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'

interface CloudflareImage {
  id: string
  filename: string
  metadata?: {
    originalFilename?: string
    uploadedAt?: string
  }
  variants: string[]
  uploaded: string
  requireSignedURLs: boolean
  draft: boolean
}

interface CloudflareImagesResponse {
  success: boolean
  result: {
    images: CloudflareImage[]
    continuation_token?: string
  }
}

async function fetchCloudflareImages(continuationToken?: string): Promise<CloudflareImage[]> {
  const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
  const CLOUDFLARE_IMAGES_API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN

  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_IMAGES_API_TOKEN) {
    throw new Error('Missing Cloudflare environment variables')
  }

  let url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`
  if (continuationToken) {
    url += `?continuation_token=${continuationToken}`
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Cloudflare images: ${response.statusText}`)
  }

  const data: CloudflareImagesResponse = await response.json()

  if (!data.success) {
    throw new Error('Failed to fetch Cloudflare images')
  }

  return data.result.images
}

async function getAllCloudflareImages(): Promise<CloudflareImage[]> {
  const allImages: CloudflareImage[] = []
  let continuationToken: string | undefined

  do {
    console.log(`📥 Fetching images${continuationToken ? ' (continued)' : ''}...`)
    const images = await fetchCloudflareImages(continuationToken)
    allImages.push(...images)

    // Check if there are more images to fetch
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1${continuationToken ? `?continuation_token=${continuationToken}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_API_TOKEN}`,
        },
      },
    )

    const data: CloudflareImagesResponse = await response.json()
    continuationToken = data.result.continuation_token
  } while (continuationToken)

  return allImages
}

async function syncCloudflareImagesToPayload(): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    console.log('🔄 Fetching images from Cloudflare...')
    const cloudflareImages = await getAllCloudflareImages()

    console.log(`📊 Found ${cloudflareImages.length} images in Cloudflare`)

    let created = 0
    let skipped = 0
    let errors = 0

    for (const image of cloudflareImages) {
      try {
        // Check if media already exists with this Cloudflare ID
        const existingMedia = await payload.find({
          collection: 'media',
          where: {
            cloudflareId: {
              equals: image.id,
            },
          },
          limit: 1,
        })

        if (existingMedia.docs.length > 0) {
          console.log(`⏭️  Skipping ${image.filename} - already exists`)
          skipped++
          continue
        }

        // Create media record without triggering upload hooks
        // We'll set the data directly to avoid the file upload process
        const mediaData = {
          alt: image.filename.replace(/\.[^/.]+$/, ''), // Use filename without extension as alt text
          cloudflareId: image.id,
          originalFilename: image.filename,
          // Set these directly to avoid upload hooks
          url: `${process.env.CLOUDFLARE_IMAGES_URL}/${image.id}/winecards`,
          thumbnailURL: `${process.env.CLOUDFLARE_IMAGES_URL}/${image.id}/thumbnail`,
          // Add a dummy mimeType to satisfy the collection requirements
          mimeType: 'image/jpeg', // Default to jpeg, adjust if needed
        }

        // Use the raw database operation to bypass hooks
        const result = await payload.db.create({
          collection: 'media',
          data: mediaData,
        })

        console.log(`✅ Created Media for ${image.filename}`)
        created++
      } catch (error) {
        console.error(`❌ Error creating Media for ${image.filename}:`, error)
        errors++
      }
    }

    console.log('\n📈 Sync Summary:')
    console.log(`✅ Created: ${created}`)
    console.log(`⏭️  Skipped: ${skipped}`)
    console.log(`❌ Errors: ${errors}`)
    console.log(`📊 Total processed: ${cloudflareImages.length}`)
  } catch (error) {
    console.error('❌ Error syncing Cloudflare images:', error)
  }
}

// Run the sync
syncCloudflareImagesToPayload()
