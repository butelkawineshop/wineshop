import type { CollectionConfig } from 'payload'
import { syncTypesense, deleteFromTypesense } from '@/hooks/syncTypesense'

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
  hooks: {
    afterChange: [syncTypesense],
    afterDelete: [deleteFromTypesense],
  },
  fields: [
    {
      name: 'originalVariant',
      type: 'relationship',
      relationTo: 'wine-variants',
      required: true,
      admin: {
        readOnly: true,
        description: 'Reference to the original wine variant',
      },
    },
    {
      name: 'wineID',
      type: 'number',
      index: true,
      admin: {
        readOnly: true,
        description: 'Reference to the parent wine (for grouping variants)',
      },
    },
    {
      name: 'wineryID',
      type: 'number',
      index: true,
      admin: {
        readOnly: true,
        description: 'Reference to the winery (for related wines)',
      },
    },
    {
      name: 'regionID',
      type: 'number',
      index: true,
      admin: {
        readOnly: true,
        description: 'Reference to the region (for related wines)',
      },
    },
    {
      name: 'countryID',
      type: 'number',
      index: true,
      admin: {
        readOnly: true,
        description: 'Reference to the wine country (for related wines)',
      },
    },
    {
      name: 'styleID',
      type: 'number',
      index: true,
      admin: {
        readOnly: true,
        description: 'Reference to the wine style (for related wines)',
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
      name: 'styleSlugEn',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'English style slug for URL generation',
      },
    },
    {
      name: 'winerySlug',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'Winery slug for URL generation',
      },
    },
    {
      name: 'winerySlugEn',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'English winery slug for URL generation',
      },
    },
    {
      name: 'regionSlug',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'Region slug for URL generation',
      },
    },
    {
      name: 'regionSlugEn',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'English region slug for URL generation',
      },
    },
    {
      name: 'countrySlug',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'Country slug for URL generation',
      },
    },
    {
      name: 'countrySlugEn',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'English country slug for URL generation',
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
      name: 'description',
      type: 'textarea',
      index: true,
      admin: {
        readOnly: true,
        description: 'Wine description',
      },
    },
    {
      name: 'descriptionEn',
      type: 'textarea',
      index: true,
      admin: {
        readOnly: true,
        description: 'English wine description',
      },
    },
    {
      name: 'relatedWineries',
      type: 'array',
      index: true,
      admin: {
        readOnly: true,
        description: 'Related wineries for filtering',
      },
      fields: [{ name: 'id', type: 'text' }],
    },
    {
      name: 'relatedRegions',
      type: 'array',
      index: true,
      admin: {
        readOnly: true,
        description: 'Related regions for filtering',
      },
      fields: [{ name: 'id', type: 'text' }],
    },
    {
      name: 'wineryTags',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Winery tags for filtering',
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text', admin: { description: 'English title' } },
        { name: 'id', type: 'text' },
        { name: 'slug', type: 'text', admin: { description: 'Slovenian slug' } },
        { name: 'slugEn', type: 'text', admin: { description: 'English slug' } },
      ],
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
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'ripe',
          type: 'number',
          min: 1,
          max: 10,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'creamy',
          type: 'number',
          min: 1,
          max: 10,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'oaky',
          type: 'number',
          min: 1,
          max: 10,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'complex',
          type: 'number',
          min: 1,
          max: 10,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'light',
          type: 'number',
          min: 1,
          max: 10,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'smooth',
          type: 'number',
          min: 1,
          max: 10,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'youthful',
          type: 'number',
          min: 1,
          max: 10,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'energetic',
          type: 'number',
          min: 1,
          max: 10,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'alcohol',
          type: 'number',
          min: 1,
          max: 20,
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
        { name: 'slug', type: 'text', admin: { description: 'Slovenian slug' } },
        { name: 'slugEn', type: 'text', admin: { description: 'English slug' } },
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
        { name: 'slug', type: 'text', admin: { description: 'Slovenian slug' } },
        { name: 'slugEn', type: 'text', admin: { description: 'English slug' } },
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
        { name: 'slug', type: 'text', admin: { description: 'Slovenian slug' } },
        { name: 'slugEn', type: 'text', admin: { description: 'English slug' } },
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
        { name: 'slug', type: 'text', admin: { description: 'Slovenian slug' } },
        { name: 'slugEn', type: 'text', admin: { description: 'English slug' } },
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
        { name: 'slug', type: 'text', admin: { description: 'Slovenian slug' } },
        { name: 'slugEn', type: 'text', admin: { description: 'English slug' } },
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
        { name: 'slug', type: 'text', admin: { description: 'Slovenian slug' } },
        { name: 'slugEn', type: 'text', admin: { description: 'English slug' } },
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
