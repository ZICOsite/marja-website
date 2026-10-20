import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Параметры, оставшиеся от старого WooCommerce. Google проиндексировал URL вида
// /ru/products?add-to-cart=36 как дубли (GSC: «копия, канонический не выбран»).
// Срезаем их 301-м редиректом на чистый адрес; остальной query (utm, gclid) сохраняем.
const LEGACY_QUERY_PARAMS = ['add-to-cart']

export default function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl

  if (LEGACY_QUERY_PARAMS.some((key) => searchParams.has(key))) {
    const url = request.nextUrl.clone()
    for (const key of LEGACY_QUERY_PARAMS) url.searchParams.delete(key)
    return NextResponse.redirect(url, 301)
  }

  return intlMiddleware(request)
}

export const config = {
  // Match all paths except Next.js internals, Payload admin, API routes, and static files
  matcher: [
    '/((?!_next|next|.*\\..*|admin|api).*)',
  ],
}
