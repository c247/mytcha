#!/usr/bin/env node
/**
 * Backfill script to generate the `global_spots` collection from existing
 * `/users/{uid}/rankings` documents. This uses the Firebase Admin SDK and
 * requires a service account JSON key.
 *
 * Usage:
 *   SERVICE_ACCOUNT=./serviceAccount.json node scripts/backfill-global-spots.js
 *
 * The script will aggregate occurrences of spots by `name|location` and
 * write documents to `global_spots/{name|location}` with fields:
 *   - name, location, count, lat, lng
 */

const admin = require("firebase-admin")
const path = require("path")

const keyPath = process.env.SERVICE_ACCOUNT || process.argv[2]
if (!keyPath) {
  console.error("Error: SERVICE_ACCOUNT env var or first arg must point to service account JSON file.")
  process.exit(1)
}

try {
  const key = require(path.resolve(keyPath))
  admin.initializeApp({ credential: admin.credential.cert(key) })
} catch (e) {
  console.error("Failed to initialize Firebase Admin SDK:", e)
  process.exit(1)
}

const db = admin.firestore()

async function run() {
  console.log("Starting backfill: aggregating user rankings...")

  const counts = new Map()

  const usersSnap = await db.collection("users").get()
  console.log(`Found ${usersSnap.size} users`)

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id
    const rankingsSnap = await db.collection("users").doc(uid).collection("rankings").get()
    for (const r of rankingsSnap.docs) {
      const data = r.data() || {}
      const name = (data.name || "").trim()
      const location = (data.location || "").trim()
      if (!name || !location) continue
      const key = `${name.toLowerCase()}|${location.toLowerCase()}`
      const existing = counts.get(key) || { name, location, count: 0, lat: data.lat, lng: data.lng }
      existing.count += 1
      // prefer existing lat/lng if present, otherwise keep first seen
      if (!existing.lat && data.lat) existing.lat = data.lat
      if (!existing.lng && data.lng) existing.lng = data.lng
      counts.set(key, existing)
    }
  }

  console.log(`Aggregated ${counts.size} unique spots; writing to global_spots...`)

  // Write in batches of 500
  const entries = Array.from(counts.entries())
  for (let i = 0; i < entries.length; i += 500) {
    const batch = db.batch()
    const chunk = entries.slice(i, i + 500)
    for (const [key, obj] of chunk) {
      const docRef = db.collection("global_spots").doc(key)
      batch.set(docRef, {
        name: obj.name,
        location: obj.location,
        count: obj.count,
        lat: obj.lat || null,
        lng: obj.lng || null,
      }, { merge: true })
    }
    await batch.commit()
    console.log(`Wrote ${chunk.length} docs (${i + chunk.length}/${entries.length})`)
  }

  console.log("Backfill complete.")
  process.exit(0)
}

run().catch((err) => {
  console.error("Backfill failed:", err)
  process.exit(2)
})
