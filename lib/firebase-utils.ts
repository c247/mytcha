import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore"
import { db } from "./firebase"

export interface UserRanking {
  id?: string
  name: string
  location: string
  ranking: number
  colour?: string
  updatedAt?: any
}

/**
 * Claim username (transactional)
 */
export async function claimUsername(uid: string, usernameRaw: string): Promise<string> {
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
 * Add a new ranking for the current user
 */
export async function addRanking(uid: string, ranking: UserRanking) {
  return await addDoc(collection(db, "users", uid, "rankings"), {
    name: ranking.name,
    location: ranking.location,
    ranking: ranking.ranking,
    colour: ranking.colour || "#6b9e6b",
    updatedAt: serverTimestamp(),
  })
}

/**
 * Update an existing ranking
 */
export async function updateRanking(uid: string, rid: string, patch: Partial<UserRanking>) {
  await updateDoc(doc(db, "users", uid, "rankings", rid), {
    ...patch,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete a ranking
 */
export async function deleteRanking(uid: string, rid: string) {
  await deleteDoc(doc(db, "users", uid, "rankings", rid))
}

/**
 * Subscribe to user's rankings in real-time
 */
export function subscribeMyRankings(
  uid: string,
  cb: (rankings: (UserRanking & { id: string })[]) => void
) {
  const q = query(collection(db, "users", uid, "rankings"), orderBy("ranking", "asc"))
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserRanking & { id: string })))
  })
}

/**
 * Read someone else's rankings by username (readonly)
 */
export async function getRankingsByUsername(usernameRaw: string) {
  const username = usernameRaw.trim().toLowerCase()
  const unameSnap = await getDoc(doc(db, "usernames", username))
  if (!unameSnap.exists()) throw new Error("User not found.")

  const uid = unameSnap.data().uid as string
  const q = query(collection(db, "users", uid, "rankings"), orderBy("ranking", "asc"))
  const rankingsSnap = await getDocs(q)
  return rankingsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as UserRanking & { id: string }))
}

/**
 * Read global top 10 leaderboard
 */
export async function getGlobalTop10(): Promise<UserRanking[]> {
  try {
    const snap = await getDoc(doc(db, "global", "leaderboards"))
    return snap.exists() ? (snap.data().top10 || []) : []
  } catch (err) {
    console.error("Error reading global leaderboard:", err)
    return []
  }
}
