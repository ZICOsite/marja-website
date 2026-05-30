'use client'

import { useEffect, useRef, useState } from 'react'
import type { StatsBlock as StatsBlockProps } from '@/payload-types'

// Parse a value string like "1200+", "98%", "3.5K", "$500M" into parts
function parseValue(raw: string): { prefix: string; number: number; suffix: string } {
  const prefixMatch = raw.match(/^([^0-9]*)/)
  const prefix = prefixMatch ? prefixMatch[1] : ''
  const rest = raw.slice(prefix.length)

  const numMatch = rest.match(/^(\d+\.?\d*)/)
  if (!numMatch) return { prefix, number: 0, suffix: rest }

  let number = parseFloat(numMatch[1])
  const suffix = rest.slice(numMatch[1].length)

  // Handle K/M multipliers in the suffix
  if (suffix.startsWith('K') || suffix.startsWith('k')) {
    number *= 1000
    return { prefix, number, suffix: suffix.slice(1) }
  }
  if (suffix.startsWith('M') || suffix.startsWith('m')) {
    number *= 1_000_000
    return { prefix, number, suffix: suffix.slice(1) }
  }

  return { prefix, number, suffix }
}

function formatNumber(value: number, originalNumber: number): string {
  // If original had a decimal, show one decimal place
  if (!Number.isInteger(originalNumber)) {
    return value.toFixed(1)
  }
  // Add thousands separator for large numbers
  return Math.round(value).toLocaleString('en-US').replace(/,/g, ' ')
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

type CounterProps = {
  value: string
  duration?: number
  triggered: boolean
}

function AnimatedCounter({ value, duration = 1800, triggered }: CounterProps) {
  const { prefix, number, suffix } = parseValue(value)
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!triggered) return

    startTimeRef.current = null
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayed(0)

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)

      setDisplayed(eased * number)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [triggered, number, duration])

  return (
    <span>
      {prefix}
      {formatNumber(displayed, number)}
      {suffix}
    </span>
  )
}

type Props = {
  className?: string
} & StatsBlockProps

export const StatsBlock = ({ items }: Props) => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-primary dark:bg-blue-900 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
          {items?.map((item, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-bold font-heading mb-2">
                <AnimatedCounter value={item.value} triggered={triggered} />
              </div>
              <div className="text-blue-100 font-medium uppercase tracking-widest text-sm">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
