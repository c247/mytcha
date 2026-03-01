import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  limit,
} from "firebase/firestore"
import { db } from "./firebase"

export type RankingData = {
  name: string
  location: string
  ranking: number
  lat?: number
  lng?: number
  colour?: string
  updatedAt?: any
}

export type Ranking = RankingData & {
  id: string
}

export type UserProfile = {
  username?: string
}

// A single spot stored in the global collection with a running count
export type GlobalSpot = {
  name: string
  location: string
  count: number
  lat?: number
  lng?: number
}

/**
 * Subscribe to user's rankings (live updates)
 */
export function subscribeMyRankings(
  uid: string,
  callback: (rankings: Ranking[]) => void
) {
  const q = query(
    collection(db, "users", uid, "rankings"),
    orderBy("ranking", "asc")
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Ranking)))
  })
}

/**
 * Add a new ranking
 */
export async function addRanking(uid: string, data: RankingData) {
  await addDoc(collection(db, "users", uid, "rankings"), {
    ...data,
    updatedAt: serverTimestamp(),
  })
  // update global counters
  await incrementGlobalSpot(data)
}

/**
 * Update an existing ranking
 */
export async function updateRanking(
  uid: string,
  rankingId: string,
  patch: Partial<RankingData>
) {
  await updateDoc(doc(db, "users", uid, "rankings", rankingId), {
    ...patch,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete a ranking
 */
export async function deleteRanking(uid: string, rankingId: string) {
  await deleteDoc(doc(db, "users", uid, "rankings", rankingId))
  // note: decrementing is best-effort; if the doc had no lat/lng we can't do much
  // the caller should pass the original spot data if available
}

/**
 * Claim a username (transactional operation)
 */
export async function claimUsername(uid: string, usernameRaw: string) {
  const username = usernameRaw.trim().toLowerCase()
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    throw new Error("Username must be 3-20 chars: a-z, 0-9, underscore.")
  }

  const unameRef = doc(db, "usernames", username)
  const userRef = doc(db, "users", uid)

  await runTransaction(db, async (tx) => {
    const existing = await tx.get(unameRef)
    if (existing.exists()) throw new Error("Username already taken.")

    tx.set(unameRef, { uid, createdAt: serverTimestamp() })
    tx.set(userRef, { username, createdAt: serverTimestamp() }, { merge: true })
  })

  return username
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(usernameRaw: string) {
  const username = usernameRaw.trim().toLowerCase()
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return false
  }
  const snap = await getDoc(doc(db, "usernames", username))
  return !snap.exists()
}

/**
 * Get a user's profile doc
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid))
  if (!snap.exists()) return null
  return snap.data() as UserProfile
}

/**
 * Get rankings by username (read-only)
 */
export async function getRankingsByUsername(usernameRaw: string) {
  const username = usernameRaw.trim().toLowerCase()
  const unameSnap = await getDoc(doc(db, "usernames", username))
  if (!unameSnap.exists()) throw new Error("User not found.")

  const uid = unameSnap.data().uid as string
  const q = query(
    collection(db, "users", uid, "rankings"),
    orderBy("ranking", "asc")
  )
  const rankingsSnap = await getDocs(q)
  return rankingsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Ranking))
}

/**
 * Get global top 10 leaderboard (from global doc - Cloud Function populated)
 */
export async function getGlobalTop10(): Promise<GlobalSpot[]> {
  // read the top-level counter collection ordered by count desc
  const q = query(collection(db, "global_spots"), orderBy("count", "desc"), limit(10))
  const snap = await getDocs(q)
  const spots = snap.docs.map((d) => d.data() as GlobalSpot)
  return spots
}

/**
 * Increment a spot's global counter. Creates document if missing.
 */
export async function incrementGlobalSpot(spot: {
  name: string
  location: string
  lat?: number
  lng?: number
}) {
  const key = `${spot.name.toLowerCase()}|${spot.location.toLowerCase()}`
  const docRef = doc(db, "global_spots", key)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(docRef)
    if (snap.exists()) {
      const newCount = (snap.data().count || 0) + 1
      console.log(`incrementGlobalSpot ${key} -> ${newCount}`)
      tx.update(docRef, { count: newCount })
    } else {
      console.log(`create global spot ${key}`)
      tx.set(docRef, {
        name: spot.name,
        location: spot.location,
        count: 1,
        lat: spot.lat,
        lng: spot.lng,
      })
    }
  })
}

/**
 * Decrement a spot's global counter. If count drops to 0, delete document.
 */
export async function decrementGlobalSpot(spot: {
  name: string
  location: string
}) {
  const key = `${spot.name.toLowerCase()}|${spot.location.toLowerCase()}`
  const docRef = doc(db, "global_spots", key)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(docRef)
    if (!snap.exists()) return
    const current = snap.data().count || 0
    console.log(`decrementGlobalSpot ${key} -> ${current - 1}`)
    if (current <= 1) {
      tx.delete(docRef)
    } else {
      tx.update(docRef, { count: current - 1 })
    }
  })
}
