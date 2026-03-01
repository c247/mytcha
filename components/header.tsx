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
import { getUserProfile } from "@/lib/firebase-rankings"
import { UserIdClaimDialog } from "@/components/userid-claim-dialog"

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [signInOpen, setSignInOpen] = useState(false)
  const [claimOpen, setClaimOpen] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      if (!nextUser) {
        setUserId(null)
        setClaimOpen(false)
        return
      }
      const profile = await getUserProfile(nextUser.uid)
      const username = profile?.username ?? null
      setUserId(username)
      if (!username) {
        setClaimOpen(true)
      }
    })
    return () => unsub()
  }, [])

  return (
    <header className="sticky top-0 z-50 overflow-hidden border-b border-[#2b5a31] bg-gradient-to-r from-[#1e4929] via-[#2d6a3a] to-[#1f4f2c] text-[#f2fff2] shadow-[0_10px_30px_rgba(24,56,32,0.28)]">
      <div className="pointer-events-none absolute -top-8 left-16 h-24 w-24 rounded-full bg-[#b8efc3]/20 blur-2xl" />
      <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#d9ffd6]/15 blur-2xl" />
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4 md:px-12">
        <Link href="/" className="group relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#a9d8a4]/60 bg-[#75b073]/25 text-[#efffeb] shadow-inner transition-transform group-hover:scale-110">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#f7fff7]" style={{ fontFamily: "var(--font-display)" }}>
            mytcha
          </span>
          <span className="pointer-events-none absolute -bottom-1 left-14 h-[2px] w-16 bg-[#dcffd7]/80 opacity-80" />
        </Link>
        <nav className="flex items-center gap-3">
          {user && userId && (
            <span className="hidden rounded-full border border-[#d9f0d9]/60 bg-[#1f4a2b]/35 px-3 py-1 text-xs text-[#e6ffe4] sm:inline-block">
              Welcome, {userId}
            </span>
          )}
          {user && !userId && (
            <button
              type="button"
              onClick={() => setClaimOpen(true)}
              className="hidden rounded-full border border-[#d9f0d9]/60 bg-[#1f4a2b]/35 px-3 py-1 text-xs text-[#e6ffe4] sm:inline-block"
            >
              Set userid
            </button>
          )}
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut(auth)}
              className="gap-2 rounded-full border-[#d9f0d9] bg-[#1f4a2b]/35 text-[#f2fff2] shadow-sm hover:bg-[#4f8453] hover:text-white"
            >
              <LogOut className="size-4" />
              Sign Out
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setSignInOpen(true)}
              className="gap-2 rounded-full bg-[#f2fff2] text-[#315a33] shadow-sm hover:bg-white"
            >
              <LogIn className="size-4" />
              Sign In
            </Button>
          )}
        </nav>
      </div>
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
      {user && (
        <UserIdClaimDialog
          open={claimOpen}
          onOpenChange={setClaimOpen}
          user={user}
          onClaimed={(claimedId) => setUserId(claimedId)}
        />
      )}
    </header>
  )
}
