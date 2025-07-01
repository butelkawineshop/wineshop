import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { seoField } from '@/fields/seo'

export const KGBProducts: CollectionConfig = {
  slug: 'kgb-products',
  admin: {
    useAsTitle: 'title',
    group: 'Products',
    defaultColumns: ['title', 'bottleQuantity', 'price', 'active'],
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
      index: true,
      admin: { description: 'Frontend-facing product title.' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'Frontend-facing product description.' },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'bottleQuantity',
      type: 'number',
      required: true,
      min: 3,
      admin: { width: '50%' },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 79.99,
      admin: { width: '50%' },
    },
    {
      name: 'frequencyOptions',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'frequency',
          type: 'select',
          options: [
            { label: 'Monthly', value: 'monthly' },
            { label: 'Bi-Monthly', value: 'bi-monthly' },
            { label: 'Quarterly', value: 'quarterly' },
          ],
        },
      ],
      admin: { description: 'Available delivery frequencies.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { width: '50%' },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: { width: '50%' },
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
