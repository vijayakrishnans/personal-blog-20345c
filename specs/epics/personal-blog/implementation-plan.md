# Personal Blog — Implementation Plan

## Milestone 1: APP-1 — The plan, written down

**Summary:** Write the design documents for the personal-blog epic. No code
changes.

### Tasks

- Write `specs/epics/personal-blog/README.md` — epic overview with milestone
  table and task references
- Write `specs/epics/personal-blog/design.md` — architecture, data flow,
  schema, secrets, key decisions
- Write `specs/epics/personal-blog/implementation-plan.md` — this file,
  milestone by milestone with done-when criteria
- Write `specs/epics/personal-blog/risks-and-open-questions.md` — risks,
  mitigations, open questions
- Write `specs/epics/personal-blog/IMPLEMENTATION-STATUS.md` — tracking table
- Write `tasks/APP-1.TaskContract.yaml` through `tasks/APP-3.TaskContract.yaml`
- Push each spec doc to the epic: `orun spec push`

**Done when:**
- `specs/epics/personal-blog/` has all five docs
- `tasks/` has contracts for APP-1, APP-2, APP-3
- Each doc is attached to the plan with `orun spec push`

---

## Milestone 2: APP-2 — Blog running with Sanity

**Summary:** Connect the blog to a real Sanity project. The home page reads
posts from Sanity. The Studio loads and shows the content schema. Draft mode
works.

### Tasks

1. **Create a Sanity project and dataset**
   - Use `pnpm run setup` from `apps/web` or the Sanity management UI
   - Note the project id and dataset name (typically `production`)

2. **Store Sanity project secrets**
   - Set `SANITY_PROJECT_ID` and `SANITY_DATASET` per environment (stage, prod)
   - Use `orun secrets set` for each environment
   - Redeploy the blog after setting secrets

3. **Add a read token for draft mode** (optional but recommended)
   - Create a Viewer token in Sanity management UI (API → Tokens)
   - Store as Worker secret: `wrangler secret put SANITY_API_READ_TOKEN`
   - Do this per environment

4. **Register the site's origins in Sanity CORS**
   - Add stage and prod URLs to the Sanity project (API → CORS origins)
   - Enable credentials for each origin

5. **Verify the blog reads from Sanity**
   - Home page lists sample blog posts from Sanity
   - Each post has its own page with title, body, author and date

6. **Verify the Studio loads**
   - `/studio` loads and shows the content schema (posts, authors, settings)
   - Can create and edit documents

7. **Verify draft mode**
   - Create an unpublished post in the Studio
   - Open the Presentation tool
   - The unpublished post is visible with a preview indicator

8. **Verify deployment pipeline**
   - The site is live on the Cloudflare account
   - Stage and prod both serve content

**Done when:**
- The home page lists sample blog posts from Sanity
- Each post has its own page with title, body, author and date
- Sanity Studio at `/studio` loads and shows the content schema (posts, authors, settings)
- Draft mode works — unpublished posts are visible with a preview indicator
- The site is live on the Cloudflare account

---

## Milestone 3: APP-3 — Your articles published

**Summary:** Replace the sample content with the owner's own articles. Add
categorisation and an about/author section.

### Tasks

1. **Write "How to get hired in the AI era" in the Studio**
   - Create a Post document with the article content
   - Publish it
   - Verify it renders on its own page

2. **Write "Agentic coding" in the Studio**
   - Create a Post document with the article content
   - Publish it
   - Verify it renders on its own page

3. **Remove sample posts** (or keep as drafts)
   - Sample posts in `sanity/lib/sample.ts` are shown only when no Sanity
     project is configured; once connected, they do not appear
   - If sample content still surfaces, remove or unpublish it

4. **Add categories or tags**
   - Verify the Post schema already includes categories/tags
   - If not, extend the schema and regenerate types
   - Assign categories to the published posts
   - Verify visitors can browse by topic

5. **Populate the about/author section**
   - Update the Author document with the owner's name, picture, biography
   - Verify the blog shows who writes it (author byline, about page or section)

**Done when:**
- Sample posts are replaced with the owner's own articles
- "How to get hired in the AI era" is published and readable on its own page
- "Agentic coding" is published and readable on its own page
- Posts have categories or tags so visitors can browse by topic
- The about/author section shows who writes the blog
