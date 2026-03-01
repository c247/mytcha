"use client"

import { useState, useCallback, useEffect } from "react"
import { matchaSpots, MatchaSpot } from "@/lib/matcha-spots"
import { Grip, Trash2, Plus } from "lucide-react"

interface UserLeaderboardProps {
  selectedSpot: number | null
  onSpotClick: (spotRank: number) => void
}

export function UserLeaderboard({ selectedSpot, onSpotClick }: UserLeaderboardProps) {
  const [userRankings, setUserRankings] = useState<MatchaSpot[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load user rankings from localStorage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("userRankings")
    if (saved) {
      try {
        const ids = JSON.parse(saved)
        const rankings = ids.map((rank: number) => matchaSpots.find(s => s.rank === rank)).filter(Boolean)
        setUserRankings(rankings)
      } catch {
        setUserRankings(getDefaultRankings())
      }
    } else {
      setUserRankings(getDefaultRankings())
    }
  }, [])

  // Save to localStorage whenever rankings change
  useEffect(() => {
    if (mounted && userRankings.length > 0) {
      localStorage.setItem("userRankings", JSON.stringify(userRankings.map(r => r.rank)))
    }
  }, [userRankings, mounted])

  function getDefaultRankings() {
    return [matchaSpots[4], matchaSpots[1], matchaSpots[3], matchaSpots[0], matchaSpots[2]]
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnItem = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newRankings = [...userRankings]
    const draggedItem = newRankings[draggedIndex]
    newRankings.splice(draggedIndex, 1)
    newRankings.splice(dropIndex, 0, draggedItem)

    setUserRankings(newRankings)
    setDraggedIndex(null)
  }

  const handleDeleteRanking = (index: number) => {
    const newRankings = userRankings.filter((_, i) => i !== index)
    setUserRankings(newRankings)
  }

  const handleAddSpot = (spot: MatchaSpot) => {
    if (!userRankings.find((r) => r.rank === spot.rank)) {
      setUserRankings([...userRankings, spot])
    }
    setShowAddMenu(false)
  }

  // Available spots to add
  const availableSpots = matchaSpots.filter(
    (spot) => !userRankings.find((r) => r.rank === spot.rank)
  )

  if (!mounted) return null

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="border-b border-border p-4 flex-shrink-0">
        <h3 className="text-lg font-bold text-foreground">My Rankings</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {userRankings.length} spots · Drag to reorder
        </p>
      </div>

      {/* Rankings List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-3">
          {userRankings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm mb-3">No rankings yet</p>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Add your first spot
              </button>
            </div>
          ) : (
            userRankings.map((spot, index) => {
              const isSelected = selectedSpot === spot.rank
              return (
                <div
                  key={`${spot.rank}-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropOnItem(index)}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 cursor-move ${
                    draggedIndex === index
                      ? "opacity-50 bg-accent/30"
                      : "hover:bg-accent/50"
                  } ${
                    isSelected
                      ? "bg-primary/20 border border-primary"
                      : "bg-accent/30 border border-border"
                  }`}
                >
                  <Grip className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                  <button
                    onClick={() => onSpotClick(spot.rank)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="font-semibold text-foreground text-sm truncate">
                      {spot.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {spot.location}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {spot.rating} ★
                      </span>
                      <span className="text-xs text-muted-foreground italic">
                        {spot.vibe}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDeleteRanking(index)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    aria-label="Delete ranking"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Add button */}
      <div className="border-t border-border p-3 bg-accent/20 flex-shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Spot
          </button>

          {/* Add menu dropdown */}
          {showAddMenu && availableSpots.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
              {availableSpots.map((spot) => (
                <button
                  key={spot.rank}
                  onClick={() => handleAddSpot(spot)}
                  className="w-full text-left px-3 py-2 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0"
                >
                  <p className="text-sm font-medium text-foreground">
                    {spot.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {spot.location}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {availableSpots.length === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            All spots added to your list
          </p>
        )}
      </div>
    </div>
  )
}
