import type { CollectionConfig } from 'payload'

export const FlatWineVariants: CollectionConfig = {
  slug: 'flat-wine-variants',
  admin: {
    useAsTitle: 'sku',
    group: 'Wine',
    hidden: false,
    defaultColumns: [
      'sku',
      'wineTitle',
      'wineryTitle',
      'regionTitle',
      'countryTitle',
      'size',
      'vintage',
      'price',
      'stockOnHand',
    ],
  },
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'originalVariant',
      type: 'relationship',
      relationTo: 'wine-variants',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sku',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'wineTitle',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'wineryTitle',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'wineryCode',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'regionTitle',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'countryTitle',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'countryTitleEn',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'English country title',
      },
    },
    {
      name: 'size',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'vintage',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'stockOnHand',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'canBackorder',
      type: 'checkbox',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'maxBackorderQuantity',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'servingTemp',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'decanting',
      type: 'checkbox',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'tastingProfile',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'aromas',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text', admin: { description: 'English title' } },
        { name: 'id', type: 'text' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text', admin: { description: 'English title' } },
        { name: 'id', type: 'text' },
      ],
    },
    {
      name: 'moods',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text', admin: { description: 'English title' } },
        { name: 'id', type: 'text' },
      ],
    },
    {
      name: 'grapeVarieties',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text', admin: { description: 'English title' } },
        { name: 'id', type: 'text' },
      ],
    },
    {
      name: 'primaryImageUrl',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'syncedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  versions: {
    drafts: true,
  },
}
