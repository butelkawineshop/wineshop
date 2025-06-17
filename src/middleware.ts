import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname starts with /en
  const pathnameHasEnglishLocale = pathname.startsWith('/en/') || pathname === '/en'

  // If it's already an English path, let it through
  if (pathnameHasEnglishLocale) return

  // If it's a static file or API route, let it through
  if (pathname.startsWith('/_next/') || pathname.startsWith('/api/') || pathname.includes('.')) {
    return
  }

  // For all other paths, they are considered Slovenian (no prefix needed)
  return NextResponse.next()
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
