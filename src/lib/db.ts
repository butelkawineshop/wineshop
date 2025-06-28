import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg'
import { logger } from './logger'

/**
 * Database connection pool for direct PostgreSQL queries
 * Used for performance-critical queries that bypass Payload's query engine
 */
class DatabaseService {
  private pool: Pool | null = null

  /**
   * Initialize the database connection pool
   */
  private initializePool(): Pool {
    if (!this.pool) {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URI,
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
      })

      // Handle pool errors
      this.pool.on('error', (err: Error) => {
        logger.error({ err, context: 'database-pool' }, 'Unexpected error on idle client')
      })
    }

    return this.pool
  }

  /**
   * Execute a query with proper error handling and logging
   */
  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
    context?: string,
  ): Promise<QueryResult<T>> {
    const pool = this.initializePool()
    const startTime = Date.now()

    try {
      const result = await pool.query(text, params)
      const duration = Date.now() - startTime

      // Log slow queries
      if (duration > 1000) {
        logger.warn(
          { duration, context, query: text.substring(0, 100) },
          'Slow database query detected',
        )
      }

      return result
    } catch (error) {
      const duration = Date.now() - startTime
      logger.error(
        { err: error, duration, context, query: text.substring(0, 100) },
        'Database query failed',
      )
      throw error
    }
  }

  /**
   * Execute a transaction with proper error handling
   */
  async transaction<T>(callback: (client: PoolClient) => Promise<T>, context?: string): Promise<T> {
    const pool = this.initializePool()
    const client = await pool.connect()

    try {
      await client.query('BEGIN')
      const result = await callback(client)
      await client.query('COMMIT')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      logger.error({ err: error, context }, 'Database transaction failed')
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * Close the database connection pool
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
    }
  }
}

// Export a singleton instance
export const db = new DatabaseService()

// Export types for better type safety
export type { QueryResult, PoolClient }
