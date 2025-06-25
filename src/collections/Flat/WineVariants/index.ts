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
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sku',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'wineTitle',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'wineryTitle',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'wineryCode',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'regionTitle',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'countryTitle',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'countryTitleEn',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'English country title',
      },
    },
    {
      name: 'styleTitle',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'styleTitleEn',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'English style title',
      },
    },
    {
      name: 'styleIconKey',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'styleSlug',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'Style slug for URL generation',
      },
    },
    {
      name: 'size',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'vintage',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'price',
      type: 'number',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'stockOnHand',
      type: 'number',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'canBackorder',
      type: 'checkbox',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'maxBackorderQuantity',
      type: 'number',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'servingTemp',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'decanting',
      type: 'checkbox',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'tastingProfile',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'tastingNotes',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Individual tasting note values for filtering',
      },
      fields: [
        {
          name: 'dry',
          type: 'number',
          min: 1,
          max: 10,
          index: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'ripe',
          type: 'number',
          min: 1,
          max: 10,
          index: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'creamy',
          type: 'number',
          min: 1,
          max: 10,
          index: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'oaky',
          type: 'number',
          min: 1,
          max: 10,
          index: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'complex',
          type: 'number',
          min: 1,
          max: 10,
          index: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'light',
          type: 'number',
          min: 1,
          max: 10,
          index: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'smooth',
          type: 'number',
          min: 1,
          max: 10,
          index: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'youthful',
          type: 'number',
          min: 1,
          max: 10,
          index: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'energetic',
          type: 'number',
          min: 1,
          max: 10,
          index: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'alcohol',
          type: 'number',
          min: 1,
          max: 20,
          index: true,
          admin: {
            readOnly: true,
          },
        },
      ],
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
        { name: 'percentage', type: 'number', admin: { description: 'Grape variety percentage' } },
      ],
    },
    {
      name: 'climates',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Climate information for filtering',
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text', admin: { description: 'English title' } },
        { name: 'id', type: 'text' },
      ],
    },
    {
      name: 'dishes',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Food pairing dishes for filtering',
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
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'syncedAt',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      index: true,
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
