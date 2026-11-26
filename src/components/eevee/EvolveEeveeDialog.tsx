import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EVOLUTIONS } from '@/game/eevee'
import { itemById, itemSpriteUrl } from '@/game/items'
import { useGame } from '@/game/store'

interface EvolveEeveeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EvolveEeveeDialog({ open, onOpenChange }: EvolveEeveeDialogProps) {
  const stockedItems = useGame((state) => state.stockedItems)
  const evolveEevee = useGame((state) => state.evolveEevee)
  const stocked = new Set(stockedItems)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>Evolve Eevee?</DialogTitle>
          <DialogDescription>Use a stocked stone. Evolution can’t be undone.</DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-1">
          {EVOLUTIONS.map((evolution) => {
            const stone = itemById(evolution.stone)
            const hasStone = stocked.has(evolution.stone)

            return (
              <li key={evolution.form}>
                <Button
                  variant="outline"
                  disabled={!hasStone}
                  onClick={() => {
                    evolveEevee(evolution.form)
                    onOpenChange(false)
                  }}
                  className="h-auto w-full justify-start gap-3 py-2"
                >
                  <img
                    src={itemSpriteUrl(stone)}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6 [image-rendering:pixelated]"
                  />
                  <span className="flex min-w-0 flex-col items-start">
                    <span className="truncate">
                      {stone.name} → {evolution.name}
                    </span>
                    {!hasStone && (
                      <span className="truncate text-xs font-normal text-muted-foreground">
                        Stock a {stone.name} first
                      </span>
                    )}
                  </span>
                </Button>
              </li>
            )
          })}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
