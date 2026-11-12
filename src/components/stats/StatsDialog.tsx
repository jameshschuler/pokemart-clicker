import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LifetimeStats } from './LifetimeStats'

export function StatsDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button size="xs" variant="ghost" />}>Stats</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Lifetime stats</DialogTitle>
          <DialogDescription>Everything since you opened your first mart.</DialogDescription>
        </DialogHeader>
        <LifetimeStats />
      </DialogContent>
    </Dialog>
  )
}
