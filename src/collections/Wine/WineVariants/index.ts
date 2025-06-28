import type { CollectionConfig, CollectionSlug } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { seoField } from '@/fields/seo'
import { generateWineVariantSlug } from '@/utils/generateWineVariantSlug'
import { generateWineVariantSku } from '@/utils/generateWineVariantSku'
import { queueFlatWineVariantSync } from '@/hooks/queueFlatWineVariantSync'

interface WineData {
  id: string
  title: string
  winery: {
    id: string
    title: string
    wineryCode: string
  }
  region: {
    id: string
    title: string
    country: {
      id: string
      title: string
    }
  }
}

function isWineData(data: unknown): data is WineData {
  if (!data || typeof data !== 'object') return false
  const wine = data as Record<string, unknown>

  if (typeof wine.title !== 'string') return false

  if (!wine.winery || typeof wine.winery !== 'object') return false
  const winery = wine.winery as Record<string, unknown>
  if (typeof winery.title !== 'string' || typeof winery.wineryCode !== 'string') return false

  if (!wine.region || typeof wine.region !== 'object') return false
  const region = wine.region as Record<string, unknown>
  if (typeof region.title !== 'string') return false

  if (!region.country || typeof region.country !== 'object') return false
  const country = region.country as Record<string, unknown>
  if (typeof country.title !== 'string') return false

  return true
}

export const WineVariants: CollectionConfig = {
  slug: 'wine-variants',
  admin: {
    useAsTitle: 'sku',
    group: 'Wine',
    defaultColumns: ['sku', 'wine', 'size', 'vintage', 'price', 'stockOnHand', 'canBackorder'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'wine',
          type: 'relationship',
          relationTo: 'wines' as CollectionSlug,
          required: true,
          maxDepth: 3,
          index: true,
          admin: { width: '50%' },
        },
        {
          name: 'size',
          type: 'select',
          required: true,
          index: true,
          options: [
            { label: '187ml (Split)', value: '187' },
            { label: '375ml (Half)', value: '375' },
            { label: '500ml (Bottle)', value: '500' },
            { label: '750ml (Standard)', value: '750' },
            { label: '1.5L (Magnum)', value: '1500' },
            { label: '3L (Double Magnum)', value: '3000' },
            { label: '6L (Imperial)', value: '6000' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'vintage',
          type: 'text',
          required: true,
          index: true,
          admin: { description: 'Use "NV" for Non-Vintage wines', width: '50%' },
        },
        {
          name: 'sku',
          type: 'text',
          index: true,
          unique: true,
          admin: { readOnly: true, width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          index: true,
          admin: { width: '50%' },
        },
        {
          name: 'stockOnHand',
          type: 'number',
          min: 0,
          required: true,
          defaultValue: 0,
          index: true,
          admin: { width: '50%', description: 'Current stock level' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'canBackorder',
          type: 'checkbox',
          label: 'Can Backorder',
          defaultValue: true,
          index: true,
          admin: { width: '50%', description: 'Allow unlimited orders (max 100 bottles)' },
        },
        {
          name: 'maxBackorderQuantity',
          type: 'number',
          min: 1,
          max: 100,
          defaultValue: 100,
          index: true,
          admin: {
            width: '50%',
            condition: (data) => data?.canBackorder === true,
            description: 'Maximum quantity that can be backordered',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'servingTemp',
          type: 'select',
          index: true,
          options: [
            { label: '6-8°C (43-46°F)', value: '6-8' },
            { label: '8-10°C (46-50°F)', value: '8-10' },
            { label: '10-12°C (50-54°F)', value: '10-12' },
            { label: '12-14°C (54-57°F)', value: '12-14' },
            { label: '14-16°C (57-61°F)', value: '14-16' },
            { label: '16-18°C (61-64°F)', value: '16-18' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'decanting',
      type: 'checkbox',
      label: 'Requires Decanting',
      defaultValue: false,
      index: true,
    },
    {
      name: 'foodPairing',
      type: 'relationship',
      relationTo: 'dishes' as CollectionSlug,
      hasMany: true,
    },
    {
      name: 'tastingProfile',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'aromas',
      type: 'relationship',
      relationTo: 'aromas' as CollectionSlug,
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags' as CollectionSlug,
      hasMany: true,
    },
    {
      name: 'moods',
      type: 'relationship',
      relationTo: 'moods' as CollectionSlug,
      hasMany: true,
    },
    {
      name: 'tastingNotes',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'dry', type: 'number', min: 1, max: 10, index: true, admin: { width: '50%' } },
            { name: 'ripe', type: 'number', min: 1, max: 10, index: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'creamy',
              type: 'number',
              min: 1,
              max: 10,
              index: true,
              admin: { width: '50%' },
            },
            { name: 'oaky', type: 'number', min: 1, max: 10, index: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'complex',
              type: 'number',
              min: 1,
              max: 10,
              index: true,
              admin: { width: '50%' },
            },
            {
              name: 'light',
              type: 'number',
              min: 1,
              max: 10,
              index: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'smooth',
              type: 'number',
              min: 1,
              max: 10,
              index: true,
              admin: { width: '50%' },
            },
            {
              name: 'youthful',
              type: 'number',
              min: 1,
              max: 10,
              index: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'energetic',
              type: 'number',
              min: 1,
              max: 10,
              index: true,
              admin: { width: '50%' },
            },
            {
              name: 'alcohol',
              type: 'number',
              min: 1,
              max: 20,
              index: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'grapeVarieties',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'variety',
              type: 'relationship',
              relationTo: 'grape-varieties' as CollectionSlug,
              admin: { width: '70%' },
            },
            {
              name: 'percentage',
              type: 'number',
              min: 0,
              max: 100,
              admin: { width: '30%', step: 1 },
            },
          ],
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media' as CollectionSlug,
      hasMany: true,
    },
    seoField({
      titleField: 'sku',
      descriptionField: 'tastingProfile',
      imageField: 'media',
      imageSize: 'og',
    }),
    {
      name: 'slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatically generated from wine, vintage, and size',
      },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (!data?.slug && data?.wine && data?.vintage && data?.size) {
              try {
                const wine = await req.payload.findByID({
                  collection: 'wines' as CollectionSlug,
                  id: data.wine,
                  depth: 2,
                })

                if (isWineData(wine)) {
                  return generateWineVariantSlug({
                    wineryName: wine.winery.title,
                    wineName: wine.title,
                    regionName: wine.region.title,
                    countryName: wine.region.country.title,
                    vintage: data.vintage,
                    size: data.size,
                  })
                }
              } catch (error) {
                console.error('Error generating wine variant slug:', error)
              }
            }
            return data?.slug
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data?.sku && data?.wine && data?.size && data?.vintage) {
          try {
            const wine = await req.payload.findByID({
              collection: 'wines' as CollectionSlug,
              id: data.wine,
              depth: 2,
            })

            if (isWineData(wine)) {
              data.sku = generateWineVariantSku({
                wine,
                size: data.size,
                vintage: data.vintage,
              })
            }
          } catch (error) {
            console.error('Error generating SKU:', error)
          }
        }
        if (data.stockOnHand < 0) {
          data.stockOnHand = 0
        }
        return data
      },
    ],
    afterChange: [queueFlatWineVariantSync],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
  },
}
