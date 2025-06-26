import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'

async function clearFailedJobs(): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    console.log('🔍 Finding failed syncFlatWineVariant jobs...')

    // Find all failed jobs for syncFlatWineVariant
    const failedJobs = await payload.find({
      collection: 'payload-jobs',
      where: {
        and: [
          {
            taskSlug: {
              equals: 'syncFlatWineVariant',
            },
          },
          {
            hasError: {
              equals: true,
            },
          },
        ],
      },
      limit: 1000, // Get all failed jobs
    })

    console.log(`📊 Found ${failedJobs.docs.length} failed jobs`)

    if (failedJobs.docs.length === 0) {
      console.log('✅ No failed jobs to clear')
      return
    }

    // Delete each failed job
    for (const job of failedJobs.docs) {
      await payload.delete({
        collection: 'payload-jobs',
        id: job.id,
      })
      console.log(`🗑️  Deleted job ${job.id}`)
    }

    console.log(`✅ Successfully cleared ${failedJobs.docs.length} failed jobs`)

    // Also clear any pending jobs that might be stuck
    const pendingJobs = await payload.find({
      collection: 'payload-jobs',
      where: {
        and: [
          {
            taskSlug: {
              equals: 'syncFlatWineVariant',
            },
          },
          {
            completedAt: {
              exists: false,
            },
          },
          {
            hasError: {
              equals: false,
            },
          },
        ],
      },
      limit: 1000,
    })

    console.log(`📊 Found ${pendingJobs.docs.length} pending jobs`)

    if (pendingJobs.docs.length > 0) {
      for (const job of pendingJobs.docs) {
        await payload.delete({
          collection: 'payload-jobs',
          id: job.id,
        })
        console.log(`🗑️  Deleted pending job ${job.id}`)
      }

      console.log(`✅ Successfully cleared ${pendingJobs.docs.length} pending jobs`)
    }

    console.log('🎉 All syncFlatWineVariant jobs cleared!')
  } catch (error) {
    console.error('❌ Error clearing jobs:', error)
    process.exit(1)
  }
}

clearFailedJobs()
