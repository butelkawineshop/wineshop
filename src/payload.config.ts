// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { createWineDetailResolver } from './lib/server/wineDetailResolver'

import { Users } from './collections/Users/Users'
import { Customers } from './collections/Users/Customers'
import { Media } from './collections/Content/Media'
import { Invoices } from './collections/Ecommerce/Invoices'
import { WineCollections } from './collections/Wine'
import { CartCollections } from './collections/Ecommerce/Cart'
import { StockReservations } from './collections/Ecommerce/StockReservations'
import { Orders } from './collections/Ecommerce/Orders/index'
import { FlatCollections } from './collections/Flat'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Customers,
    Media,
    Invoices,
    ...CartCollections,
    StockReservations,
    Orders,
    ...WineCollections,
    ...FlatCollections,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  localization: {
    locales: ['sl', 'en'],
    defaultLocale: 'sl',
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
    queries: createWineDetailResolver(),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: true,
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // R2 storage for PDFs
    s3Storage({
      collections: {
        invoices: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET || '',
        },
        region: 'auto',
        endpoint: process.env.S3_ENDPOINT || '',
      },
    }),
  ],
  jobs: {
    tasks: [
      {
        slug: 'syncFlatWineVariant',
        handler: path.resolve(dirname, 'tasks/syncFlatWineVariant.ts') + '#syncFlatWineVariant',
        inputSchema: [
          {
            name: 'wineVariantId',
            type: 'text',
            required: true,
          },
        ],
        outputSchema: [
          {
            name: 'count',
            type: 'number',
          },
          {
            name: 'message',
            type: 'text',
          },
        ],
        retries: 2,
      },
      {
        slug: 'syncFlatCollection',
        handler: path.resolve(dirname, 'tasks/syncFlatCollection.ts') + '#syncFlatCollection',
        inputSchema: [
          {
            name: 'collectionId',
            type: 'text',
            required: true,
          },
        ],
        outputSchema: [
          {
            name: 'success',
            type: 'checkbox',
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'collectionId',
            type: 'text',
          },
        ],
        retries: 2,
      },
    ],
    workflows: [
      {
        slug: 'queueAllFlatWineVariants',
        handler:
          path.resolve(dirname, 'tasks/queueAllFlatWineVariants.ts') + '#queueAllFlatWineVariants',
        inputSchema: [],
      },
      {
        slug: 'queueAllFlatCollections',
        handler:
          path.resolve(dirname, 'tasks/queueAllFlatCollections.ts') + '#queueAllFlatCollections',
        inputSchema: [],
      },
    ],
    autoRun: [
      {
        cron: '*/5 * * * *',
        limit: 100,
        queue: 'syncFlatWineVariant',
      },
      {
        cron: '*/10 * * * *',
        limit: 50,
        queue: 'syncFlatCollection',
      },
      {
        cron: '0 3 * * *',
        limit: 1,
        queue: 'default',
      },
    ],
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      if (!defaultJobsCollection.admin) {
        defaultJobsCollection.admin = {}
      }

      defaultJobsCollection.admin.hidden = false
      return defaultJobsCollection
    },
  },
})
