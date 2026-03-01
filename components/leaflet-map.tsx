"use client"

import L, { LatLngExpression } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useState, useEffect } from "react"
import { getGlobalTop10, subscribeMyRankings, type Ranking, type GlobalSpot } from "@/lib/firebase-rankings"
import { Loader2 } from "lucide-react"

// Fix for Leaflet default icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

interface LeafletMapProps {
  selectedSpot: number | null
  onSpotClick: (spotRank: number) => void
  displayMode: "my" | "global"
  uid: string | null
}

function MapBoundsController({ bayAreaBounds }: { bayAreaBounds: LatLngExpression[] }) {
  const map = useMap()
  useEffect(() => {
    map.setMaxBounds(L.latLngBounds(bayAreaBounds as any))
  }, [map, bayAreaBounds])
  return null
}

export default function LeafletMap({ selectedSpot, onSpotClick, displayMode, uid }: LeafletMapProps) {
  const [myRankings, setMyRankings] = useState<Ranking[]>([])
  const [globalTop10, setGlobalTop10] = useState<GlobalSpot[]>([])
  const [loading, setLoading] = useState(false)

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
              eventHandlers={{
                click: () => onSpotClick(spotRank),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-primary">#{spotRank} {spotName}</p>
                  <p className="text-xs text-muted-foreground">{spotLocation}</p>
                  {displayMode === "global" && (
                    <>
                      <p className="text-xs text-muted-foreground mt-1">
                                        {(spot as GlobalSpot).count} users ranked
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {/* avg rank removed for global spot */}
                      </p>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

