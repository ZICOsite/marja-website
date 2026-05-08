'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts'
import { useId, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

type Item = {
  id?: string | null
  year?: string | null
  description?: string | null
  value1?: number | null
}

type Props = {
  heading?: string | null
  series1Label?: string | null
  items?: Item[] | null
}


const COLOR_TOP = '#60a5fa'
const COLOR_BOT = '#3b82f6'

export function MarketingAnalysisBlockComponent({ heading, series1Label, items }: Props) {
  const uid = useId()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const t = useTranslations('marketingAnalysis')
  const gradId = `grad-${uid}`

  const validItems = (items ?? []).filter((i): i is Item => !!i.year)
  const key1 = series1Label || 'Метрика 1'
  const chartData = validItems.map((item) => ({
    year: item.year,
    [key1]: item.value1 ?? 0,
  }))

  return (
    <section className="py-24 bg-background">
      <div className="container">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-12">{heading}</h2>
        )}

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-2/5 space-y-10">
            {validItems.map((item, i) => (
              <div key={item.year ?? i}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl font-bold font-heading text-[var(--primary)] leading-none">
                    {item.year}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                    {t('year')}
                  </span>
                </div>
                <div className="h-px bg-border mb-4" />
                {item.description && (
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                )}
              </div>
            ))}
          </div>

          <div className="w-full lg:w-3/5 rounded-3xl border border-border bg-card p-6 md:p-8 sticky top-30">
            <div className="h-72 lg:h-80">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={chartData} barCategoryGap="40%" margin={{ top: 24, right: 8, left: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLOR_TOP} />
                        <stop offset="100%" stopColor={COLOR_BOT} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid stroke="#e2e8f0" strokeOpacity={0.8} strokeDasharray="4 4" />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={8}
                    />
                    <YAxis hide />

                    <Bar dataKey={key1} fill={`url(#${gradId})`} radius={[6, 6, 6, 6]} maxBarSize={60}>
                      <LabelList
                        dataKey={key1}
                        position="top"
                        style={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ background: COLOR_BOT }} />
                <span className="text-sm text-muted-foreground">{key1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
