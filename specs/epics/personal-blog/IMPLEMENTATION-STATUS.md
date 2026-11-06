# Personal Blog — Implementation Status

| # | Milestone | Key | Status | Started | Completed | Notes |
|---|---|---|---|---|---|---|
| 1 | The plan, written down | APP-1 | **Complete** | 2026-11-06 | 2026-11-06 | Docs written, contracts created, specs pushed, PR #3 open |
| 2 | Blog running with Sanity | APP-2 | **In progress** — repo side shipped; the live connection awaits the owner's Sanity project | 2026-11-06 | — | Code, pipeline wiring, docs and tests for the Sanity connection shipped (PR #4). The live site (stage and prod) still serves the designed no-project build — sample posts under the "connect your Sanity project" notice — because the workspace's secret store has no `SANITY_PROJECT_ID` / `SANITY_DATASET` yet (asked the owner for a project id on 2026-11-06; none provided). To finish: store those two secrets for stage and prod, add the two workers.dev origins to the Sanity project's CORS (credentials allowed), create a Viewer token and set it as the Worker secret, redeploy (bump `apps/web/component.yaml`'s redeploy stamp or use the Deploy button), and verify. No departure from `design.md` — the unconnected build is the design's optional-project path ([README → Connecting Sanity](../../../README.md)). |
| 3 | Your articles published | APP-3 | Not started | — | — | |
