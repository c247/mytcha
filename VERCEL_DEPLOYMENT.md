# Deploying to Vercel

This project is a Next.js application that uses Firebase for auth and Firestore.
The easiest (and free) way to host it is on [Vercel](https://vercel.com), which
supports all Next.js features out of the box, including API routes, server-side
rendering, and edge functions.

## Why Vercel?

* Free plan includes unlimited deployments and serverless functions
* Automatic GitHub integration and preview URLs for pull requests
* Built by the same team as Next.js — zero configuration required
* HTTPS, CDN, and caching provided automatically

Firebase Hosting can also be used, but for full Next.js support it requires the
Blaze (pay-as-you-go) plan and extra configuration (functions, rewrites, etc.).
Vercel avoids all that complexity.

## Step-by-step setup

1. **Push your code to a Git provider** (GitHub, GitLab, or Bitbucket).
   This repo already has a typical Next.js structure (`app/`, `components/`,
   etc.).

2. **Create a Vercel account** and log in with your Git provider.

3. **Import the project**
   * Click **New Project** in the Vercel dashboard.
   * Select your repository; Vercel will auto-detect the Next.js framework.
   * No custom build command is needed (`npm run build` or `next build` is
     inferred).

4. **Set environment variables**
   In the Vercel project settings, under **Environment Variables**, add the
   following keys (use values from your Firebase project settings):

   | Name                                  | Description                          |
   |---------------------------------------|--------------------------------------|
   | `NEXT_PUBLIC_FIREBASE_API_KEY`        | Firebase API key                     |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`    | e.g. `your-app.firebaseapp.com`      |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`     | Firebase project identifier          |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | e.g. `your-app.appspot.com`         |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID           |
   | `NEXT_PUBLIC_FIREBASE_APP_ID`         | App ID                              |

   These variables are referenced in `lib/firebase.ts` when initializing
   the Firebase client SDK.

5. **Deploy**
   * After import, Vercel will automatically build and deploy the project.
   * Every push to the main branch (or your default branch) creates a new
     production deployment. Pull requests generate preview URLs.

6. **Verify**
   * Visit the generated URL (e.g. `https://your-project.vercel.app`).
   * Use the app; the `/api/geo-search` route will run as a serverless function
     on Vercel automatically.

## Notes

* You do not need to change `next.config.mjs`—server-side rendering and API
  routes work without `output: "export"`.
* If you ever prefer a static export, update `next.config.mjs` and run
  `next export`, but that removes API route support.
* Firebase continues to power authentication and database functionality; only
  the hosting layer moves to Vercel.

## Local development

Local dev remains the same:

```bash
npm install
npm run dev
```

The app will connect to Firebase using the environment variables in your
`.env.local` file (make a copy of `.env.example` if present).

---

Deploying to Vercel keeps your workflow simple and cost-free while giving you
access to the full feature set of Next.js.
