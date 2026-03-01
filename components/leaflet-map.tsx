"use client"

import L, { LatLngExpression } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useState, useEffect, useRef, type MutableRefObject } from "react"
import { getGlobalTop10, subscribeMyRankings, type Ranking, type GlobalSpot } from "@/lib/firebase-rankings"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BAY_AREA_BOUNDS } from "@/lib/bay-area"

// Fix for Leaflet default icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl

function getPinTint(rank: number) {
  const tints = [
    "hue-rotate(-18deg) saturate(0.85) brightness(1.08)",
    "hue-rotate(-6deg) saturate(0.9) brightness(1.08)",
    "hue-rotate(8deg) saturate(0.9) brightness(1.08)",
    "hue-rotate(20deg) saturate(0.85) brightness(1.08)",
    "hue-rotate(48deg) saturate(0.9) brightness(1.05)",
    "hue-rotate(88deg) saturate(0.9) brightness(1.04)",
    "hue-rotate(130deg) saturate(0.95) brightness(1.03)",
    "hue-rotate(154deg) saturate(0.95) brightness(1.04)",
    "hue-rotate(174deg) saturate(0.95) brightness(1.05)",
  ]
  return tints[(Math.max(rank, 1) - 1) % tints.length]
}

function getPastelPinIcon(rank: number) {
  const tint = getPinTint(rank)
  return L.divIcon({
    className: "matcha-pin-div",
    html: `<img src="/matcha.svg" alt="" style="width:46px;height:46px;filter:${tint} drop-shadow(0 2px 3px rgba(0,0,0,0.25));" />`,
    iconSize: [46, 46],
    iconAnchor: [23, 40],
    popupAnchor: [0, -34],
  })
}

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
        className="text-left"
      >
        <span className="text-[12px] font-bold leading-snug text-primary">{spotName}</span>
      </button>
    </div>
  )
}

function MapBoundsController({ bayAreaBounds }: { bayAreaBounds: LatLngExpression[] }) {
  const map = useMap()
  const initialized = useRef(false)
  useEffect(() => {
    const bounds = L.latLngBounds(bayAreaBounds as any)
    map.setMaxBounds(bounds.pad(0.08))
    if (!initialized.current) {
      map.fitBounds(bounds, { padding: [18, 18] })
      initialized.current = true
    }
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
  const bayAreaCenter: LatLngExpression = [37.72, -122.25]
  const bayAreaBounds: LatLngExpression[] = BAY_AREA_BOUNDS

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
              icon={getPastelPinIcon(spotRank)}
              ref={(marker) => {
                markerRefs.current[spotRank] = marker
              }}
              eventHandlers={{
                click: () => onSpotClick(spotRank),
              }}
            >
              <Popup className="matcha-popup" minWidth={180} maxWidth={240} closeButton={false}>
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
            <DialogTitle className="text-primary">
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
