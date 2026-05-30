type Principle = {
  id?: string | null
  title: string
  description: string
}

type Props = {
  heading?: string | null
  description?: string | null
  principles?: Principle[] | null
}

export function LeanPrinciplesBlockComponent({ heading, description, principles }: Props) {
  const validPrinciples = (principles ?? []).filter(
    (p): p is Principle => !!p.title && !!p.description,
  )

  return (
    <section className="py-24 bg-sidebar-accent dark:bg-muted/20 overflow-hidden">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          {heading && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 text-balance">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
          )}
        </div>

        {validPrinciples.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {validPrinciples.map((principle, index) => (
              <div
                key={index}
                className="group relative bg-background dark:bg-card rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-7xl font-bold font-heading text-primary/8 dark:text-primary/50 group-hover:text-primary dark:group-hover:text-white leading-none mb-4 select-none transition-colors duration-300">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="w-8 h-0.5 bg-[var(--primary)] mb-4 group-hover:w-12 transition-all duration-300" />
                <h3 className="font-bold font-heading text-foreground group-hover:text-primary dark:group-hover:text-white mb-2 leading-snug font-sans transition-colors duration-300">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
