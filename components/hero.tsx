import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Decorative dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 left-12 h-24 w-24 rounded-full bg-accent/60" />
        <div className="absolute top-32 right-8 h-16 w-16 rounded-full bg-primary/10" />
        <div className="absolute bottom-8 left-1/3 h-12 w-12 rounded-full bg-accent/40" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 md:flex-row md:gap-16">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
            your matcha guide
          </p>
          <h1
            className="mb-5 text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The <span className="text-primary">dreamiest</span> matcha in the Bay Area
          </h1>
          <p className="mx-auto max-w-md text-lg leading-relaxed text-muted-foreground md:mx-0">
            We sipped so you don{"'"}t have to guess. Explore our handpicked top 10 matcha
            spots plus an interactive map from SF to San Jose.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#top10"
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105"
            >
              See the Top 10
            </a>
            <a
              href="#map"
              className="rounded-full border-2 border-primary bg-card px-6 py-3 text-sm font-bold text-primary shadow-sm transition-transform hover:scale-105"
            >
              Explore Map
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex-1">
          <div className="relative mx-auto aspect-square w-72 overflow-hidden rounded-3xl border-4 border-card shadow-xl md:w-80 lg:w-96">
            <Image
              src="/images/matcha-hero.jpg"
              alt="Beautiful matcha latte with latte art in a ceramic cup"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-3 -left-3 rounded-2xl bg-card px-4 py-2 shadow-lg md:-left-6">
            <p className="text-xs font-bold text-muted-foreground">Curated with</p>
            <p className="text-lg font-extrabold text-primary" style={{ fontFamily: "var(--font-display)" }}>
              love
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
