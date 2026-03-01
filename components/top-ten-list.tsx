"use client"

import { useState } from "react"
import { MapPin, Star, ChevronDown, ChevronUp, MapPinned } from "lucide-react"
import { matchaSpots } from "@/lib/matcha-spots"

export function TopTenList() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section id="top10" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
            the list
          </p>
          <h2
            className="text-3xl font-extrabold text-foreground md:text-4xl text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Top 10 Matcha Spots in the Bay Area
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground leading-relaxed">
            Our curated picks for the best matcha in SF, Oakland, Berkeley, San Jose, and beyond.
          </p>
        </div>

        <ol className="flex flex-col gap-4">
          {matchaSpots.map((spot) => {
            const isExpanded = expandedIndex === spot.rank
            return (
              <li key={spot.rank}>
                <button
                  onClick={() =>
                    setExpandedIndex(isExpanded ? null : spot.rank)
                  }
                  className="group flex w-full items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/40"
                  aria-expanded={isExpanded}
                >
                  {/* Rank Badge */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-primary">
                    {spot.rank}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {spot.name}
                      </h3>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {spot.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        {spot.rating}
                      </span>
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {spot.vibe}
                      </span>
                    </div>

                    {isExpanded && (
                      <>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {spot.description}
                        </p>
                        <a
                          href={`#map-${spot.rank}`}
                          onClick={(e) => {
                            e.preventDefault()
                            window.location.hash = `map-${spot.rank}`
                            document.getElementById("map")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                        >
                          <MapPinned className="h-4 w-4" />
                          Show on map
                        </a>
                      </>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
