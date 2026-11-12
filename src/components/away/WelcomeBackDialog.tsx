import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { OFFLINE_CAP_SECONDS, OFFLINE_RATE } from '@/game/economy'
import { formatDuration, formatMoney, formatPercent } from '@/game/format'
import { useGame } from '@/game/store'

export function WelcomeBackDialog() {
  const { report, dismiss } = useGame(
    useShallow((state) => ({ report: state.awayReport, dismiss: state.dismissAwayReport })),
  )

  return (
    <Dialog open={report !== undefined} onOpenChange={(open) => !open && dismiss()}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>
            Your shelves kept selling while you were away, at {formatPercent(OFFLINE_RATE)} of the
            usual rate for up to {formatDuration(OFFLINE_CAP_SECONDS)}.
          </DialogDescription>
        </DialogHeader>
        {report && (
          <dl className="flex flex-col gap-1.5 text-sm tabular-nums">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Time counted</dt>
              <dd>{formatDuration(report.seconds)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Earned</dt>
              <dd className="font-mono font-semibold">₽{formatMoney(report.earned)}</dd>
            </div>
          </dl>
        )}
        <DialogFooter>
          <Button onClick={dismiss}>Back to the counter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
