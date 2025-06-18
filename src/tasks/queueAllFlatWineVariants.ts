import type { TaskHandler } from 'payload'
import { createLogger } from '../lib/logger'
import { handleError } from '../lib/errors'

export const queueAllFlatWineVariants: TaskHandler<'syncFlatWineVariant'> = async ({ req }) => {
  const logger = createLogger(req, {
    task: 'queueAllFlatWineVariants',
    operation: 'queue',
  })

  logger.info('Starting to queue all wine variants')

  try {
    const result = await req.payload.find({
      collection: 'wine-variants',
      limit: 1000,
      depth: 0,
    })

    logger.debug('Found wine variants', { count: result.docs.length })

    for (const variant of result.docs) {
      await req.payload.jobs.queue({
        task: 'syncFlatWineVariant',
        input: { wineVariantId: String(variant.id) },
      })
    }

    logger.info('Successfully queued all wine variants')
    return {
      output: {
        count: result.docs.length,
        message: 'Queued all wine variants for sync',
      },
    }
  } catch (error) {
    return handleError(req, error, {
      task: 'queueAllFlatWineVariants',
      operation: 'queue',
    })
  }
}
