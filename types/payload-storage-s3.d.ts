import '@payloadcms/storage-s3'

declare module '@payloadcms/storage-s3' {
  export interface S3StorageConfig {
    collections: {
      media?: boolean | { adapter: any }
      invoices?: boolean | { adapter: any }
    }
  }
}
