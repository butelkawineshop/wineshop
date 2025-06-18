import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export function queueRelatedWineVariants(
  lookupField: 'wine' | 'winery' | 'region' | 'country' | 'aroma' | 'tag' | 'mood' | 'grapeVariety',
) {
  const afterChange: CollectionAfterChangeHook = async ({ req, doc }) => {
    if (!doc?.id) return

    try {
      let wineIds: string[] = []

      if (lookupField === 'wine') {
        wineIds = [String(doc.id)]
      } else if (lookupField === 'winery') {
        const wines = await req.payload.find({
          collection: 'wines',
          where: { winery: { equals: doc.id } },
          depth: 0,
        })
        wineIds = wines.docs.map((w) => String(w.id))
      } else if (lookupField === 'region') {
        const wines = await req.payload.find({
          collection: 'wines',
          where: { region: { equals: doc.id } },
          depth: 0,
        })
        wineIds = wines.docs.map((w) => String(w.id))
      } else if (lookupField === 'country') {
        const regions = await req.payload.find({
          collection: 'regions',
          where: { country: { equals: doc.id } },
          depth: 0,
        })
        const regionIds = regions.docs.map((r) => r.id)

        const wines = await req.payload.find({
          collection: 'wines',
          where: { region: { in: regionIds } },
          depth: 0,
        })
        wineIds = wines.docs.map((w) => String(w.id))
      } else if (['aroma', 'tag', 'mood'].includes(lookupField)) {
        // For aromas, tags, and moods, we need to find wine variants directly
        const wineVariants = await req.payload.find({
          collection: 'wine-variants',
          where: {
            [lookupField]: {
              equals: doc.id,
            },
          },
          depth: 0,
        })

        if (!wineVariants.totalDocs) {
          req.payload.logger?.info?.(
            `[queueRelatedWineVariants] No variants found for ${lookupField}:${doc.id}`,
          )
          return
        }

        await Promise.allSettled(
          wineVariants.docs.map((variant) =>
            req.payload.jobs.queue({
              task: 'syncFlatWineVariant',
              input: {
                wineVariantId: String(variant.id),
              },
            }),
          ),
        )
        return
      } else if (lookupField === 'grapeVariety') {
        // For grape varieties, we need to find wine variants that have this variety in their grapeVarieties array
        const wineVariants = await req.payload.find({
          collection: 'wine-variants',
          where: {
            'grapeVarieties.variety': {
              equals: doc.id,
            },
          },
          depth: 0,
        })

        if (!wineVariants.totalDocs) {
          req.payload.logger?.info?.(
            `[queueRelatedWineVariants] No variants found for ${lookupField}:${doc.id}`,
          )
          return
        }

        await Promise.allSettled(
          wineVariants.docs.map((variant) =>
            req.payload.jobs.queue({
              task: 'syncFlatWineVariant',
              input: {
                wineVariantId: String(variant.id),
              },
            }),
          ),
        )
        return
      }

      if (!wineIds.length) {
        req.payload.logger?.info?.(
          `[queueRelatedWineVariants] No wines found for ${lookupField}:${doc.id}`,
        )
        return
      }

      const wineVariants = await req.payload.find({
        collection: 'wine-variants',
        where: {
          wine: { in: wineIds },
        },
        depth: 0,
      })

      if (!wineVariants.totalDocs) {
        req.payload.logger?.info?.(
          `[queueRelatedWineVariants] No variants found for ${lookupField}:${doc.id}`,
        )
        return
      }

      await Promise.allSettled(
        wineVariants.docs.map((variant) =>
          req.payload.jobs.queue({
            task: 'syncFlatWineVariant',
            input: {
              wineVariantId: String(variant.id),
            },
          }),
        ),
      )
    } catch (err) {
      req.payload.logger?.error?.(
        `[queueRelatedWineVariants] Failed to queue jobs for ${lookupField}:${doc.id}`,
        err,
      )
    }
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ req, id }) => {
    if (!id) return

    try {
      let wineIds: string[] = []

      if (lookupField === 'wine') {
        wineIds = [String(id)]
      } else if (lookupField === 'winery') {
        const wines = await req.payload.find({
          collection: 'wines',
          where: { winery: { equals: id } },
          depth: 0,
        })
        wineIds = wines.docs.map((w) => String(w.id))
      } else if (lookupField === 'region') {
        const wines = await req.payload.find({
          collection: 'wines',
          where: { region: { equals: id } },
          depth: 0,
        })
        wineIds = wines.docs.map((w) => String(w.id))
      } else if (lookupField === 'country') {
        const regions = await req.payload.find({
          collection: 'regions',
          where: { country: { equals: id } },
          depth: 0,
        })
        const regionIds = regions.docs.map((r) => r.id)

        const wines = await req.payload.find({
          collection: 'wines',
          where: { region: { in: regionIds } },
          depth: 0,
        })
        wineIds = wines.docs.map((w) => String(w.id))
      } else if (['aroma', 'tag', 'mood'].includes(lookupField)) {
        // For aromas, tags, and moods, we need to find wine variants directly
        const wineVariants = await req.payload.find({
          collection: 'wine-variants',
          where: {
            [lookupField]: {
              equals: id,
            },
          },
          depth: 0,
        })

        if (!wineVariants.totalDocs) {
          req.payload.logger?.info?.(
            `[queueRelatedWineVariants] No variants found for ${lookupField}:${id}`,
          )
          return
        }

        await Promise.allSettled(
          wineVariants.docs.map((variant) =>
            req.payload.jobs.queue({
              task: 'syncFlatWineVariant',
              input: {
                wineVariantId: String(variant.id),
              },
            }),
          ),
        )
        return
      } else if (lookupField === 'grapeVariety') {
        // For grape varieties, we need to find wine variants that have this variety in their grapeVarieties array
        const wineVariants = await req.payload.find({
          collection: 'wine-variants',
          where: {
            'grapeVarieties.variety': {
              equals: id,
            },
          },
          depth: 0,
        })

        if (!wineVariants.totalDocs) {
          req.payload.logger?.info?.(
            `[queueRelatedWineVariants] No variants found for ${lookupField}:${id}`,
          )
          return
        }

        await Promise.allSettled(
          wineVariants.docs.map((variant) =>
            req.payload.jobs.queue({
              task: 'syncFlatWineVariant',
              input: {
                wineVariantId: String(variant.id),
              },
            }),
          ),
        )
        return
      }

      if (!wineIds.length) {
        req.payload.logger?.info?.(
          `[queueRelatedWineVariants] No wines found for ${lookupField}:${id}`,
        )
        return
      }

      const wineVariants = await req.payload.find({
        collection: 'wine-variants',
        where: {
          wine: { in: wineIds },
        },
        depth: 0,
      })

      if (!wineVariants.totalDocs) {
        req.payload.logger?.info?.(
          `[queueRelatedWineVariants] No variants found for ${lookupField}:${id}`,
        )
        return
      }

      await Promise.allSettled(
        wineVariants.docs.map((variant) =>
          req.payload.jobs.queue({
            task: 'syncFlatWineVariant',
            input: {
              wineVariantId: String(variant.id),
            },
          }),
        ),
      )
    } catch (err) {
      req.payload.logger?.error?.(
        `[queueRelatedWineVariants] Failed to queue jobs for ${lookupField}:${id}`,
        err,
      )
    }
  }

  return { afterChange, afterDelete }
}
