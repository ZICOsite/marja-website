import * as React from 'react'
import { cn } from '@/utilities/ui'

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  pauseOnHover?: boolean
  direction?: 'left' | 'right'
  speed?: number
}

export function Marquee({
  children,
  pauseOnHover = false,
  direction = 'left',
  speed = 30,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden dark:bg-blue-100 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex w-max py-4',
          direction === 'right' ? 'animate-marquee-reverse' : 'animate-marquee',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        style={{ '--duration': `${speed}s` } as React.CSSProperties}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
