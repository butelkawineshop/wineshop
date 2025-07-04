import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { queueRelatedWineVariants } from '@/tasks/queueRelatedWineVariants'
import { queueFlatCollectionSync } from '@/hooks/queueFlatCollectionSync'
import { queueFlatWineVariantSync } from '@/hooks/queueFlatWineVariantSync'

const { afterChange, afterDelete } = queueRelatedWineVariants('country')

export const WineCountries: CollectionConfig = {
  slug: 'wineCountries',
  admin: {
    useAsTitle: 'title',
    group: 'Wine',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [afterChange, queueFlatCollectionSync, queueFlatWineVariantSync],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      index: true,
    },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'whyCool',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'statistics',
      type: 'group',
      fields: [
        {
          name: 'landArea',
          type: 'number',
          label: 'Land Area (km²)',
          index: true,
        },
        {
          name: 'wineriesCount',
          type: 'number',
          label: 'Number of Wineries',
          index: true,
        },
      ],
    },
    {
      name: 'regions',
      type: 'join',
      collection: 'regions',
      on: 'country',
      hasMany: true,
    },
    {
      name: 'bestRegions',
      type: 'relationship',
      relationTo: 'regions',
      hasMany: true,
    },
    {
      name: 'bestGrapes',
      type: 'relationship',
      relationTo: 'grape-varieties',
      hasMany: true,
    },
    {
      name: 'legends',
      type: 'relationship',
      relationTo: 'wineries',
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
  ],
  versions: {
    drafts: true,
  },
}
