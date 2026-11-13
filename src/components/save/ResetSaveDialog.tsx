import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { clearSave } from '@/game/save'
import { useGame } from '@/game/store'

export function ResetSaveDialog() {
  const reset = useGame((state) => state.reset)
  const [open, setOpen] = useState(false)

  function handleReset() {
    clearSave()
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="xs" variant="ghost" />}>Reset save</DialogTrigger>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Reset your save?</DialogTitle>
          <DialogDescription>
            Your ₽, producers, upgrades, achievements and stats are wiped. This can't be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive" onClick={handleReset}>
            Reset save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
