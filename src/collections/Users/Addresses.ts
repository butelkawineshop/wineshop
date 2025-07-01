import type { CollectionConfig, CollectionSlug } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  admin: {
    useAsTitle: 'label',
    group: 'Users',
    defaultColumns: ['label', 'recipientName', 'city', 'country', 'isCompany'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers' as CollectionSlug,
      required: true,
      admin: { description: 'Owning customer.' },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Address label (e.g. Home, Office, Gift for Mom)' },
    },
    {
      name: 'recipientName',
      type: 'text',
      required: true,
      admin: { description: 'Full name of recipient.' },
    },
    {
      name: 'isCompany',
      type: 'checkbox',
      admin: { description: 'Is this a company address?' },
    },
    {
      name: 'companyName',
      type: 'text',
      admin: {
        description: 'Company name (if applicable).',
        condition: (data) => data?.isCompany === true,
      },
    },
    {
      name: 'vatNumber',
      type: 'text',
      admin: {
        description: 'VAT number (if applicable).',
        condition: (data) => data?.isCompany === true,
      },
    },
    {
      name: 'street',
      type: 'text',
      required: true,
      admin: { description: 'Street address.' },
    },
    {
      name: 'street2',
      type: 'text',
      admin: { description: 'Additional address info (optional).' },
    },
    {
      name: 'postalCode',
      type: 'text',
      required: true,
      admin: { description: 'Postal code.' },
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      admin: { description: 'City.' },
    },
    {
      name: 'region',
      type: 'text',
      admin: { description: 'Region/State/Province (optional).' },
    },
    {
      name: 'country',
      type: 'text',
      required: true,
      admin: { description: 'Country.' },
    },
    {
      name: 'phone',
      type: 'text',
      admin: { description: 'Phone number (optional).' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Delivery notes (optional).' },
    },
  ],
  versions: {
    drafts: true,
  },
}
