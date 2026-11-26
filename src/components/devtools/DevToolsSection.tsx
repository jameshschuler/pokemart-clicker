import type { ReactNode } from 'react'

interface DevToolsSectionProps {
  title: string
  children: ReactNode
}

export function DevToolsSection({ title, children }: DevToolsSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-1">{children}</div>
    </section>
  )
}
