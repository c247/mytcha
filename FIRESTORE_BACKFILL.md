# Backfilling `global_spots` collection

This repository includes a script to backfill the `global_spots` collection from
existing user rankings located at `/users/{uid}/rankings`.

Prerequisites
- A Firebase service account JSON file with permissions to read and write Firestore.
- Node.js installed.

How to run

1. Place your service account JSON somewhere safe (e.g. `./serviceAccount.json`).
2. Run:

```bash
SERVICE_ACCOUNT=./serviceAccount.json node scripts/backfill-global-spots.js
```

Or pass the path as the first argument:

```bash
node scripts/backfill-global-spots.js ./serviceAccount.json
```

What it does
- Reads all documents under `users` and their `rankings` subcollections.
- Aggregates spots by `name|location` (case-insensitive).
- Writes documents to `global_spots/{name|location}` with fields: `name`, `location`, `count`, `lat`, `lng`.

Security note
- This script uses the Admin SDK so it bypasses Firestore security rules. Do not check
  your service account into source control.
