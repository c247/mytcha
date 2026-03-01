import { Header } from "@/components/header"
import { MatchaMap } from "@/components/matcha-map"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 min-h-0">
        <MatchaMap />
      </div>
    </main>
  )
}
