import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import type { FloorSection } from '@/game/towns'
import { FloorTrigger } from './FloorTrigger'
import { ItemList } from './ItemList'

interface FloorTabsProps {
  floors: FloorSection[]
}

export function FloorTabs({ floors }: FloorTabsProps) {
  return (
    <Tabs defaultValue={floors[0].name} orientation="vertical" className="items-start gap-4">
      <TabsList variant="line" className="w-40 shrink-0 items-stretch">
        {floors.map((floor) => (
          <FloorTrigger key={floor.name} floor={floor} />
        ))}
      </TabsList>
      {floors.map((floor) => (
        <TabsContent key={floor.name} value={floor.name} className="min-w-0">
          <ItemList items={floor.items} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
