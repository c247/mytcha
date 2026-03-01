"use client"

import { useState, useEffect } from "react"
import { Leaf, LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import type { User } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { SignInDialog } from "@/components/sign-in-dialog"

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [signInOpen, setSignInOpen] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            matcha map
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <a
            href="#top10"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Top 10
          </a>
          <a
            href="#map"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Map
          </a>
          <a
            href="#about"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </a>
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut(auth)}
              className="gap-2"
            >
              <LogOut className="size-4" />
              Sign Out
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setSignInOpen(true)}
              className="gap-2"
            >
              <LogIn className="size-4" />
              Sign In
            </Button>
          )}
        </nav>
      </div>
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
    </header>
  )
}
