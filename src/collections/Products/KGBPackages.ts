import type { CollectionConfig, CollectionSlug } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const KGBPackages: CollectionConfig = {
  slug: 'kgb-packages',
  admin: {
    useAsTitle: 'subscription',
    group: 'Products',
    defaultColumns: ['subscription', 'paymentDate', 'deliveryDate', 'status'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'kgb-subscriptions' as CollectionSlug,
      required: true,
      index: true,
    },
    {
      name: 'paymentDate',
      type: 'date',
      required: true,
      admin: { width: '50%' },
    },
    {
      name: 'deliveryDate',
      type: 'date',
      required: true,
      admin: { width: '50%' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Skipped', value: 'skipped' },
        { label: 'Failed', value: 'failed' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'In Transit', value: 'in_transit' },
      ],
      admin: { width: '50%' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Admin-only notes.' },
    },
    {
      name: 'wines',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'wine',
          type: 'relationship',
          relationTo: 'flat-wine-variants' as CollectionSlug,
          required: true,
        },
      ],
      admin: { description: 'Wines included in this package.' },
    },
    {
      name: 'tastingNotes',
      type: 'textarea',
      localized: true,
      admin: { description: 'Frontend-facing tasting notes.' },
    },
    {
      name: 'adminMessage',
      type: 'richText',
      localized: true,
      admin: { description: 'Frontend-facing admin message.' },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users' as CollectionSlug,
      required: true,
      admin: { width: '50%' },
    },
  ],
  versions: {
    drafts: true,
  },
}
