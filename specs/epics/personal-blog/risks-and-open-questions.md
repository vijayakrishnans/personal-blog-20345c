# Personal Blog — Risks and Open Questions

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Sanity project creation fails or is delayed** — the owner may not have a Sanity account, or the project setup encounters an error | Medium | Blocks APP-2 | The blog deploys and serves without a project (sample posts + notice). No code change is blocked; the task pauses at the setup step. |
| **Draft mode cookie does not work in the Studio iframe** — `SameSite=None; Partitioned` cookies may be rejected by the browser depending on the Studio's cross-origin context | Low | Draft mode broken, live preview non-functional | Document the exact browser requirements. The draft-mode route is tested with a mocked client; a real browser test is manual. |
| **`@opennextjs/cloudflare` compatibility issue** — a future Next.js or `@opennextjs` release may break the Worker build | Low | Blog fails to build or serve | Pinned to the version that works at baseline. The Orun pipeline catches build failures in dev (verify-only). |
| **Sanity API rate limits** — heavy traffic or many draft-mode requests could hit Sanity's rate limits | Low | Blog pages fail to render | Sanity's API CDN caches published content for 60s, reducing read traffic. Draft mode is limited to the author's session. |
| **Worker CPU time limit** — Cloudflare Workers have a CPU time limit (30s for paid, 10ms free-tier per request type) | Low | Pages time out | Each page is a single GROQ fetch + server-side render, well within limits for typical posts. |
| **Secrets rotation** — if Sanity tokens or project credentials are rotated, the blog loses connectivity | Low | Blog shows unconnected state or draft mode stops working | Document the rotation steps. The blog degrades gracefully (unconnected notice) rather than breaking. |

## Open Questions

| Question | Impact | Who decides |
|---|---|---|
| **Which Sanity project plan?** The free tier includes a limited number of documents and API requests. A paid plan may be needed for production use. | Cost, scalability | Owner |
| **Custom domain?** The blog currently uses `workers.dev` subdomains. A custom domain would require Cloudflare domain setup and Sanity CORS update. | URL, branding | Owner |
| **Categories or tags taxonomy?** Should posts use free-form tags or a predefined set of categories? | Content organisation | Owner |
| **How many environments?** Stage and prod are declared. A preview environment per branch could be added. | Deploy workflow | Owner |
| **Email newsletter integration?** Not in scope for this epic, but could be added later. | Feature scope | Owner |
| **Analytics?** Cloudflare Web Analytics is supported (`NEXT_PUBLIC_CF_BEACON_TOKEN`) but not configured. | Visibility | Owner |
