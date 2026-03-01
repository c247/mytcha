"use client"

import { useState, useEffect } from "react"
import { matchaSpots, MatchaSpot } from "@/lib/matcha-spots"
import { Grip, Trash2, MapPin, Save, AlertCircle, CheckCircle } from "lucide-react"
import {
  subscribeMyRankings,
  addRanking,
  updateRanking,
  deleteRanking,
  Ranking,
  RankingData,
} from "@/lib/firebase-rankings"
import { GeoSearchInput } from "@/components/geo-search-input"
import type { GeoSearchResult } from "@/lib/geo-search"

interface UserLeaderboardProps {
  selectedSpot: number | null
  onSpotClick: (spotRank: number) => void
  uid: string
}

export function UserLeaderboard({ selectedSpot, onSpotClick, uid }: UserLeaderboardProps) {
  const [userRankings, setUserRankings] = useState<Ranking[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showGeoSearch, setShowGeoSearch] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Subscribe to user rankings from Firebase
  useEffect(() => {
    setMounted(true)
    const unsubscribe = subscribeMyRankings(uid, (rankings) => {
      setUserRankings(rankings)
    })
    return () => unsubscribe()
  }, [uid])

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnItem = async (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newRankings = [...userRankings]
    const draggedItem = newRankings[draggedIndex]
    newRankings.splice(draggedIndex, 1)
    newRankings.splice(dropIndex, 0, draggedItem)

    // Update ranking positions in Firebase
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      for (let i = 0; i < newRankings.length; i++) {
        await updateRanking(uid, newRankings[i].id, { ranking: i + 1 })
      }
      setSuccess("Changes saved!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update rankings"
      setError(errorMsg)
      console.error("Failed to update rankings:", err)
    }
    setLoading(false)
    setDraggedIndex(null)
  }

  const handleDeleteRanking = async (rankingId: string) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      // find ranking details to decrement global count
      const ranking = userRankings.find((r) => r.id === rankingId)
      if (ranking) {
        await deleteRanking(uid, rankingId)
        // decrement global counter
        try {
          // import dynamically to avoid circular
          const { decrementGlobalSpot } = await import("@/lib/firebase-rankings")
          await decrementGlobalSpot({ name: ranking.name, location: ranking.location })
        } catch (e) {
          // ignore errors updating global
          console.error("Failed to decrement global spot", e)
        }
      } else {
        await deleteRanking(uid, rankingId)
      }
      setSuccess("Spot removed!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete ranking"
      setError(errorMsg)
      console.error("Failed to delete ranking:", err)
    }
    setLoading(false)
  }

  const handleAddSpotFromMatcha = async (spot: MatchaSpot) => {
    if (!userRankings.find((r) => r.name === spot.name && r.location === spot.location)) {
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const rankingData: RankingData = {
          name: spot.name,
          location: spot.location,
          ranking: userRankings.length + 1,
          lat: spot.lat,
          lng: spot.lng,
        }
        await addRanking(uid, rankingData)
        setSuccess("Spot added! Changes saved automatically.")
        setTimeout(() => setSuccess(null), 3000)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to add ranking"
        setError(errorMsg)
        console.error("Failed to add ranking:", err)
      }
      setLoading(false)
    }
    setShowAddMenu(false)
  }

  const handleAddSpotFromGeoSearch = async (result: GeoSearchResult) => {
    if (!userRankings.find((r) => r.name === result.name && r.location === result.location)) {
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const rankingData: RankingData = {
          name: result.name,
          location: result.location,
          ranking: userRankings.length + 1,
          lat: result.lat,
          lng: result.lng,
        }
        await addRanking(uid, rankingData)
        setShowGeoSearch(false)
        setSuccess("Spot added! Changes saved automatically.")
        setTimeout(() => setSuccess(null), 3000)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to add ranking"
        setError(errorMsg)
        console.error("Failed to add ranking:", err)
      }
      setLoading(false)
    }
  }

  // No curated spots - users add via geo search
  const availableSpots: MatchaSpot[] = []

  if (!mounted) return null

  return (
    <div className="flex flex-col h-full">
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-destructive/20 border-b border-destructive/30 px-3 py-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-950/30 border-b border-green-200 dark:border-green-900/50 px-3 py-2 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 flex-shrink-0" />
          <p className="text-xs text-green-600 dark:text-green-500">{success}</p>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border p-3 bg-accent/10">
        <p className="text-xs text-muted-foreground">
          {userRankings.length} spots · Drag to reorder
        </p>
      </div>

      {/* Rankings List */}
      <div className="flex-1 overflow-y-auto">
        {userRankings.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <div>
              <p className="text-sm text-muted-foreground">No rankings yet</p>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="text-xs text-primary hover:underline font-semibold mt-2"
              >
                Add your first spot
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {userRankings.map((ranking, index) => (
              <div
                key={ranking.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDropOnItem(index)}
                className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 cursor-move ${
                  draggedIndex === index ? "opacity-50 bg-accent/30" : "hover:bg-accent/50"
                } ${
                  selectedSpot === ranking.ranking
                    ? "bg-primary/20 border border-primary"
                    : "bg-accent/30 border border-border"
                }`}
              >
                <Grip className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/30 text-xs font-bold text-primary flex-shrink-0">
                  {ranking.ranking}
                </div>

                <button
                  onClick={() => onSpotClick(ranking.ranking)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="font-semibold text-foreground text-sm truncate">
                    {ranking.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {ranking.location}
                  </p>
                </button>

                <button
                  onClick={() => handleDeleteRanking(ranking.id)}
                  disabled={loading}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 disabled:opacity-50"
                  aria-label="Delete ranking"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add button */}
      <div className="border-t border-border p-3 bg-accent/20 space-y-3">
        {showGeoSearch ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Add by location search</span>
              <button
                onClick={() => setShowGeoSearch(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <GeoSearchInput
              onSelect={handleAddSpotFromGeoSearch}
              onCancel={() => setShowGeoSearch(false)}
              disabled={loading}
            />
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowGeoSearch(true)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <MapPin className="h-4 w-4" />
              Add Spot (Geo Search)
            </button>
          </>
        )}
      </div>
    </div>
  )
}
