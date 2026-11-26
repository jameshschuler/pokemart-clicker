import { WrenchIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { debugCommands } from '@/game/debug'
import { formatMoney } from '@/game/format'
import {
  CELADON_FLOORS,
  isLocationOpen,
  LOCATIONS,
  PLAYABLE_LOCATIONS,
  shortFloorName,
  shortLocationName,
} from '@/game/locations'
import { useGame } from '@/game/store'
import { AWAY_PRESETS, MONEY_PRESETS } from './dev-presets'
import { DevToolsSection } from './DevToolsSection'

export function DevTools() {
  const { martsOwned, floorsOpen } = useGame(
    useShallow((state) => ({ martsOwned: state.martsOwned, floorsOpen: state.floorsOpen })),
  )
  const celadonOpen = isLocationOpen('celadon', martsOwned)

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            size="icon-lg"
            variant="outline"
            aria-label="Open dev tools"
            className="fixed right-4 bottom-4 z-40 size-11 bg-background shadow-sm"
          />
        }
      >
        <WrenchIcon className="size-5" />
      </DialogTrigger>
      <DialogContent className="rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dev tools</DialogTitle>
          <DialogDescription>Playtesting shortcuts. Dev builds only.</DialogDescription>
        </DialogHeader>

        <DevToolsSection title="Add money">
          {MONEY_PRESETS.map((amount) => (
            <Button
              key={amount}
              size="sm"
              variant="outline"
              onClick={() => debugCommands.addMoney(amount)}
              className="font-mono"
            >
              +₽{formatMoney(amount)}
            </Button>
          ))}
        </DevToolsSection>

        <DevToolsSection title="Locations open">
          {LOCATIONS.slice(0, PLAYABLE_LOCATIONS).map((location, index) => (
            <Button
              key={location.id}
              size="sm"
              variant={index < martsOwned ? 'secondary' : 'outline'}
              aria-pressed={index + 1 === martsOwned}
              onClick={() => debugCommands.openMarts(index + 1)}
            >
              {shortLocationName(location)}
            </Button>
          ))}
        </DevToolsSection>

        <DevToolsSection title="Department Store floors">
          {CELADON_FLOORS.map((floor, index) => (
            <Button
              key={floor.name}
              size="sm"
              variant={index < floorsOpen ? 'secondary' : 'outline'}
              aria-pressed={index + 1 === floorsOpen}
              disabled={!celadonOpen}
              onClick={() => debugCommands.openFloors(index + 1)}
            >
              {shortFloorName(floor)}
            </Button>
          ))}
        </DevToolsSection>

        <DevToolsSection title="Time away (15m or more shows the welcome back report)">
          {AWAY_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              size="sm"
              variant="outline"
              onClick={() => debugCommands.away(preset.seconds)}
            >
              {preset.label}
            </Button>
          ))}
        </DevToolsSection>
      </DialogContent>
    </Dialog>
  )
}
