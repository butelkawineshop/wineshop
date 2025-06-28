import FilterSortBar from '@/components/FilterSortBar'

export default async function VinotekaPage({}: {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return (
    <div className="container-narrow">
      <FilterSortBar locale="sl" />
    </div>
  )
}
