import { TastingPage } from '@/components/Tastings/TastingPage'
import { notFound } from 'next/navigation'

interface TastingsItemPageProps {
  params: Promise<{ slug: string }>
}

export default async function TastingsItemPage({ params }: TastingsItemPageProps) {
  const { slug } = await params

  if (!slug) {
    notFound()
  }

  return <TastingPage locale="en" slug={slug} />
}
