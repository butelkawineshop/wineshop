import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'

export const GrapeVarieties: CollectionConfig = {
  slug: 'grape-varieties',
  admin: {
    group: 'Wine',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'typicalStyle',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'whyCool',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'character',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'synonyms',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
    {
      name: 'skin',
      type: 'select',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'White', value: 'white' },
      ],
    },
    {
      name: 'distinctiveAromas',
      type: 'relationship',
      relationTo: 'aromas',
      hasMany: true,
      admin: {
        description: 'Distinctive aromas of the grape variety.',
      },
    },
    {
      name: 'bestRegions',
      type: 'relationship',
      relationTo: 'regions',
      hasMany: true,
      admin: {
        description: 'Best regions for the grape variety.',
      },
    },
    {
      name: 'blendingPartners',
      type: 'relationship',
      relationTo: 'grape-varieties',
      hasMany: true,
      admin: {
        description: 'Grape varieties that are genetically related or commonly blended together',
      },
    },
    {
      name: 'similarVarieties',
      type: 'relationship',
      relationTo: 'grape-varieties',
      hasMany: true,
      admin: {
        description: 'Grape varieties similar in style.',
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    seoField({
      titleField: 'title',
      descriptionField: 'description',
      imageField: 'media',
      imageSize: 'og',
    }),
  ],
  versions: {
    drafts: true,
  },
}
