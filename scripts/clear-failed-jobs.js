import { payload } from 'payload'

async function clearFailedJobs() {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    })

    console.log('Clearing failed syncFlatWineVariant jobs...')

    // Clear failed jobs from the queue
    // This will depend on how Payload's job system stores jobs
    // Let's try to find and delete failed jobs

    // First, let's check what's in the jobs system
    const db = payload.db

    if (db.drizzle) {
      // Using Drizzle (PostgreSQL)
      const result = await db.drizzle.execute(`
        DELETE FROM payload_jobs 
        WHERE task_slug = 'syncFlatWineVariant' 
        AND has_error = true
      `)
      console.log(`Cleared ${result.rowCount || 0} failed jobs`)
    } else {
      console.log('Unable to clear jobs - unsupported database type')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error clearing jobs:', error)

    // Fallback: try to use payload's job API if available
    try {
      // This might not work depending on Payload version
      if (payload.jobs && payload.jobs.clear) {
        await payload.jobs.clear()
        console.log('Cleared all jobs using payload.jobs.clear()')
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
    }

    process.exit(1)
  }
}

clearFailedJobs()
