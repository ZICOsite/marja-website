import Link from 'next/link'
import { cn } from '@/utilities/ui'

type BreadcrumbItem = { label?: string | null; url?: string | null }

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  return (
    <nav
      className={cn('flex flex-wrap gap-1 items-center text-sm text-muted-foreground', className)}
    >
      {items.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="select-none">/</span>}
          {crumb.url ? (
            <Link href={crumb.url} className="hover:text-primary transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
