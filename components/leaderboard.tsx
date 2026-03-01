"use client"

import { useState, useEffect } from "react"
import { getGlobalTop10, type GlobalSpot } from "@/lib/firebase-rankings"
import { Loader2, RefreshCw } from "lucide-react"
import { forwardRef, useImperativeHandle } from "react"

interface GlobalLeaderboardProps {
  selectedSpot: number | null
  onSpotClick: (spotRank: number) => void
}

export interface GlobalLeaderboardRef {
  refresh: () => Promise<void>
}

export const GlobalLeaderboard = forwardRef<GlobalLeaderboardRef, GlobalLeaderboardProps>(
  function GlobalLeaderboard({ selectedSpot, onSpotClick }, ref) {
  const [topSpots, setTopSpots] = useState<GlobalSpot[] | null>(null)
  const [loading, setLoading] = useState(true)

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
          {topSpots && topSpots.length > 0 ? "Community top 10 · most ranked spots" : "Global leaderboard"}
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
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/30 text-xs font-bold text-primary">
                        {rank}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {spot.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {spot.location}
                      </p>
                      {"count" in spot && (
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {spot.count} user{(spot as { count: number }).count > 1 ? "s" : ""} ranked
                            </span>
                            {/* no average ranking available */}
                          </div>
                        </div>
                      )}
                      {/* global spot has no rating/vibe */}
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
                No global rankings yet
              </p>
              <p className="text-xs text-muted-foreground">
                Add spots to "My Rankings" to build the community leaderboard
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