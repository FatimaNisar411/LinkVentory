import { Button } from "@/components/ui/button"
import { Clock, SortAsc } from "lucide-react"

export type SortOption = "recent" | "alphabetical"

interface SortSelectorProps {
  selected: SortOption
  onSelect: (sortOption: SortOption) => void
}

export default function SortSelector({ selected, onSelect }: SortSelectorProps) {
  const sortOptions = [
    {
      value: "recent" as SortOption,
      label: "Recently Added",
      icon: Clock,
    },
    {
      value: "alphabetical" as SortOption,
      label: "A to Z",
      icon: SortAsc,
    },
  ]
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
      <div className="flex gap-1">
        {sortOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <Button
              key={option.value}
              variant={selected === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onSelect(option.value)}
              className="flex items-center gap-1.5"
            >
              <IconComponent className="h-3.5 w-3.5" />
              {option.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
