import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const StockReservations: CollectionConfig = {
  slug: 'stock-reservations',
  admin: {
    useAsTitle: 'id',
    group: 'Ecommerce',
    defaultColumns: ['variant', 'quantity', 'expiresAt', 'status'],
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'wine-variants',
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
      max: 100,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'MMM d, yyyy HH:mm',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Expired',
          value: 'expired',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
      defaultValue: 'active',
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      admin: {
        condition: (data) => data?.status === 'completed',
      },
    },
    {
      name: 'cart',
      type: 'relationship',
      relationTo: 'active-carts',
      admin: {
        description: 'The cart this reservation belongs to',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set expiration time to 15 minutes from now if not provided
        if (!data.expiresAt) {
          data.expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }
        return data
      },
    ],
  },
}
