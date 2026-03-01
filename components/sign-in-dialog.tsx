"use client"

import { useState, useEffect } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { claimUsername, isUsernameAvailable } from "@/lib/firebase-rankings"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SignInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userId, setUserId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userIdStatus, setUserIdStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle")
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  const reset = () => {
    setEmail("")
    setPassword("")
    setUserId("")
    setUserIdStatus("idle")
    setError(null)
  }

  useEffect(() => {
    if (mode !== "signup") return
    const value = userId.trim().toLowerCase()
    if (!value) {
      setUserIdStatus("idle")
      return
    }
    if (!/^[a-z0-9_]{3,20}$/.test(value)) {
      setUserIdStatus("invalid")
      return
    }

    setUserIdStatus("checking")
    const t = setTimeout(async () => {
      try {
        const available = await isUsernameAvailable(value)
        setUserIdStatus(available ? "available" : "taken")
      } catch {
        setUserIdStatus("idle")
      }
    }, 350)

    return () => clearTimeout(t)
  }, [mode, userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const normalizedUserId = userId.trim().toLowerCase()
        if (!/^[a-z0-9_]{3,20}$/.test(normalizedUserId)) {
          throw new Error("User ID must be 3-20 chars: a-z, 0-9, underscore.")
        }
        if (!(await isUsernameAvailable(normalizedUserId))) {
          throw new Error("User ID is already taken.")
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password)
        try {
          await claimUsername(cred.user.uid, normalizedUserId)
        } catch (claimErr) {
          await deleteUser(cred.user)
          throw claimErr
        }
      }
      reset()
      onOpenChange(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error"
      if (message.includes("auth/invalid-credential")) {
        setError("Invalid email or password.")
      } else if (message.includes("auth/email-already-in-use")) {
        setError("Email already in use. Try signing in.")
      } else if (message.includes("auth/weak-password")) {
        setError("Password must be at least 6 characters.")
      } else if (message.includes("auth/invalid-email")) {
        setError("Please enter a valid email.")
      } else if (message.includes("already taken")) {
        setError("That user ID is already taken.")
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode((m) => (m === "signin" ? "signup" : "signin"))
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[min(92vw,44rem)] max-w-2xl overflow-hidden"
        onPointerDownOutside={reset}
        onEscapeKeyDown={reset}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">{mode === "signin" ? "Sign In" : "Sign Up"}</DialogTitle>
          <DialogDescription className="text-base">
            {mode === "signin"
              ? "Enter your email and password to sign in."
              : "Create an account with your email and password."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="w-full space-y-4 overflow-hidden">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
              className="w-full text-base"
            />
          </div>
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="userid" className="text-base">User ID</Label>
              <Input
                id="userid"
                type="text"
                placeholder="your_unique_id"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                autoComplete="off"
                maxLength={20}
                className="w-full text-base"
              />
              <p className="text-xs text-muted-foreground">3-20 chars, lowercase letters, numbers, underscore</p>
              {userIdStatus === "checking" && <p className="text-xs text-muted-foreground">Checking availability...</p>}
              {userIdStatus === "available" && <p className="text-xs text-green-600">User ID available</p>}
              {userIdStatus === "taken" && <p className="text-xs text-destructive">User ID already taken</p>}
              {userIdStatus === "invalid" && <p className="text-xs text-destructive">Invalid format</p>}
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button type="button" variant="ghost" onClick={switchMode} className="h-auto w-full whitespace-normal px-3 py-2 text-left text-sm leading-snug">
              {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Button>
            <Button type="submit" disabled={loading} className="w-full text-base">
              {loading ? "..." : mode === "signin" ? "Sign In" : "Sign Up"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
