import SearchPageComponent from '@/components/SearchPage'

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  return <SearchPageComponent locale="en" basePath="/en/search" />
}
