# Personal Blog — Design

## Context

The repository is a monorepo with a single delivery component (`apps/web`): a
Next.js application on Cloudflare Workers + Static Assets. The application is
Vercel's "Blog with Sanity CMS" template, ported to Workers via
`@opennextjs/cloudflare`. It ships with bundled sample posts and connects to a
real Sanity dataset once its project id is configured.

The Orun pipeline builds, verifies, and deploys per environment (dev, stage,
prod) on merge to `main`.

## Architecture

### Components

```
┌──────────────────────────────────────────────────────┐
│                    Cloudflare Worker                  │
│  ┌────────────────────────────────────────────────┐  │
│  │              Next.js (Server-side)              │  │
│  │  ┌─────────────┐  ┌──────────┐  ┌───────────┐ │  │
│  │  │ (blog) pages │  │  API     │  │ (sanity)  │ │  │
│  │  │ home, posts  │  │ draft    │  │ Studio at │ │  │
│  │  │              │  │ mode     │  │ /studio   │ │  │
│  │  └─────────────┘  └──────────┘  └───────────┘ │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  Static Assets: CSS, JS bundles, Studio client build  │
└──────────────────────────────────────────────────────┘
         │
         │ GROQ queries (60s CDN cache)
         ▼
┌──────────────────┐
│  Sanity Dataset   │
│  ┌────────────┐   │
│  │  Posts     │   │
│  │  Authors   │   │
│  │  Settings  │   │
│  └────────────┘   │
└──────────────────┘
```

### Data flow

1. **Published content** — Sanity's API CDN caches GROQ responses for 60s.
   Every blog page renders on request: the Worker calls Sanity's API, gets the
   cached response (or fetches fresh if the cache is cold), and returns HTML.

2. **Draft content** — The draft-mode route (`/api/draft-mode/enable`) sets a
   signed cookie after verifying a `SANITY_API_READ_TOKEN` (a Viewer API token).
   With the cookie, `next-sanity` bypasses the CDN and reads draft content
   directly from Sanity. The Studio's Presentation tool opens this route in an
   iframe, enabling live preview as the author edits.

3. **Studio** — The embedded Sanity Studio is a client-side app bundled as
   static assets. It loads at `/studio`, signs in through Sanity's
   authentication, and talks to the Sanity API directly from the browser. It
   requires the site's origin to be registered in the project's CORS settings.

### Environments

| Environment | Purpose | Deploy trigger | URL pattern |
|---|---|---|---|
| dev | PR verification only | pull_request | (dry-run) |
| stage | Staging deployment | push to main | `personal-blog-20345c-web-stage.vijayakrishnan12994.workers.dev` |
| prod | Production deployment | push to main (after stage) | `personal-blog-20345c-web-prod.vijayakrishnan12994.workers.dev` |

Each environment can name its own Sanity project and dataset via Orun secrets.
Until those secrets are set, the blog renders sample posts with an
"unconnected" notice.

### Secrets

| Secret | When read | Required | Notes |
|---|---|---|---|
| `SANITY_PROJECT_ID` | build time | optional | Without it, blog shows samples |
| `SANITY_DATASET` | build time | optional | Defaults to `production` |
| `SANITY_API_READ_TOKEN` | request time (Worker) | optional for published content; required for draft mode | Viewer token, stored as Worker secret |

### Content schema

The Sanity dataset contains three document types:

- **Post** — title, slug, body (Portable Text), excerpt, cover image, author
  reference, date, categories/tags
- **Author** — name, picture, biography
- **Settings** — site title, description, Open Graph metadata, social links

These are defined in `apps/web/sanity/schemas/` and generated as TypeScript
types in `apps/web/sanity.types.ts`.

## Key design decisions

1. **Server-side rendering on request, not at build time.** Every page renders
   against Sanity's live API. This means content updates appear without a
   redeploy, at the cost of the API CDN's 60s cache lag for published content.
   Draft content has no cache lag (the cookie bypasses the CDN).

2. **Optional Sanity project at build time.** The blog builds and deploys
   without a Sanity project id. This lets the pipeline converge before the
   owner has created a Sanity project, and lets the owner connect projects
   independently per environment.

3. **Studio embedded, not separate.** The Studio ships as static assets in the
   same Worker. No separate deployment, no CORS between blog and Studio on the
   same origin. The trade-off is that the Studio's version is tied to the blog's
   deploy cycle.

4. **Draft mode through `@opennextjs/cloudflare`.** The draft-mode route is a
   standard Next.js API route that `@opennextjs/cloudflare` maps to the Worker's
   fetch handler. It signs a cookie with the `SANITY_API_READ_TOKEN` as the
   shared secret, letting the Presentation tool's iframe authenticate.

## What changes across milestones

| Aspect | APP-2 (Sanity connected) | APP-3 (Own content) |
|---|---|---|
| Sanity project | Created and linked | Already linked |
| Content | Sample posts visible | Replaced with owner's articles |
| Studio | Loads and shows schemas | Used to write content |
| Draft mode | Works with read token | Already works |
| Categories/tags | Schema may need extending | Added and populated |
| About/author | Schema exists | Author section populated |
