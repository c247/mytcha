import { NextRequest, NextResponse } from "next/server"

// Nominatim format our client expects
type NominatimResult = {
  name?: string
  display_name: string
  lat: string
  lon: string
  address?: { city?: string; state?: string; country?: string }
}

/**
 * Geo search: tries Nominatim first, then Photon (better for businesses)
 * Both use OSM data; Photon often has better coverage for cafes/shops
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")
  const limit = searchParams.get("limit") || "8"

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const query = q.trim()

  try {
    // 1. Try Nominatim first
    const nominatimParams = new URLSearchParams({
      q: query,
      format: "json",
      limit,
      countrycodes: "us",
    })
    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/search?${nominatimParams}`,
      {
        headers: {
          "User-Agent": "MatchaMap/1.0 (Bay Area matcha spot finder)",
          Accept: "application/json",
        },
      }
    )
    if (nominatimRes.ok) {
      const data = (await nominatimRes.json()) as NominatimResult[]
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json(data)
      }
    }

    // 2. Fallback: Photon (often better for business names)
    const photonParams = new URLSearchParams({
      q: query,
      limit,
      lat: "37.77", // Bias to SF Bay Area
      lon: "-122.42",
    })
    const photonRes = await fetch(
      `https://photon.komoot.io/api/?${photonParams}`,
      { headers: { Accept: "application/json" } }
    )
    if (!photonRes.ok) return NextResponse.json([])

    const photonData = (await photonRes.json()) as {
      features?: Array<{
        geometry: { coordinates: [number, number] }
        properties: {
          name?: string
          street?: string
          housenumber?: string
          city?: string
          state?: string
          country?: string
        }
      }>
    }

    const features = photonData?.features ?? []
    const results: NominatimResult[] = features
      .filter((f) => f.geometry?.coordinates?.length >= 2)
      .slice(0, parseInt(limit, 10))
      .map((f) => {
        const [lng, lat] = f.geometry.coordinates
        const props = f.properties || {}
        const name = props.name || [props.street, props.housenumber].filter(Boolean).join(" ") || "Unknown"
        const parts = [props.street, props.housenumber, props.city, props.state, props.country].filter(Boolean)
        const displayName = parts.length > 0 ? parts.join(", ") : name

        return {
          name: props.name || name,
          display_name: displayName,
          lat: String(lat),
          lon: String(lng),
          address: {
            city: props.city,
            state: props.state,
            country: props.country,
          },
        }
      })

    return NextResponse.json(results)
  } catch {
    return NextResponse.json([])
  }
}
