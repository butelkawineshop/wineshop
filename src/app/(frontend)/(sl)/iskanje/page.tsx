import SearchPage from '@/components/SearchPage'

export default async function IskanjePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  return <SearchPage locale="sl" basePath="/iskanje" />
}
