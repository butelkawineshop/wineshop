import React from 'react'
import Link from 'next/link'
import { ROUTE_MAPPINGS, type RouteMapping, type Locale } from '@/constants/routes'

interface CollectionLinkProps {
  collection: string
  slug: string
  locale: Locale
  children: React.ReactNode
  className?: string
}

export function CollectionLink({
  collection,
  slug,
  locale,
  children,
  className,
}: CollectionLinkProps) {
  // Find the route segment for the collection
  const mappingEntry = Object.entries(ROUTE_MAPPINGS).find(
    ([, mapping]) => (mapping as RouteMapping).collection === collection,
  )
  const segment = mappingEntry
    ? (mappingEntry[1] as RouteMapping)[locale as 'en' | 'sl']
    : collection

  // English routes are always prefixed with /en, Slovenian are not
  const prefix = locale === 'en' ? `/en` : ''
  const href = `${prefix}/${segment}/${slug}`

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
