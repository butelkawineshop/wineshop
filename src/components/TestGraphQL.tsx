'use client'

import { useFlatCollection, useFlatCollections } from '@/hooks/useGraphQL'
import type { Locale } from '@/constants/routes'

interface TestGraphQLProps {
  locale: Locale
}

export function TestGraphQL({ locale }: TestGraphQLProps) {
  // Test single collection query
  const {
    data: singleCollection,
    isLoading: singleLoading,
    error: singleError,
  } = useFlatCollection('test-slug', locale)

  // Test collections list query
  const {
    data: collections,
    isLoading: listLoading,
    error: listError,
  } = useFlatCollections('aroma', locale, 5, 1)

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">GraphQL Test Results</h2>

      <div className="mb-4">
        <h3 className="font-semibold">Single Collection Query:</h3>
        {singleLoading && <p>Loading single collection...</p>}
        {singleError && <p className="text-red-500">Error: {singleError.message}</p>}
        {singleCollection && (
          <pre className="text-xs bg-gray-100 p-2 rounded">
            {JSON.stringify(singleCollection, null, 2)}
          </pre>
        )}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Collections List Query:</h3>
        {listLoading && <p>Loading collections list...</p>}
        {listError && <p className="text-red-500">Error: {listError.message}</p>}
        {collections && (
          <pre className="text-xs bg-gray-100 p-2 rounded">
            {JSON.stringify(collections, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
