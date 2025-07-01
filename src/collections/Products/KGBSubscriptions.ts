import type { CollectionConfig, CollectionSlug } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const KGBSubscriptions: CollectionConfig = {
  slug: 'kgb-subscriptions',
  admin: {
    useAsTitle: 'customer',
    group: 'Products',
    defaultColumns: [
      'customer',
      'kgbProduct',
      'subscriptionStatus',
      'bottleQuantity',
      'price',
      'frequency',
      'nextDeliveryDate',
    ],
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
      index: true,
    },
    {
      name: 'kgbProduct',
      type: 'relationship',
      relationTo: 'kgb-products' as CollectionSlug,
      required: true,
      index: true,
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
      name: 'frequency',
      type: 'select',
      required: true,
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Bi-Monthly', value: 'bi-monthly' },
        { label: 'Quarterly', value: 'quarterly' },
      ],
      admin: { width: '50%' },
    },
    {
      name: 'subscriptionStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Trialing', value: 'trialing' },
      ],
      defaultValue: 'active',
      admin: { width: '50%' },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: { width: '50%' },
    },
    {
      name: 'nextDeliveryDate',
      type: 'date',
      admin: { width: '50%' },
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      admin: { width: '50%' },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: { width: '50%' },
    },
    {
      name: 'cancelAtPeriodEnd',
      type: 'checkbox',
      admin: { width: '50%' },
    },
    {
      name: 'pauseReason',
      type: 'textarea',
      admin: { width: '50%' },
    },
    {
      name: 'lastPaymentStatus',
      type: 'text',
      admin: { width: '50%' },
    },
    {
      name: 'log',
      type: 'array',
      fields: [
        { name: 'date', type: 'date', required: true },
        { name: 'subscriptionStatus', type: 'text', required: true },
        { name: 'reason', type: 'textarea' },
      ],
      admin: { description: 'Status change events.' },
    },
    {
      name: 'deliveryAddress',
      type: 'relationship',
      relationTo: 'addresses' as CollectionSlug,
      required: true,
      admin: { description: 'Delivery address for this subscription.' },
    },
  ],
  versions: {
    drafts: true,
  },
}
