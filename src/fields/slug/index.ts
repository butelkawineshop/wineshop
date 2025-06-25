import type { Field } from 'payload'
import { generateSlug } from '@/lib/slug'
import { getLocalizedValue, FIELD_CONSTANTS } from '@/utils/localizedFields'

interface SlugFieldOptions {
  /**
   * The field to use as the source for generating the slug
   * @default 'title'
   */
  sourceField?: string
  /**
   * Whether the field should be localized
   * @default true
   */
  localized?: boolean
  /**
   * Whether the field should be required
   * @default false
   */
  required?: boolean
  /**
   * Custom admin configuration
   */
  admin?: {
    position?: 'sidebar'
    description?: string
  }
}

/**
 * Creates a slug field that automatically generates a URL-safe slug from a source field
 */
export const slugField = ({
  sourceField = FIELD_CONSTANTS.DEFAULT_FIELDS.TITLE,
  localized = true,
  required = false,
  admin = {
    position: 'sidebar',
    description: 'Automatically generated from title',
  },
}: SlugFieldOptions = {}): Field => ({
  name: FIELD_CONSTANTS.DEFAULT_FIELDS.SLUG,
  type: 'text',
  required,
  localized,
  index: true,
  admin: {
    ...admin,
    readOnly: true,
  },
  hooks: {
    beforeChange: [
      ({ data, value }) => {
        if (data?.[sourceField]) {
          const title = getLocalizedValue(data[sourceField])
          if (title) {
            return generateSlug(title)
          }
        }
        return value
      },
    ],
    beforeValidate: [
      ({ data, value }) => {
        if (data?.[sourceField] && !value) {
          const title = getLocalizedValue(data[sourceField])
          if (title) {
            return generateSlug(title)
          }
        }
        return value
      },
    ],
  },
})
