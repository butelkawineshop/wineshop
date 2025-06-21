import { CollectionPage } from '@/components/CollectionPage'

export default async function ProfilPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  return (
    <CollectionPage
      params={resolvedParams}
      searchParams={resolvedSearchParams}
      locale="sl"
      baseSegment="profil"
    />
  )
}
