import { cn } from '@/utilities/ui'

type Variant = 'm' | 'arc' | 'building' | 'building-full' | 'windows' | 'windows-block'

type Props = {
  variant: Variant
  className?: string
}

// Брендбук п. 5: фоновая графика из SVG дизайнера (public/*-navy.svg).
// SVG работает маской, цвет и прозрачность задаются классом text-*, например
// text-marja-navy/6 на светлом фоне или text-marja-white/8 на navy.
// Родитель должен быть relative и, как правило, overflow-hidden.
export const BrandGraphic = ({ variant, className }: Props) => (
  <div aria-hidden="true" className={cn('brand-graphic', `brand-graphic--${variant}`, className)} />
)
