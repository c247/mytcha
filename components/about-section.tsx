import Image from "next/image"
import { Heart, Coffee, Globe } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
            about us
          </p>
          <h2
            className="text-3xl font-extrabold text-foreground md:text-4xl text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Why Matcha Map?
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border shadow-md">
            <Image
              src="/images/matcha-shop.jpg"
              alt="Inside a cozy matcha cafe"
              width={600}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-8">
            <p className="text-lg leading-relaxed text-muted-foreground">
              We{"'"}re a tiny team of matcha lovers who got tired of mediocre green tea
              lattes. So we built a resource for everyone who believes a perfect bowl of
              matcha can change your whole day.
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Handpicked with love</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every spot is personally visited and tasted before it makes the list.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Bay Area coverage</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    From SF to Oakland, Berkeley to San Jose, we{"'"}re always on the hunt for the next great cup.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Coffee className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Quality first</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We rate on matcha quality, ambiance, and that certain something special.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
