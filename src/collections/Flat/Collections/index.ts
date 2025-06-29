import type { CollectionConfig } from 'payload'
import { syncTypesense, deleteFromTypesense } from '@/hooks/syncTypesense'
import { queueFlatCollectionSync } from '@/hooks/queueFlatCollectionSync'
import { FLAT_COLLECTIONS_CONSTANTS } from '@/constants/flatCollections'

export const FlatCollections: CollectionConfig = {
  slug: FLAT_COLLECTIONS_CONSTANTS.COLLECTIONS.FLAT_COLLECTIONS,
  admin: {
    useAsTitle: 'title',
    group: 'Wine',
    hidden: false,
    defaultColumns: ['collectionType', 'title', 'slug', 'isPublished', 'updatedAt'],
  },
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  hooks: {
    afterChange: [syncTypesense, queueFlatCollectionSync],
    afterDelete: [deleteFromTypesense],
  },
  fields: [
    // Core identification fields
    {
      name: 'originalID',
      type: 'number',
      required: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Reference to the original collection item',
      },
    },
    {
      name: 'collectionType',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Aroma', value: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES.AROMA },
        { label: 'Climate', value: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES.CLIMATE },
        { label: 'Dish', value: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES.DISH },
        {
          label: 'Grape Variety',
          value: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES.GRAPE_VARIETY,
        },
        { label: 'Mood', value: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES.MOOD },
        { label: 'Region', value: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES.REGION },
        { label: 'Style', value: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES.STYLE },
        { label: 'Tag', value: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES.TAG },
        { label: 'Wine Country', value: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES.WINE_COUNTRY },
        { label: 'Winery', value: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES.WINERY },
      ],
      admin: {
        readOnly: true,
        description: 'Type of collection this item belongs to',
      },
    },
    {
      name: 'originalSlug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Original collection slug for reference',
      },
    },

    // Localized fields - Slovenian versions
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Slovenian title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Slovenian slug for URL generation',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      index: true,
      admin: {
        readOnly: true,
        description: 'Slovenian description',
      },
    },

    // Localized fields - English versions
    {
      name: 'titleEn',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'English title',
      },
    },
    {
      name: 'slugEn',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'English slug for URL generation',
      },
    },
    {
      name: 'descriptionEn',
      type: 'textarea',
      index: true,
      admin: {
        readOnly: true,
        description: 'English description',
      },
    },

    // Collection-specific localized fields
    {
      name: 'whyCool',
      type: 'textarea',
      index: true,
      admin: {
        readOnly: true,
        description: 'Slovenian whyCool (Regions, Wineries, WineCountries, GrapeVarieties)',
      },
    },
    {
      name: 'whyCoolEn',
      type: 'textarea',
      index: true,
      admin: {
        readOnly: true,
        description: 'English whyCool',
      },
    },
    {
      name: 'typicalStyle',
      type: 'textarea',
      index: true,
      admin: {
        readOnly: true,
        description: 'Slovenian typicalStyle (GrapeVarieties)',
      },
    },
    {
      name: 'typicalStyleEn',
      type: 'textarea',
      index: true,
      admin: {
        readOnly: true,
        description: 'English typicalStyle',
      },
    },
    {
      name: 'character',
      type: 'textarea',
      index: true,
      admin: {
        readOnly: true,
        description: 'Slovenian character (GrapeVarieties)',
      },
    },
    {
      name: 'characterEn',
      type: 'textarea',
      index: true,
      admin: {
        readOnly: true,
        description: 'English character',
      },
    },

    // Collection-specific non-localized fields
    {
      name: 'iconKey',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'Icon key for styles',
      },
    },
    {
      name: 'wineryCode',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'Winery code (Wineries)',
      },
    },
    {
      name: 'priceRange',
      type: 'select',
      index: true,
      options: FLAT_COLLECTIONS_CONSTANTS.PRICE_RANGES as unknown as Array<{
        label: string
        value: string
      }>,
      admin: {
        readOnly: true,
        description: 'Price range (Regions)',
      },
    },
    {
      name: 'skin',
      type: 'select',
      index: true,
      options: FLAT_COLLECTIONS_CONSTANTS.SKIN_COLORS as unknown as Array<{
        label: string
        value: string
      }>,
      admin: {
        readOnly: true,
        description: 'Grape skin color (GrapeVarieties)',
      },
    },
    {
      name: 'climate',
      type: 'select',
      index: true,
      options: FLAT_COLLECTIONS_CONSTANTS.CLIMATE_TYPES as unknown as Array<{
        label: string
        value: string
      }>,
      admin: {
        readOnly: true,
        description: 'Climate type (Climates)',
      },
    },
    {
      name: 'climateTemperature',
      type: 'select',
      index: true,
      options: FLAT_COLLECTIONS_CONSTANTS.CLIMATE_TEMPERATURES as unknown as Array<{
        label: string
        value: string
      }>,
      admin: {
        readOnly: true,
        description: 'Climate temperature (Climates)',
      },
    },
    {
      name: 'category',
      type: 'select',
      index: true,
      options: FLAT_COLLECTIONS_CONSTANTS.FLAVOUR_CATEGORIES as unknown as Array<{
        label: string
        value: string
      }>,
      admin: {
        readOnly: true,
        description: 'Flavour category (Flavours)',
      },
    },
    {
      name: 'colorGroup',
      type: 'select',
      index: true,
      options: FLAT_COLLECTIONS_CONSTANTS.COLOR_GROUPS as unknown as Array<{
        label: string
        value: string
      }>,
      admin: {
        readOnly: true,
        description: 'Color group for fruits and flowers (Flavours)',
      },
    },

    // Aroma-specific fields
    {
      name: 'adjective',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Adjective data for aromas',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
      ],
    },
    {
      name: 'flavour',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Flavour data for aromas',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'colorGroup', type: 'text' },
      ],
    },

    // Region-specific fields
    {
      name: 'country',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Country data for regions',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
      ],
    },
    {
      name: 'climateData',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Climate data for regions',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
      ],
    },

    // WineCountry-specific fields
    {
      name: 'statistics',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Statistics for wine countries',
      },
      fields: [
        { name: 'landArea', type: 'number' },
        { name: 'wineriesCount', type: 'number' },
      ],
    },

    // Climate-specific fields
    {
      name: 'climateConditions',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Climate conditions for climates',
      },
      fields: [
        { name: 'diurnalRange', type: 'text' },
        { name: 'humidity', type: 'text' },
      ],
    },

    // Winery-specific fields
    {
      name: 'social',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Social media links for wineries',
      },
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'website', type: 'text' },
      ],
    },

    // Array fields
    {
      name: 'synonyms',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Synonyms for grape varieties',
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
      ],
    },

    // Relationship arrays (denormalized)
    {
      name: 'bestGrapes',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Best grape varieties (Regions, WineCountries, Climates)',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
      ],
    },
    {
      name: 'bestRegions',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Best regions (WineCountries, Climates, GrapeVarieties)',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
      ],
    },
    {
      name: 'legends',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Legendary wineries (Regions, WineCountries)',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
        { name: 'wineryCode', type: 'text' },
      ],
    },
    {
      name: 'neighbours',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Neighbouring regions (Regions)',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
      ],
    },
    {
      name: 'relatedWineries',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Related wineries (Wineries)',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
        { name: 'wineryCode', type: 'text' },
      ],
    },
    {
      name: 'distinctiveAromas',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Distinctive aromas (GrapeVarieties)',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
      ],
    },
    {
      name: 'blendingPartners',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Blending partner grape varieties (GrapeVarieties)',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
      ],
    },
    {
      name: 'similarVarieties',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Similar grape varieties (GrapeVarieties)',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Tags (Wineries)',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'slugEn', type: 'text' },
      ],
    },

    // Media fields
    {
      name: 'media',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Media files',
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'alt', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'thumbnailURL', type: 'text' },
      ],
    },

    // SEO fields
    {
      name: 'seo',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'SEO metadata',
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'titleEn', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'descriptionEn', type: 'textarea' },
        { name: 'image', type: 'text' },
      ],
    },

    // Metadata fields
    {
      name: 'syncedAt',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'When this record was last synced',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Whether the original item is published',
      },
    },
  ],
  versions: {
    drafts: true,
  },
}
