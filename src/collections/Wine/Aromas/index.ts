import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { seoField } from '@/fields/seo'
import { queueRelatedWineVariants } from '@/tasks/queueRelatedWineVariants'
import { queueFlatCollectionSync } from '@/hooks/queueFlatCollectionSync'
import { queueFlatWineVariantSync } from '@/hooks/queueFlatWineVariantSync'

const { afterChange, afterDelete } = queueRelatedWineVariants('aroma')

export const Aromas: CollectionConfig = {
  slug: 'aromas',
  admin: {
    useAsTitle: 'title',
    group: 'Wine',
    defaultColumns: ['title', 'adjective', 'flavour', 'slug', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data?.slug && data?.adjective && data?.flavour) {
          try {
            // Get wine data with populated relationships
            const adjective = await req.payload.findByID({
              collection: 'adjectives',
              id: data.adjective,
              depth: 2,
              locale: req.locale,
            })

            const flavour = await req.payload.findByID({
              collection: 'flavours',
              id: data.flavour,
              depth: 2,
              locale: req.locale,
            })

            if (adjective && flavour) {
              // Generate title and slug
              const title = `${adjective.title} ${flavour.title}`
              const slug = `${adjective.slug}-${flavour.slug}`

              return {
                ...data,
                title,
                slug,
              }
            }
          } catch (error) {
            console.error('Error generating aroma title and slug:', error)
          }
        }
        return data
      },
    ],
    afterChange: [afterChange, queueFlatCollectionSync, queueFlatWineVariantSync],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Automatically generated from adjective and flavour',
      },
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Automatically generated from adjective and flavour slugs',
      },
    },
    {
      name: 'adjective',
      type: 'relationship',
      relationTo: 'adjectives',
      required: true,
      hasMany: false,
      index: true,
    },
    {
      name: 'flavour',
      type: 'relationship',
      relationTo: 'flavours',
      required: true,
      hasMany: false,
      index: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    seoField({
      titleField: 'title',
      imageField: 'media',
      imageSize: 'og',
    }),
  ],
  versions: {
    drafts: true,
  },
}
