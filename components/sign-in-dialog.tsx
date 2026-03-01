"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  const reset = () => {
    setEmail("")
    setPassword("")
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
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
        className="sm:max-w-md"
        onPointerDownOutside={reset}
        onEscapeKeyDown={reset}
      >
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Sign In" : "Sign Up"}</DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Enter your email and password to sign in."
              : "Create an account with your email and password."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={switchMode}>
              {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "..." : mode === "signin" ? "Sign In" : "Sign Up"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
