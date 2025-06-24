import payload from 'payload'
import config from '../src/payload.config.ts'

async function clearAllSyncJobs() {
  try {
    await payload.init({
      config,
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    })

    console.log('Clearing all syncFlatWineVariant jobs...')

    // Clear all jobs from the queue using the database directly
    const db = payload.db

    if (db.drizzle) {
      // Using Drizzle (PostgreSQL)
      const result = await db.drizzle.execute(`
        DELETE FROM payload_jobs 
        WHERE task_slug = 'syncFlatWineVariant'
      `)
      console.log(`Cleared ${result.rowCount || 0} jobs`)
    } else {
      console.log('Unable to clear jobs - unsupported database type')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error clearing jobs:', error)
    process.exit(1)
  }
}

clearAllSyncJobs()
