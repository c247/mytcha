export const BAY_AREA_BOUNDS: [[number, number], [number, number]] = [
  [37.1, -123.0],
  [38.3, -121.7],
]

export function isInBayArea(lat: number, lng: number): boolean {
  const [[south, west], [north, east]] = BAY_AREA_BOUNDS
  return lat >= south && lat <= north && lng >= west && lng <= east
}
