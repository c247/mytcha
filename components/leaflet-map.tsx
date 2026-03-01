"use client"

import L, { LatLngExpression } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useState, useEffect, useRef, type MutableRefObject } from "react"
import { getGlobalTop10, subscribeMyRankings, type Ranking, type GlobalSpot } from "@/lib/firebase-rankings"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Fix for Leaflet default icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl

const matchaCupIcon = L.icon({
  iconUrl: "/matcha.svg",
  iconSize: [46, 46],
  iconAnchor: [23, 40],
  popupAnchor: [0, -34],
  className: "matcha-cup-pin",
})

interface LeafletMapProps {
  selectedSpot: number | null
  onSpotClick: (spotRank: number) => void
  displayMode: "my" | "global"
  uid: string | null
}

function MapPopupContent({
  spotName,
  onOpenDetails,
}: {
  spotName: string
  onOpenDetails: () => void
}) {
  return (
    <div className="text-sm">
      <button
        type="button"
        onClick={onOpenDetails}
        className="flex items-center gap-2 text-left"
      >
        <img src="/matcha.svg" alt="" className="h-7 w-7 shrink-0" />
        <span className="text-base font-bold text-primary">{spotName}</span>
      </button>
    </div>
  )
}

function MapBoundsController({ bayAreaBounds }: { bayAreaBounds: LatLngExpression[] }) {
  const map = useMap()
  useEffect(() => {
    map.setMaxBounds(L.latLngBounds(bayAreaBounds as any))
  }, [map, bayAreaBounds])
  return null
}

function MapSelectionController({
  selectedSpot,
  markerRefs,
  spotsLength,
}: {
  selectedSpot: number | null
  markerRefs: MutableRefObject<Record<number, L.Marker | null>>
  spotsLength: number
}) {
  const map = useMap()

  useEffect(() => {
    if (selectedSpot == null) return
    const marker = markerRefs.current[selectedSpot]
    if (!marker) return
    marker.openPopup()
    map.panTo(marker.getLatLng(), { animate: true })
  }, [map, markerRefs, selectedSpot, spotsLength])

  return null
}

export default function LeafletMap({ selectedSpot, onSpotClick, displayMode, uid }: LeafletMapProps) {
  const [myRankings, setMyRankings] = useState<Ranking[]>([])
  const [globalTop10, setGlobalTop10] = useState<GlobalSpot[]>([])
  const [loading, setLoading] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeSpot, setActiveSpot] = useState<{ name: string; location: string; rank: number } | null>(null)
  const markerRefs = useRef<Record<number, L.Marker | null>>({})

  // Subscribe to user's rankings when in "my" mode
  useEffect(() => {
    if (displayMode === "my" && uid) {
      const unsubscribe = subscribeMyRankings(uid, (rankings) => {
        setMyRankings(rankings)
      })
      return () => unsubscribe()
    } else {
      setMyRankings([])
    }
  }, [displayMode, uid])

  // Load global top 10 when in "global" mode
  useEffect(() => {
    if (displayMode === "global") {
      setLoading(true)
        getGlobalTop10()
        .then((spots) => {
          setGlobalTop10(spots)
        })
        .catch((err) => {
          console.error("Failed to load global top 10:", err)
          setGlobalTop10([])
        })
        .finally(() => setLoading(false))
    } else {
      setGlobalTop10([])
    }
  }, [displayMode])

  // Bay Area center and bounds
  const bayAreaCenter: LatLngExpression = [37.7749, -122.4194]
  const bayAreaBounds: LatLngExpression[] = [
    [37.25, -122.55],
    [38.15, -121.85],
  ]

  // Get the spots to display based on mode
  const spotsToDisplay = displayMode === "my" 
    ? myRankings.filter(r => r.lat != null && r.lng != null)
    : globalTop10.filter(s => s.lat != null && s.lng != null)

  const openSpotDetails = (name: string, location: string, rank: number) => {
    setActiveSpot({ name, location, rank })
    setDetailsOpen(true)
  }

  return (
    <div className="relative z-0 h-full min-h-[400px]">
      <MapContainer
        center={bayAreaCenter}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        minZoom={9}
        maxZoom={16}
      >
        <MapBoundsController bayAreaBounds={bayAreaBounds} />
        <MapSelectionController
          selectedSpot={selectedSpot}
          markerRefs={markerRefs}
          spotsLength={spotsToDisplay.length}
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/about-carto/">CARTO</a>'
        />
        
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-950 rounded-lg shadow-lg p-4 flex items-center gap-2 z-50">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        )}

        {spotsToDisplay.map((spot, index) => {
          const lat = spot.lat!
          const lng = spot.lng!
          const spotName = spot.name
          const spotLocation = spot.location
          const spotRank = displayMode === "my" 
            ? (spot as Ranking).ranking
            : (index + 1)

          return (
            <Marker
              key={`${spotName}-${spotLocation}-${index}`}
              position={[lat, lng]}
              icon={matchaCupIcon}
              ref={(marker) => {
                markerRefs.current[spotRank] = marker
              }}
              eventHandlers={{
                click: () => onSpotClick(spotRank),
              }}
            >
              <Popup className="matcha-popup" minWidth={260} maxWidth={320}>
                <MapPopupContent
                  spotName={spotName}
                  onOpenDetails={() => openSpotDetails(spotName, spotLocation, spotRank)}
                />
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-[#f6fff3] to-white p-5 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <img src="/matcha.svg" alt="" className="h-6 w-6" />
              {activeSpot ? `#${activeSpot.rank} ${activeSpot.name}` : "Matcha Spot"}
            </DialogTitle>
          </DialogHeader>
          {activeSpot && (
            <p className="text-sm text-muted-foreground leading-relaxed">{activeSpot.location}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
