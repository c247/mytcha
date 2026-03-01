"use client"

import { useState, useEffect } from "react"
import { getGlobalTop10, type GlobalSpot } from "@/lib/firebase-rankings"
import { Loader2, RefreshCw } from "lucide-react"
import { forwardRef, useImperativeHandle } from "react"
import { getOrCreateCupColors } from "@/lib/pastel-cups"

interface GlobalLeaderboardProps {
  selectedSpot: number | null
  onSpotClick: (spotRank: number) => void
}

export interface GlobalLeaderboardRef {
  refresh: () => Promise<void>
}

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

export const GlobalLeaderboard = forwardRef<GlobalLeaderboardRef, GlobalLeaderboardProps>(
  function GlobalLeaderboard({ selectedSpot, onSpotClick }, ref) {
  const [topSpots, setTopSpots] = useState<GlobalSpot[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [cupColors, setCupColors] = useState<Record<string, string>>({})

  const loadTopSpots = async () => {
    setLoading(true)
    try {
      console.log("Loading global top 10...")
      const spots = await getGlobalTop10()
      console.log("Global spots:", spots)
      setTopSpots(spots)
    } catch (e) {
      console.error("Failed to load global top 10:", e)
      setTopSpots([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopSpots()
  }, [])

  useEffect(() => {
    const keys = (topSpots ?? []).map((s) => `${s.name}|${s.location}`)
    setCupColors(getOrCreateCupColors("mytcha-cups-global", keys))
  }, [topSpots])

  // Use aggregated data from all users
  const spots = topSpots && topSpots.length > 0
    ? topSpots.map((s, i) => ({
        rank: i + 1,
        name: s.name,
        location: s.location,
        count: s.count,
      }))
    : []

  return (
    <div className="flex flex-col h-full">
      {/* Header with refresh button */}
      <div className="border-b border-border p-3 bg-accent/10 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {topSpots && topSpots.length > 0 ? "Bay top 10 matcha spots" : "Bay top 10"}
        </p>
        <button
          onClick={loadTopSpots}
          disabled={loading}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          title="Refresh rankings"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : topSpots && topSpots.length > 0 ? (
          <div className="space-y-2 p-3">
            {spots.map((spot, index) => {
              const rank = "rank" in spot ? spot.rank : index + 1
              const isSelected = selectedSpot === rank
              return (
                <button
                  key={`${spot.name}-${spot.location}-${index}`}
                  onClick={() => onSpotClick(rank)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/20 border border-primary"
                      : "bg-accent/30 border border-border hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div
                        className="relative flex h-12 w-12 items-center justify-center"
                      >
                        <img
                          src="/matcha.svg"
                          alt=""
                          className="h-11 w-11 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                          style={{ filter: getCupTint(cupColors[`${spot.name}|${spot.location}`] ?? "#FFE5EC") }}
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow">
                          {rank}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{spot.name}</p>
                      {/* bay top 10 only shows spot names */}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1 text-center p-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                No bay rankings yet
              </p>
              <p className="text-xs text-muted-foreground">
                Add spots to "My Rankings" to build the bay top 10
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  useImperativeHandle(ref, () => ({
    refresh: loadTopSpots,
  }))
}
)
