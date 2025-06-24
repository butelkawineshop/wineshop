const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000'

export const getPayloadClient = () => {
  return {
    async find({
      collection,
      where = {},
      depth = 0,
      page = 1,
      limit = 10,
      sort = '-createdAt',
      locale = 'all',
      fields,
    }: {
      collection: string
      where?: Record<string, unknown>
      depth?: number
      page?: number
      limit?: number
      sort?: string
      locale?: string
      fields?: string[]
    }) {
      const params = new URLSearchParams({
        depth: depth.toString(),
        page: page.toString(),
        limit: limit.toString(),
        sort,
        locale,
      })

      if (Object.keys(where).length > 0) {
        params.set('where', JSON.stringify(where))
      }

      if (fields && fields.length > 0) {
        for (const field of fields) {
          params.append('fields', field)
        }
      }

      const response = await fetch(`${PAYLOAD_API_URL}/api/${collection}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collection}: ${response.statusText}`)
      }

      return response.json() as Promise<{
        docs: Record<string, unknown>[]
        totalDocs: number
        totalPages: number
        page: number
        hasNextPage: boolean
        hasPrevPage: boolean
      }>
    },

    async findBySlug({
      collection,
      slug,
      depth = 0,
      locale = 'all',
    }: {
      collection: string
      slug: string
      depth?: number
      locale?: string
    }) {
      const params = new URLSearchParams({
        depth: depth.toString(),
        locale,
        where: JSON.stringify({
          slug: {
            equals: slug,
          },
        }),
      })

      const response = await fetch(`${PAYLOAD_API_URL}/api/${collection}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collection} by slug: ${response.statusText}`)
      }

      const data = await response.json()
      return data.docs[0]
    },

    async findOne({
      collection,
      where = {},
      depth = 0,
      locale = 'all',
    }: {
      collection: string
      where?: Record<string, unknown>
      depth?: number
      locale?: string
    }) {
      const params = new URLSearchParams({
        depth: depth.toString(),
        locale,
        limit: '1',
        where: JSON.stringify(where),
      })

      const response = await fetch(`${PAYLOAD_API_URL}/api/${collection}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collection}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.docs[0]
    },
  }
}
