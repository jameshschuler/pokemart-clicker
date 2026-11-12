import { cn } from '@/lib/utils'

interface TierPipsProps {
  earned: number
  total: number
}

export function TierPips({ earned, total }: TierPipsProps) {
  return (
    <span className="flex shrink-0 gap-1" aria-label={`${earned} of ${total} tiers`}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cn(
            'size-1.5 rounded-full',
            index < earned ? 'bg-primary' : 'bg-muted-foreground/30',
          )}
        />
      ))}
    </span>
  )
}
