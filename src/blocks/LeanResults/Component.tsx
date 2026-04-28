import { ArrowRight, TrendingUp } from 'lucide-react'

type Stat = {
  id?: string | null
  value: string
  label: string
}

type Comparison = {
  id?: string | null
  metric: string
  before: string
  after: string
}

type Props = {
  heading?: string | null
  description?: string | null
  stats?: Stat[] | null
  comparisons?: Comparison[] | null
}

export function LeanResultsBlockComponent({ heading, description, stats, comparisons }: Props) {
  const validStats = (stats ?? []).filter((s): s is Stat => !!s.value && !!s.label)
  const validComparisons = (comparisons ?? []).filter(
    (c): c is Comparison => !!c.metric && !!c.before && !!c.after,
  )

  return (
    <section className="py-24 bg-sidebar-accent dark:bg-muted/20">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          {heading && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 text-balance">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
          )}
        </div>

        {validStats.length > 0 && (
          <div className="bg-primary rounded-3xl p-8 md:p-12 mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {validStats.map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl md:text-5xl font-bold font-heading mb-2">
                    {stat.value}
                  </div>
                  <div className="text-blue-100 text-sm font-medium uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {validComparisons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validComparisons.map((comparison, i) => (
              <div
                key={i}
                className="bg-background dark:bg-card rounded-2xl border border-border p-6 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-medium">
                    {comparison.metric}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold line-through">
                      {comparison.before}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                      {comparison.after}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
