import {
  Layers,
  TrendingUp,
  LayoutGrid,
  Gauge,
  Wrench,
  BarChart2,
  Target,
  Shuffle,
  Activity,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  layers: Layers,
  trendingUp: TrendingUp,
  layoutGrid: LayoutGrid,
  gauge: Gauge,
  wrench: Wrench,
  barChart: BarChart2,
  target: Target,
  shuffle: Shuffle,
  activity: Activity,
  shieldCheck: ShieldCheck,
}

type Tool = {
  id?: string | null
  icon?: string | null
  name: string
  title: string
  description: string
}

type Props = {
  heading?: string | null
  description?: string | null
  tools?: Tool[] | null
}

export function LeanToolsBlockComponent({ heading, description, tools }: Props) {
  const validTools = (tools ?? []).filter((t): t is Tool => !!t.name && !!t.title)

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-balance">
                {heading}
              </h2>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground leading-relaxed max-w-md">{description}</p>
          )}
        </div>

        {validTools.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {validTools.map((tool, i) => {
              const Icon = iconMap[tool.icon ?? ''] ?? Layers
              return (
                <div
                  key={i}
                  className="group p-7 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest block">
                        {tool.name}
                      </span>
                      <h3 className="font-semibold font-heading text-foreground leading-tight">
                        {tool.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
