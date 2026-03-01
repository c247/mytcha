"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { getRankingsByUsername, type Ranking } from "@/lib/firebase-rankings"
import { getOrCreateCupColors } from "@/lib/pastel-cups"

interface SearchRankingsProps {
  selectedSpot: number | null
  onSpotClick: (spotRank: number) => void
  onResultsChange?: (rankings: Ranking[]) => void
}

export function SearchRankings({ selectedSpot, onSpotClick, onResultsChange }: SearchRankingsProps) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchedUser, setSearchedUser] = useState<string | null>(null)
  const [results, setResults] = useState<Ranking[]>([])
  const [cupColors, setCupColors] = useState<Record<string, string>>({})

  function getCupTint(color: string) {
    const tintMap: Record<string, string> = {
      "#FFE5EC": "hue-rotate(-18deg) saturate(0.85) brightness(1.08)",
      "#FDE2E4": "hue-rotate(-6deg) saturate(0.9) brightness(1.08)",
      "#FEECD2": "hue-rotate(8deg) saturate(0.9) brightness(1.08)",
      "#FFF1B6": "hue-rotate(20deg) saturate(0.85) brightness(1.08)",
      "#DFF7E2": "hue-rotate(48deg) saturate(0.9) brightness(1.05)",
      "#D9F2FF": "hue-rotate(88deg) saturate(0.9) brightness(1.04)",
      "#E3E0FF": "hue-rotate(130deg) saturate(0.95) brightness(1.03)",
      "#F0E4FF": "hue-rotate(154deg) saturate(0.95) brightness(1.04)",
      "#FFDFF5": "hue-rotate(174deg) saturate(0.95) brightness(1.05)",
    }
    return tintMap[color] ?? "hue-rotate(24deg) saturate(0.9) brightness(1.06)"
  }

  useEffect(() => {
    if (!searchedUser || results.length === 0) {
      setCupColors({})
      return
    }
    const keys = results.map((r) => r.id)
    setCupColors(getOrCreateCupColors(`mytcha-cups-search-${searchedUser}`, keys))
  }, [results, searchedUser])

  const handleSearch = async () => {
    const username = query.trim().toLowerCase()
    if (!username) return
    setLoading(true)
    setError(null)
    try {
      const rankings = await getRankingsByUsername(username)
      const normalized = rankings.map((r, i) => ({ ...r, ranking: i + 1 }))
      setResults(normalized)
      setSearchedUser(username)
      onResultsChange?.(normalized)
    } catch (e) {
      setResults([])
      setSearchedUser(null)
      setError("No user found with that ID.")
      onResultsChange?.([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-accent/10 p-3">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSearch()
              }
            }}
            placeholder="Search userid"
            className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex h-9 items-center gap-1 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Search className="h-3.5 w-3.5" />
            {loading ? "..." : "Find"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        {searchedUser && (
          <p className="mt-2 text-xs text-muted-foreground">Showing rankings for @{searchedUser}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {results.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">Search a userid to view their rankings.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((ranking) => (
              <button
                key={ranking.id}
                onClick={() => onSpotClick(ranking.ranking)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedSpot === ranking.ranking
                    ? "bg-primary/20 border border-primary"
                    : "bg-accent/30 border border-border hover:bg-accent/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center flex-shrink-0">
                    <img
                      src="/matcha.svg"
                      alt=""
                      className="h-11 w-11 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                      style={{ filter: getCupTint(cupColors[ranking.id] ?? "#FFE5EC") }}
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow">
                      {ranking.ranking}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{ranking.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
