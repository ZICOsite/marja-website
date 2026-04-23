'use client'

import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useId, useEffect, useState } from 'react'

type Item = {
  id?: string | null
  year?: string | null
  description?: string | null
  value1?: number | null
  value2?: number | null
}

type Props = {
  heading?: string | null
  series1Label?: string | null
  series2Label?: string | null
  items?: Item[] | null
}

type TooltipEntry = {
  dataKey?: string | number
  name?: string
  value?: number | string
  color?: string
}

type CustomTooltipProps = {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-background shadow-md px-3 py-2 text-sm min-w-[140px]">
      <p className="font-medium text-foreground mb-2">{String(label ?? '')}</p>
      {payload.map((entry) => (
        <div key={String(entry.dataKey)} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-semibold text-foreground tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const COLOR_1_TOP = '#bfdbfe'
const COLOR_1_BOT = '#93c5fd'
const COLOR_2_TOP = '#60a5fa'
const COLOR_2_BOT = '#3b82f6'

export function MarketingAnalysisBlockComponent({ heading, series1Label, series2Label, items }: Props) {
  const uid = useId()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const grad1 = `grad1-${uid}`
  const grad2 = `grad2-${uid}`

  const validItems = (items ?? []).filter((i): i is Item => !!i.year)
  const key1 = series1Label || 'Метрика 1'
  const key2 = series2Label || 'Метрика 2'
  const chartData = validItems.map((item) => ({
    year: item.year,
    [key1]: item.value1 ?? 0,
    [key2]: item.value2 ?? 0,
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
                    год
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
              {mounted && <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="40%" barGap={0}>
                  <defs>
                    <linearGradient id={grad1} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLOR_1_TOP} />
                      <stop offset="100%" stopColor={COLOR_1_BOT} />
                    </linearGradient>
                    <linearGradient id={grad2} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLOR_2_TOP} />
                      <stop offset="100%" stopColor={COLOR_2_BOT} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={8}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: COLOR_1_TOP, fillOpacity: 0.3, radius: 6 }}
                  />

                  <Bar dataKey={key1} stackId="a" fill={`url(#${grad1})`} radius={[0, 0, 6, 6]} maxBarSize={60} />
                  <Bar dataKey={key2} stackId="a" fill={`url(#${grad2})`} radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>}
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ background: COLOR_1_BOT }} />
                <span className="text-sm text-muted-foreground">{key1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ background: COLOR_2_BOT }} />
                <span className="text-sm text-muted-foreground">{key2}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
