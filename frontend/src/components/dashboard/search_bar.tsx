import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  resultCount?: number
  totalCount?: number
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search links, notes...", 
  resultCount, 
  totalCount 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange("")
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-10 bg-background border-gray-200 focus:border-gray-400 transition-colors"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-gray-100"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
        {/* Search results count - only show when searching */}
      {value && resultCount !== undefined && totalCount !== undefined && (
        <div className="absolute top-full mt-1 left-0 text-xs text-muted-foreground">
          {resultCount === 0 
            ? "No results found" 
            : `Found ${resultCount} of ${totalCount} links`
          }
        </div>
      )}
    </div>
  )
}
