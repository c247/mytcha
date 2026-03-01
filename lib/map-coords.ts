/**
 * Bay Area bounds for projecting lat/lng onto the custom SVG map.
 * SVG viewBox is 0 0 500 400.
 */
const BOUNDS = {
  north: 38.15,
  south: 37.25,
  west: -122.55,
  east: -121.85,
}
const MAP_WIDTH = 500
const MAP_HEIGHT = 400

export function latLngToBayAreaSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * MAP_WIDTH
  const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * MAP_HEIGHT
  return { x, y }
}
