import { TastingPage } from '@/components/Tastings/TastingPage'
import { notFound } from 'next/navigation'

interface TejstingiItemPageProps {
  params: Promise<{ slug: string }>
}

export default async function TejstingiItemPage({ params }: TejstingiItemPageProps) {
  const { slug } = await params

  if (!slug) {
    notFound()
  }

  return <TastingPage locale="sl" slug={slug} />
}
