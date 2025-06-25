import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { seoField } from '@/fields/seo'
import { generateWineSlug } from '@/utils/generateWineSlug'
import { queueRelatedWineVariants } from '@/tasks/queueRelatedWineVariants'

const { afterChange, afterDelete } = queueRelatedWineVariants('wine')

export const Wines: CollectionConfig = {
  slug: 'wines',
  admin: {
    useAsTitle: 'title',
    group: 'Wine',
    defaultColumns: ['winery', 'title', 'region', 'style', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'winery',
          type: 'relationship',
          relationTo: 'wineries',
          required: true,
          index: true,
          admin: { width: '50%' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          index: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'region',
          type: 'relationship',
          relationTo: 'regions',
          required: true,
          index: true,
          admin: { width: '50%' },
        },
        {
          name: 'style',
          type: 'relationship',
          relationTo: 'styles',
          required: true,
          index: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'variants',
      type: 'join',
      collection: 'wine-variants',
      on: 'wine',
      hasMany: true,
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
    {
      name: 'slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatically generated from winery, region, country, and wine title',
      },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (!data?.slug && data?.winery && data?.region && data?.title) {
              try {
                // Get related data
                const [winery, region] = await Promise.all([
                  req.payload.findByID({ collection: 'wineries', id: data.winery }),
                  req.payload.findByID({ collection: 'regions', id: data.region }),
                ])
                if (winery?.title && region?.title && region?.country) {
                  // Get country data
                  const countryId =
                    typeof region.country === 'number' ? region.country : region.country?.id
                  const country = countryId
                    ? await req.payload.findByID({ collection: 'wineCountries', id: countryId })
                    : null
                  if (country?.title) {
                    // Generate slug
                    return generateWineSlug({
                      wineryName: winery.title,
                      wineName: data.title,
                      regionName: region.title,
                      countryName: country.title,
                    })
                  }
                }
              } catch (error) {
                console.error('Error generating wine slug:', error)
              }
            }
            return data?.slug
          },
        ],
      },
    },
  ],
  versions: {
    drafts: true,
  },
}
