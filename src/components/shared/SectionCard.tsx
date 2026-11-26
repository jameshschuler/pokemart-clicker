import type { ReactNode } from 'react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SectionCardProps {
  title: string
  action: ReactNode
  flush?: boolean
  children: ReactNode
}

export function SectionCard({ title, action, flush = false, children }: SectionCardProps) {
  return (
    <Card size="sm" className="rounded-lg">
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        <CardAction className="tabular-nums">{action}</CardAction>
      </CardHeader>
      <CardContent className={flush ? 'px-0' : undefined}>{children}</CardContent>
    </Card>
  )
}
