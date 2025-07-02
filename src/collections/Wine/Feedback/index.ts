import type { CollectionConfig } from 'payload'
import {
  queueWineVariantSyncAfterFeedbackChange,
  queueWineVariantSyncAfterFeedbackDelete,
} from './hooks/queueWineVariantSync'

export const WineFeedback: CollectionConfig = {
  slug: 'wine-feedback',
  admin: {
    useAsTitle: 'id',
    group: 'Wine',
    defaultColumns: ['wine', 'customer', 'feedback', 'createdAt'],
  },
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  hooks: {
    afterChange: [queueWineVariantSyncAfterFeedbackChange],
    afterDelete: [queueWineVariantSyncAfterFeedbackDelete],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: false,
      admin: {
        description: 'Optional relationship to a customer. Not required for anonymous feedback.',
      },
    },
    {
      name: 'wine',
      type: 'relationship',
      relationTo: 'flat-wine-variants',
      required: true,
      admin: {
        description: 'Required relationship to the wine variant being rated.',
      },
    },
    {
      name: 'feedback',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Like',
          value: 'like',
        },
        {
          label: 'Dislike',
          value: 'dislike',
        },
        {
          label: 'Meh',
          value: 'meh',
        },
      ],
      admin: {
        description: 'The type of feedback given for this wine.',
      },
    },
  ],
}
