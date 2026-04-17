import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all paths except Next.js internals, Payload admin, API routes, and static files
  matcher: [
    '/((?!_next|next|.*\\..*|admin|api).*)',
  ],
}
