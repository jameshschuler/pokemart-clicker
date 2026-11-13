import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RequirementLineProps {
  met: boolean
  children: ReactNode
}

export function RequirementLine({ met, children }: RequirementLineProps) {
  return (
    <li className={cn('flex gap-1.5', met ? 'text-foreground' : 'text-muted-foreground')}>
      <span aria-hidden className="w-2.5 shrink-0">
        {met ? '✓' : '·'}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  )
}
