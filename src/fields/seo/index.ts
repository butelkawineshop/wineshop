import type { Field } from 'payload'
import { getLocalizedValueWithFallback, FIELD_CONSTANTS } from '@/utils/localizedFields'

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
  titleField = FIELD_CONSTANTS.DEFAULT_FIELDS.TITLE,
  descriptionField = FIELD_CONSTANTS.DEFAULT_FIELDS.DESCRIPTION,
  imageField = FIELD_CONSTANTS.DEFAULT_FIELDS.IMAGE,
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

        // Handle both single and array media fields
        let imageUrl: string = FIELD_CONSTANTS.DEFAULT_VALUES.FALLBACK_IMAGE
        const mediaData = data?.[imageField]
        if (mediaData) {
          if (Array.isArray(mediaData) && mediaData.length > 0) {
            // If it's an array, take the first image
            imageUrl = mediaData[0]?.url
              ? `${mediaData[0].url}/${imageSize}`
              : FIELD_CONSTANTS.DEFAULT_VALUES.FALLBACK_IMAGE
          } else if (mediaData.url) {
            // If it's a single image
            imageUrl = `${mediaData.url}/${imageSize}`
          }
        }

        const seo: SEOData = {
          title: getLocalizedValueWithFallback(data?.[titleField]),
          description: getLocalizedValueWithFallback(data?.[descriptionField]),
          image: imageUrl,
          ogType: FIELD_CONSTANTS.DEFAULT_VALUES.OG_TYPE,
          twitterCard: FIELD_CONSTANTS.DEFAULT_VALUES.TWITTER_CARD,
          robots: FIELD_CONSTANTS.DEFAULT_VALUES.ROBOTS,
        }

        if (data?.price) {
          const titleValue = data[titleField]
          const descValue = data[descriptionField]

          seo.structuredData = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: getLocalizedValueWithFallback(titleValue),
            description: getLocalizedValueWithFallback(descValue),
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
      name: FIELD_CONSTANTS.DEFAULT_FIELDS.TITLE,
      type: 'text',
      required: false,
      localized,
    },
    {
      name: FIELD_CONSTANTS.DEFAULT_FIELDS.DESCRIPTION,
      type: 'textarea',
      required: false,
      localized,
    },
    {
      name: FIELD_CONSTANTS.DEFAULT_FIELDS.IMAGE,
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
