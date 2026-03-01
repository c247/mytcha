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
    <header className="sticky top-0 z-50 border-b border-[#254427] bg-[#315a33]/95 text-[#f2fff2] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4 md:px-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#f7fff7]" style={{ fontFamily: "var(--font-display)" }}>
            mytcha
          </span>
        </Link>
        <nav className="flex items-center">
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut(auth)}
              className="gap-2 border-[#d9f0d9] bg-transparent text-[#f2fff2] hover:bg-[#3f6f41] hover:text-white"
            >
              <LogOut className="size-4" />
              Sign Out
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setSignInOpen(true)}
              className="gap-2 bg-[#f2fff2] text-[#315a33] hover:bg-white"
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
