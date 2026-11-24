import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RequirementLineProps {
  met: boolean
  children: ReactNode
}

export function RequirementLine({ met, children }: RequirementLineProps) {
  return (
    <li className={cn('min-w-0', met ? 'text-foreground' : 'text-muted-foreground')}>
      {children}
      {met && <span aria-hidden> ✓</span>}
      <span className="sr-only">{met ? ' (met)' : ' (not met yet)'}</span>
    </li>
  )
}
