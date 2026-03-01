const PASTEL_CUP_COLORS = [
  "#FFE5EC",
  "#FDE2E4",
  "#FEECD2",
  "#FFF1B6",
  "#DFF7E2",
  "#D9F2FF",
  "#E3E0FF",
  "#F0E4FF",
  "#FFDFF5",
]

function randomPastel(): string {
  return PASTEL_CUP_COLORS[Math.floor(Math.random() * PASTEL_CUP_COLORS.length)]
}

export function getOrCreateCupColors(storageKey: string, keys: string[]): Record<string, string> {
  if (typeof window === "undefined") return {}

  let colors: Record<string, string> = {}
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) colors = JSON.parse(raw)
  } catch {
    colors = {}
  }

  let updated = false
  for (const key of keys) {
    if (!colors[key]) {
      colors[key] = randomPastel()
      updated = true
    }
  }

  if (updated) {
    localStorage.setItem(storageKey, JSON.stringify(colors))
  }

  return colors
}
