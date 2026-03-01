import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-accent/20 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </div>
          <span
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            matcha map
          </span>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
          Made with matcha and love. All recommendations are based on personal visits and
          ceremonial-grade taste buds.
        </p>
        <p className="text-xs text-muted-foreground/60">
          {new Date().getFullYear()} Matcha Map. Sip responsibly.
        </p>
      </div>
    </footer>
  )
}
