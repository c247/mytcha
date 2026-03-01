/**
 * Geo search using OpenStreetMap Nominatim (free, no API key required)
 * See: https://nominatim.org/release-docs/develop/api/Search/
 */

export type GeoSearchResult = {
  name: string
  displayName: string
  lat: number
  lng: number
  location: string
}

export async function searchPlaces(
  query: string,
  options?: { limit?: number }
): Promise<GeoSearchResult[]> {
  const limit = options?.limit ?? 10

  // Don't append location - let Nominatim search broadly. User can add "San Francisco" etc. in query
  const params = new URLSearchParams({
    q: query.trim(),
    limit: String(limit),
  })

  // Use Next.js API route proxy to avoid CORS with Nominatim
  const res = await fetch(`/api/geo-search?${params}`)
  if (!res.ok) throw new Error("Geo search failed")

  const raw = await res.json()
  const data = Array.isArray(raw) ? raw : []
  
  return data.map((item: {
    name?: string
    display_name: string
    lat: string
    lon: string
    address?: { city?: string; state?: string; country?: string }
  }) => {
    const lat = parseFloat(item.lat)
    const lng = parseFloat(item.lon)
    const name = item.name || item.display_name.split(",")[0]?.trim() || "Unknown"
    const location = [item.address?.city, item.address?.state, item.address?.country]
      .filter(Boolean)
      .join(", ") || item.display_name
    return {
      name,
      displayName: item.display_name,
      lat,
      lng,
      location,
    }
  })
}
