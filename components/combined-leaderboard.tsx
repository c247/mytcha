"use client"

import { useState, useRef } from "react"
import { UserLeaderboard } from "./user-leaderboard"
import { GlobalLeaderboard, type GlobalLeaderboardRef } from "./leaderboard"
import { SearchRankings } from "./search-rankings"
import type { Ranking } from "@/lib/firebase-rankings"

interface CombinedLeaderboardProps {
  selectedSpot: number | null
  onSpotClick: (spotRank: number) => void
  uid: string | null
  onDisplayModeChange?: (mode: "my" | "global" | "search") => void
  onSearchRankingsChange?: (rankings: Ranking[]) => void
}

export function CombinedLeaderboard({
  selectedSpot,
  onSpotClick,
  uid,
  onDisplayModeChange,
  onSearchRankingsChange,
}: CombinedLeaderboardProps) {
  const [displayMode, setDisplayMode] = useState<"my" | "global" | "search">("my")
  const globalLeaderboardRef = useRef<GlobalLeaderboardRef>(null)

  const handleDisplayModeChange = (mode: "my" | "global" | "search") => {
    setDisplayMode(mode)
    onDisplayModeChange?.(mode)
    
    // Refresh global leaderboard when switching to it
    if (mode === "global" && globalLeaderboardRef.current) {
      globalLeaderboardRef.current.refresh()
    }
    if (mode !== "search") {
      onSearchRankingsChange?.([])
    }
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Toggle buttons */}
      <div className="flex items-center gap-0 border-b border-border bg-accent/20">
        <button
          onClick={() => handleDisplayModeChange("my")}
          className={`flex-1 px-3 py-3 text-xs font-semibold transition-all border-b-2 ${
            displayMode === "my"
              ? "bg-primary/10 text-primary border-b-primary"
              : "bg-transparent text-foreground border-b-transparent hover:bg-accent/30"
          }`}
        >
          My Rankings
        </button>
        <button
          onClick={() => handleDisplayModeChange("global")}
          className={`flex-1 px-3 py-3 text-xs font-semibold transition-all border-b-2 ${
            displayMode === "global"
              ? "bg-primary/10 text-primary border-b-primary"
              : "bg-transparent text-foreground border-b-transparent hover:bg-accent/30"
          }`}
        >
          Bay Top 10
        </button>
        <button
          onClick={() => handleDisplayModeChange("search")}
          className={`flex-1 px-3 py-3 text-xs font-semibold transition-all border-b-2 ${
            displayMode === "search"
              ? "bg-primary/10 text-primary border-b-primary"
              : "bg-transparent text-foreground border-b-transparent hover:bg-accent/30"
          }`}
        >
          Search
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {displayMode === "my" ? (
          uid ? (
            <UserLeaderboard
              selectedSpot={selectedSpot}
              onSpotClick={onSpotClick}
              uid={uid}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-center p-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Sign in to create your own rankings
                </p>
              </div>
            </div>
          )
        ) : displayMode === "global" ? (
          <GlobalLeaderboard ref={globalLeaderboardRef} selectedSpot={selectedSpot} onSpotClick={onSpotClick} />
        ) : (
          <SearchRankings
            selectedSpot={selectedSpot}
            onSpotClick={onSpotClick}
            onResultsChange={onSearchRankingsChange}
          />
        )}
      </div>
    </div>
  )
}
