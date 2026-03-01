"use client"

import { useEffect, useState } from "react"
import type { User } from "firebase/auth"
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

interface UserIdClaimDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onClaimed: (userId: string) => void
}

export function UserIdClaimDialog({ open, onOpenChange, user, onClaimed }: UserIdClaimDialogProps) {
  const [userId, setUserId] = useState("")
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const value = userId.trim().toLowerCase()
    if (!value) {
      setStatus("idle")
      return
    }
    if (!/^[a-z0-9_]{3,20}$/.test(value)) {
      setStatus("invalid")
      return
    }

    setStatus("checking")
    const t = setTimeout(async () => {
      try {
        const available = await isUsernameAvailable(value)
        setStatus(available ? "available" : "taken")
      } catch {
        setStatus("idle")
      }
    }, 300)
    return () => clearTimeout(t)
  }, [userId])

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = userId.trim().toLowerCase()
    setError(null)
    if (!/^[a-z0-9_]{3,20}$/.test(value)) {
      setError("User ID must be 3-20 chars: a-z, 0-9, underscore.")
      return
    }

    setLoading(true)
    try {
      const claimed = await claimUsername(user.uid, value)
      onClaimed(claimed)
      onOpenChange(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to claim user ID."
      setError(msg.includes("taken") ? "That user ID is already taken." : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set your userid</DialogTitle>
          <DialogDescription>
            Choose a unique ID so other people can find your rankings in Search.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleClaim} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="claim-userid">User ID</Label>
            <Input
              id="claim-userid"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="your_unique_id"
              autoComplete="off"
              maxLength={20}
              required
            />
            <p className="text-xs text-muted-foreground">3-20 chars, lowercase letters, numbers, underscore</p>
            {status === "checking" && <p className="text-xs text-muted-foreground">Checking availability...</p>}
            {status === "available" && <p className="text-xs text-green-600">User ID available</p>}
            {status === "taken" && <p className="text-xs text-destructive">User ID already taken</p>}
            {status === "invalid" && <p className="text-xs text-destructive">Invalid format</p>}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save User ID"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
