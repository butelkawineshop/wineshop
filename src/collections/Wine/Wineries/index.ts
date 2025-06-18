import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'

export const Wineries: CollectionConfig = {
  slug: 'wineries',
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
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'wineryCode',
      type: 'text',
      required: true,
      unique: true,
      minLength: 4,
      maxLength: 4,
      admin: {
        position: 'sidebar',
      },
    },
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
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'Tags, farming practices, etc.',
      },
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram Handle',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website URL',
        },
      ],
    },
    {
      name: 'relatedWineries',
      type: 'relationship',
      relationTo: 'wineries',
      hasMany: true,
      admin: {
        description: 'Other wineries run by the same people or under the same ownership',
      },
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
