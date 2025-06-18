import type { Field } from 'payload'
import { generateSlug } from '@/lib/slug'

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
  sourceField = 'title',
  localized = true,
  required = false,
  admin = {
    position: 'sidebar',
    description: 'Automatically generated from title',
  },
}: SlugFieldOptions = {}): Field => ({
  name: 'slug',
  type: 'text',
  required,
  localized,
  admin: {
    ...admin,
    readOnly: true,
  },
  hooks: {
    beforeChange: [
      ({ data, value }) => {
        if (data?.[sourceField]) {
          return generateSlug(data[sourceField])
        }
        return value
      },
    ],
    beforeValidate: [
      ({ data, value }) => {
        if (data?.[sourceField] && !value) {
          return generateSlug(data[sourceField])
        }
        return value
      },
    ],
  },
})
