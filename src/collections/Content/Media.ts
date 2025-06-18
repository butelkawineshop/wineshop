import type { CollectionConfig, PayloadRequest } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'alt',
    group: 'Content',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'cloudflareId',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'thumbnailURL',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    disableLocalStorage: true,
    adminThumbnail: 'thumbnailURL',
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc?.cloudflareId) {
          const baseUrl = `${process.env.CLOUDFLARE_IMAGES_URL}/${doc.cloudflareId}`
          return {
            ...doc,
            url: `${baseUrl}/winecards`,
            thumbnailURL: `${baseUrl}/thumbnail`,
          }
        }
        return doc
      },
    ],
    beforeChange: [
      async ({
        req,
        data,
        operation,
      }: {
        req: PayloadRequest
        data: {
          mimeType?: string
          cloudflareId?: string
          url?: string
          thumbnailURL?: string
          [key: string]: unknown
        }
        operation: 'create' | 'update'
      }) => {
        // Only process images
        if (!data.mimeType?.startsWith('image/')) {
          return data
        }

        // If this is an update and we already have a Cloudflare ID, preserve it
        if (operation === 'update' && data.cloudflareId) {
          return data
        }

        try {
          // First, get the upload URL from Cloudflare
          const uploadResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
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

          // Now upload the file to the provided URL
          const formData = new FormData()

          // Get the file from the request
          const file = req.file
          if (!file) {
            throw new Error('No file found in request')
          }

          // Create a new File object with the correct mime type
          const newFile = new File([file.data], file.name, { type: file.mimetype })
          formData.append('file', newFile)

          // Clear the file data from memory
          delete (file as { data?: Buffer }).data

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
            // Store the Cloudflare image ID
            const cloudflareId = result.result.id
            const baseUrl = `${process.env.CLOUDFLARE_IMAGES_URL}/${cloudflareId}`

            return {
              ...data,
              cloudflareId,
              url: `${baseUrl}/winecards`,
              thumbnailURL: `${baseUrl}/thumbnail`,
            }
          }

          return data
        } catch (error) {
          console.error('Error uploading to Cloudflare Images:', error)
          // Return the data without Cloudflare ID if upload fails
          return data
        }
      },
    ],
  },
}
