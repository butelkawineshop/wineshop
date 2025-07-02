import { KGBPage } from '@/components/KGB/KGBPage'

interface KGBProductPageProps {
  params: Promise<{ slug: string[] }>
}

export default async function KGBProductPage({ params }: KGBProductPageProps) {
  const { slug } = await params
  return <KGBPage locale="sl" slug={Array.isArray(slug) ? slug[0] : slug} />
}
