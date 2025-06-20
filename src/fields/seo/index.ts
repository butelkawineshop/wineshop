import type { Field } from 'payload'

interface SEOFieldOptions {
  /**
   * Whether the field should be localized
   * @default true
   */
  localized?: boolean
  /**
   * The field to use as the source for the title
   * @default 'title'
   */
  titleField?: string
  /**
   * The field to use as the source for the description
   * @default 'description'
   */
  descriptionField?: string
  /**
   * The field to use as the source for the image
   * @default 'image'
   */
  imageField?: string
  /**
   * The size variant to use for the image
   * @default 'og'
   */
  imageSize?: string
}

interface SEOData {
  title: string
  description: string
  image?: string
  ogType: string
  twitterCard: string
  robots: string
  structuredData?: Record<string, unknown>
}

/**
 * Creates a SEO field group that automatically generates SEO data from collection fields
 */
export const seoField = ({
  localized = true,
  titleField = 'title',
  descriptionField = 'description',
  imageField = 'image',
  imageSize = 'og',
}: SEOFieldOptions = {}): Field => ({
  name: 'seo',
  type: 'group',
  admin: {
    position: 'sidebar',
    description: 'Automatically generated SEO data',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.seo?.manualOverride) return data

        const fallbackImage = '/logo-square.jpg'

        // Handle both single and array media fields
        let imageUrl = fallbackImage
        const mediaData = data?.[imageField]
        if (mediaData) {
          if (Array.isArray(mediaData) && mediaData.length > 0) {
            // If it's an array, take the first image
            imageUrl = mediaData[0]?.url ? `${mediaData[0].url}/${imageSize}` : fallbackImage
          } else if (mediaData.url) {
            // If it's a single image
            imageUrl = `${mediaData.url}/${imageSize}`
          }
        }

        const seo: SEOData = {
          title: (() => {
            const titleValue = data?.[titleField]
            if (typeof titleValue === 'object' && titleValue?.sl) {
              return titleValue.sl
            }
            return titleValue || ''
          })(),
          description: (() => {
            const descValue = data?.[descriptionField]
            if (typeof descValue === 'object' && descValue?.sl) {
              return descValue.sl
            }
            return descValue || ''
          })(),
          image: imageUrl,
          ogType: 'website',
          twitterCard: 'summary_large_image',
          robots: 'index,follow',
        }

        if (data?.price) {
          const titleValue = data[titleField]
          const descValue = data[descriptionField]

          seo.structuredData = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: typeof titleValue === 'object' && titleValue?.sl ? titleValue.sl : titleValue,
            description: typeof descValue === 'object' && descValue?.sl ? descValue.sl : descValue,
            image: imageUrl,
            offers: {
              '@type': 'Offer',
              price: data.price,
              priceCurrency: 'EUR',
              availability: data.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          }
        }

        return {
          ...data,
          seo,
        }
      },
    ],
  },
  fields: [
    {
      name: 'manualOverride',
      type: 'checkbox',
      label: 'Manual override',
      admin: {
        position: 'sidebar',
        description: 'Check this to edit SEO fields manually',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: false,
      localized,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      localized,
    },
    {
      name: 'image',
      type: 'text',
      required: false,
    },
    {
      name: 'structuredData',
      type: 'json',
      required: false,
    },
  ],
})
