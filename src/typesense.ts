import Typesense from 'typesense'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'
import { logger } from '@/lib/logger'

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.TYPESENSE_PORT || '8108'),
      protocol: 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || '',
  connectionTimeoutSeconds: 2,
})

// Helper functions for search operations
export const search = {
  async healthCheck() {
    try {
      await typesenseClient.health.retrieve()
      return true
    } catch (error) {
      logger.error({ err: error }, 'Typesense Health Check Error')
      return false
    }
  },

  async search<T extends Record<string, unknown>>(
    collection: string,
    searchParameters: Record<string, unknown>,
  ): Promise<T[]> {
    try {
      const searchResults = await typesenseClient
        .collections(collection)
        .documents()
        .search(searchParameters)
      return searchResults.hits?.map((hit) => hit.document as unknown as T) || []
    } catch (error) {
      logger.error({ err: error, collection }, 'Typesense Search Error')
      return []
    }
  },

  async createCollection(schema: CollectionCreateSchema) {
    try {
      return await typesenseClient.collections().create(schema)
    } catch (error) {
      logger.error({ err: error, schema: schema.name }, 'Typesense Create Collection Error')
      throw error
    }
  },

  async createDocument<T extends Record<string, unknown>>(
    collection: string,
    document: T,
  ): Promise<T> {
    try {
      const result = await typesenseClient.collections(collection).documents().create(document)
      return result as unknown as T
    } catch (error) {
      logger.error({ err: error, collection }, 'Typesense Create Document Error')
      throw error
    }
  },

  async updateDocument<T extends Record<string, unknown>>(
    collection: string,
    documentId: string,
    document: Partial<T>,
  ): Promise<T> {
    try {
      const result = await typesenseClient
        .collections(collection)
        .documents(documentId)
        .update(document)
      return result as unknown as T
    } catch (error) {
      logger.error({ err: error, collection, documentId }, 'Typesense Update Document Error')
      throw error
    }
  },

  async deleteDocument(collection: string, documentId: string): Promise<void> {
    try {
      await typesenseClient.collections(collection).documents(documentId).delete()
    } catch (error) {
      logger.error({ err: error, collection, documentId }, 'Typesense Delete Document Error')
      throw error
    }
  },
}

export default typesenseClient
