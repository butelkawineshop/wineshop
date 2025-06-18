import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { queueRelatedWineVariants } from '@/tasks/queueRelatedWineVariants'

const { afterChange, afterDelete } = queueRelatedWineVariants('region')

export const Regions: CollectionConfig = {
  slug: 'regions',
  admin: {
    useAsTitle: 'title',
    group: 'Wine',
    defaultColumns: ['title', 'country', 'slug', 'updatedAt'],
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
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'whyCool',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'priceRange',
      type: 'select',
      options: [
        { label: '8-12€', value: '8-12' },
        { label: '12-18€', value: '12-18' },
        { label: '18-24€', value: '18-24' },
        { label: '24-30€', value: '24-30' },
        { label: '30-40€', value: '30-40' },
        { label: '40-50€', value: '40-50' },
        { label: '50-60€', value: '50-60' },
      ],
    },
    {
      name: 'climate',
      label: 'Climate',
      type: 'relationship',
      relationTo: 'climates',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'wineCountries',
      required: true,
    },
    {
      name: 'neighbours',
      type: 'relationship',
      relationTo: 'regions',
      hasMany: true,
      admin: {
        description: 'Neighbouring regions',
      },
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
