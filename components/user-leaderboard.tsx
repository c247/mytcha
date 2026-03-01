"use client"

import { useState, useEffect } from "react"
import { Grip, Trash2, MapPin, AlertCircle, CheckCircle, Sparkles, Save } from "lucide-react"
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
import { getOrCreateCupColors } from "@/lib/pastel-cups"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { isInBayArea } from "@/lib/bay-area"

interface UserLeaderboardProps {
  selectedSpot: number | null
  onSpotClick: (spotRank: number) => void
  uid: string
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

export function UserLeaderboard({ selectedSpot, onSpotClick, uid }: UserLeaderboardProps) {
  const [userRankings, setUserRankings] = useState<Ranking[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false)
  const [showGeoSearch, setShowGeoSearch] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [cupColors, setCupColors] = useState<Record<string, string>>({})

  // Subscribe to user rankings from Firebase
  useEffect(() => {
    setMounted(true)
    const unsubscribe = subscribeMyRankings(uid, (rankings) => {
      if (!hasUnsavedOrder) {
        setUserRankings(rankings)
      }
    })
    return () => unsubscribe()
  }, [uid, hasUnsavedOrder])

  useEffect(() => {
    const keys = userRankings.map((r) => r.id)
    setCupColors(getOrCreateCupColors(`mytcha-cups-${uid}`, keys))
  }, [uid, userRankings])

  const handleDragStart = (index: number) => {
    setError(null)
    setSuccess(null)
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragOverItem = (overIndex: number) => {
    if (draggedIndex === null || draggedIndex === overIndex) return

    const newRankings = [...userRankings]
    const draggedItem = newRankings[draggedIndex]
    newRankings.splice(draggedIndex, 1)
    newRankings.splice(overIndex, 0, draggedItem)

    setUserRankings(newRankings)
    setDraggedIndex(overIndex)
    setHasUnsavedOrder(true)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleSaveOrder = async () => {
    if (!hasUnsavedOrder) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      for (let i = 0; i < userRankings.length; i++) {
        if (userRankings[i].ranking !== i + 1) {
          await updateRanking(uid, userRankings[i].id, { ranking: i + 1 })
        }
      }
      setUserRankings((prev) => prev.map((ranking, i) => ({ ...ranking, ranking: i + 1 })))
      setHasUnsavedOrder(false)
      setSuccess("Order saved!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save order"
      setError(errorMsg)
      console.error("Failed to save order:", err)
    } finally {
      setLoading(false)
    }
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

  const handleAddSpotFromGeoSearch = async (result: GeoSearchResult) => {
    if (!isInBayArea(result.lat, result.lng)) {
      setError("Only Bay Area spots can be added.")
      setSuccess(null)
      return
    }

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
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {userRankings.length} spots · Drag to reorder
          </p>
          <button
            onClick={handleSaveOrder}
            disabled={!hasUnsavedOrder || loading}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-3 w-3" />
            Save
          </button>
        </div>
        {hasUnsavedOrder && (
          <p className="mt-1 text-[11px] text-primary/90">Order changes are local until you save.</p>
        )}
      </div>

      {/* Rankings List */}
      <div className="flex-1 overflow-y-auto">
        {userRankings.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <div>
              <p className="text-sm text-muted-foreground">No rankings yet</p>
              <button
                onClick={() => setShowGeoSearch(true)}
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
                onDragEnter={() => handleDragOverItem(index)}
                onDragEnd={handleDragEnd}
                onDrop={handleDragEnd}
                className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 cursor-move ${
                  draggedIndex === index ? "scale-[1.01] bg-accent/30 shadow-md" : "hover:bg-accent/50"
                } ${
                  selectedSpot === ranking.ranking
                    ? "bg-primary/20 border border-primary"
                    : "bg-accent/30 border border-border"
                }`}
              >
                <Grip className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                <div
                  className="relative flex h-10 w-10 items-center justify-center flex-shrink-0"
                >
                  <img
                    src="/matcha.svg"
                    alt=""
                    className="h-9 w-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                    style={{ filter: getCupTint(cupColors[ranking.id] ?? "#FFE5EC") }}
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow">
                    {index + 1}
                  </span>
                </div>

                <button
                  onClick={() => onSpotClick(ranking.ranking)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="font-semibold text-foreground text-sm truncate">{ranking.name}</p>
                </button>

                <button
                  onClick={() => handleDeleteRanking(ranking.id)}
                  disabled={loading || hasUnsavedOrder}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 disabled:opacity-50"
                  aria-label="Delete ranking"
                  title={hasUnsavedOrder ? "Save order before removing spots" : "Delete ranking"}
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
        <button
          onClick={() => setShowGeoSearch(true)}
          disabled={loading || hasUnsavedOrder}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <MapPin className="h-4 w-4" />
          {hasUnsavedOrder ? "Save Order First" : "Add Spot"}
        </button>
      </div>

      <Dialog open={showGeoSearch} onOpenChange={setShowGeoSearch}>
        <DialogContent className="w-[min(92vw,48rem)] max-w-3xl overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-[#f6fff3] to-white p-5 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              Add a Matcha Spot
            </DialogTitle>
            <DialogDescription>
              Pick your next favorite cafe.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full overflow-hidden rounded-xl border border-primary/20 bg-white/80 p-3">
            <GeoSearchInput
              onSelect={handleAddSpotFromGeoSearch}
              onCancel={() => setShowGeoSearch(false)}
              disabled={loading}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
