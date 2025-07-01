import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'

export const Tastings: CollectionConfig = {
  slug: 'tastings',
  admin: {
    useAsTitle: 'title',
    group: 'Products',
    defaultColumns: ['title', 'updatedAt'],
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
      localized: true,
      index: true,
      admin: {
        description: 'The title of the tasting',
      },
    },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'pricePerPerson',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'minPeople',
      type: 'number',
      required: true,
      defaultValue: 4,
    },
    {
      name: 'maxPeople',
      type: 'number',
      required: true,
      defaultValue: 8,
    },
    {
      name: 'wineTypes',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'wineType',
          type: 'select',
          options: [
            {
              label: 'Red',
              value: 'red',
            },
            {
              label: 'White',
              value: 'white',
            },
            {
              label: 'Rose',
              value: 'rose',
            },
            {
              label: 'Sparkling',
              value: 'sparkling',
            },
            {
              label: 'Sweet',
              value: 'sweet',
            },
            {
              label: 'Skin Contact',
              value: 'skin-contact',
            },
            {
              label: 'Beasts',
              value: 'beasts',
            },
            {
              label: 'Babies',
              value: 'babies',
            },
          ],
        },
        { name: 'quantity', type: 'number', required: true, min: 0, defaultValue: 1 },
      ],
    },
    {
      name: 'exampleWines',
      type: 'relationship',
      relationTo: 'flat-wine-variants',
      hasMany: true,
      admin: {
        description:
          'Example wines to showcase for this tasting. These will be displayed as recommendations.',
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 120,
      admin: {
        step: 15,
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
      imageField: 'media',
      imageSize: 'og',
    }),
  ],
  versions: {
    drafts: true,
  },
}
