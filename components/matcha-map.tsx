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
    <div className="h-full min-h-0 w-full px-8 py-4 md:px-12 md:py-6">
      <div className="grid h-full min-h-[70vh] grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        {/* Map panel */}
        <div className="min-h-[420px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <LeafletMap selectedSpot={selectedSpot} onSpotClick={handleSpotClick} displayMode={displayMode} uid={uid} />
        </div>

        {/* Combined leaderboard panel */}
        <div className="min-h-[420px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <CombinedLeaderboard
            selectedSpot={selectedSpot}
            onSpotClick={handleSpotClick}
            uid={uid}
            onDisplayModeChange={setDisplayMode}
          />
        </div>
      </div>
    </div>
  )
}
