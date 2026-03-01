"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { CombinedLeaderboard } from "./combined-leaderboard"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

// Dynamically import the Leaflet map component to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })

export function MatchaMap() {
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null)
  const [uid, setUid] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [displayMode, setDisplayMode] = useState<"my" | "global">("my")

  useEffect(() => setMounted(true), [])

  // Track auth state for leaderboard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user?.uid ?? null))
    return () => unsub()
  }, [])

  // Sync selected spot with URL hash (#map-1, #map-2, ...)
  useEffect(() => {
    const readHash = () => {
      const m = typeof window !== "undefined" && window.location.hash.match(/^#map-(\d+)$/)
      if (m) setSelectedSpot(parseInt(m[1], 10))
    }
    readHash()
    window.addEventListener("hashchange", readHash)
    return () => window.removeEventListener("hashchange", readHash)
  }, [])

  const handleSpotClick = (spotRank: number) => {
    const isSelected = selectedSpot === spotRank
    setSelectedSpot(isSelected ? null : spotRank)
    if (typeof window !== "undefined") {
      window.location.hash = isSelected ? "#map" : `#map-${spotRank}`
    }
  }

  if (!mounted) return null

  return (
    <div className="w-full h-full min-h-[60vh] flex">
      {/* Map on the left - 2/3 width */}
      <div className="flex-1 min-h-0 min-w-0" style={{ flex: "2" }}>
        <LeafletMap selectedSpot={selectedSpot} onSpotClick={handleSpotClick} displayMode={displayMode} uid={uid} />
      </div>

      {/* Combined Leaderboard on the right - 1/3 width */}
      <div className="border-l border-border overflow-hidden bg-card" style={{ flex: "1" }}>
        <CombinedLeaderboard
          selectedSpot={selectedSpot}
          onSpotClick={handleSpotClick}
          uid={uid}
          onDisplayModeChange={setDisplayMode}
        />
      </div>
    </div>
  )
}

