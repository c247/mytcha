"use client"

import { useState, useCallback } from "react"
import { Search, MapPin, Loader2 } from "lucide-react"
import { searchPlaces, type GeoSearchResult } from "@/lib/geo-search"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface GeoSearchInputProps {
  onSelect: (result: GeoSearchResult) => void
  onCancel: () => void
  disabled?: boolean
}

export function GeoSearchInput({ onSelect, onCancel, disabled }: GeoSearchInputProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GeoSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const doSearch = useCallback(async () => {
    const q = query.trim()
    if (!q || q.length < 2) {
      setResults([])
      setHasSearched(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await searchPlaces(q, { limit: 8 })
      setResults(res)
      setHasSearched(true)
    } catch (e) {
      setError("Search failed. Try again.")
      setResults([])
      setHasSearched(true)
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      doSearch()
    } else if (e.key === "Escape") {
      onCancel()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search for a matcha spot (e.g. Stonemill Matcha SF)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
            disabled={disabled}
            autoFocus
          />
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={doSearch}
          disabled={loading || disabled}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Search"}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      {hasSearched && !loading && results.length === 0 && !error && (
        <p className="text-xs text-muted-foreground">
          No results found. Try &quot;Stonemill Matcha, San Francisco&quot; or add a city to your search.
        </p>
      )}
      {results.length > 0 && (
        <div className="border border-border rounded-lg divide-y divide-border max-h-48 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={`${r.lat}-${r.lng}-${i}`}
              type="button"
              onClick={() => onSelect(r)}
              className="w-full text-left px-3 py-2 hover:bg-accent/50 transition-colors flex items-start gap-2"
            >
              <MapPin className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {r.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {r.location}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
