# The Muslim Company — Professional Website

A faith-driven professional website with admin-managed content system for Careers, Newsroom & PR, Notice & Event, and Blog.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/the-muslim-company run dev` — run the frontend (Vite)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifacts/the-muslim-company)
- Backend: Express 5 (artifacts/api-server)
- DB: PostgreSQL + raw SQL via `@workspace/db` pool
- Auth: JWT (jsonwebtoken + bcryptjs), token stored as `tmc_admin_token` in localStorage
- File upload: multer (CVs stored in `artifacts/api-server/uploads/`)

## Where things live

- `artifacts/the-muslim-company/src/lib/api.ts` — fetch-based API client (uses `/api/*` relative URLs)
- `artifacts/the-muslim-company/src/lib/auth.tsx` — JWT auth context (replaces Supabase auth)
- `artifacts/the-muslim-company/src/lib/supabase.ts` — type definitions only (Job, Application, NewsPost, Notice, BlogPost, STATUS_LABELS, STATUS_COLORS)
- `artifacts/api-server/src/routes/public.ts` — public API routes (jobs, newsroom, notices, blog, applications)
- `artifacts/api-server/src/routes/admin.ts` — admin CRUD routes (all protected by JWT)
- `artifacts/api-server/src/routes/auth.ts` — login, /me, setup endpoints
- `artifacts/api-server/src/lib/auth-middleware.ts` — JWT middleware

## Database Schema

Tables: `jobs`, `applications`, `newsroom_posts`, `notices`, `blog_posts`, `admin_users`
- IDs are SERIAL integers (not UUIDs)
- Job business IDs start at 10925 (job_id field)
- Reference format: `BD/[Initials]/[JobID]/[Year]/[6-char]`

## Admin Credentials

- Email: `ceo@themuslim.company`
- Password: `admin123tmc`
- Admin login at: `/admin`

## API Routes

**Public:**
- `GET /api/jobs` — active jobs list
- `GET /api/jobs/:slug` — single job
- `GET /api/newsroom` — published news
- `GET /api/newsroom/:slug` — single news article
- `GET /api/notices` — all notices
- `GET /api/blog` — published blog posts
- `GET /api/blog/:slug` — single blog post
- `GET /api/applications/lookup/:ref` — check application status
- `POST /api/applications` — submit application (multipart/form-data, field: `job_db_id`)

**Admin (Bearer JWT required):**
- `GET /api/admin/stats`
- CRUD: `/api/admin/jobs`, `/api/admin/newsroom`, `/api/admin/notices`, `/api/admin/blog`
- `GET/PUT /api/admin/applications`

**Auth:**
- `POST /api/auth/login` — returns JWT token
- `GET /api/auth/me` — verify token
- `POST /api/auth/setup` — create first admin (only works when no admins exist)

## Architecture decisions

- Chose Replit PostgreSQL + Express over Supabase (user preference, no external dependency)
- JWT stored in localStorage (`tmc_admin_token`) — 8h expiry
- Raw SQL (pool.query) instead of Drizzle ORM for admin routes — keeps it simple
- CV uploads served statically at `/api/uploads/` — local filesystem (non-persistent in production)
- Application status lookup returns safe subset of fields (excludes contact details, education etc.)

## User preferences

- No Supabase — use Replit PostgreSQL + Express API
- Admin email: ceo@themuslim.company

## Gotchas

- CV uploads are stored locally in `artifacts/api-server/uploads/` — not persistent across deployments
- Run `pnpm --filter @workspace/db run push` to apply schema changes (dev only)
- The `/api/auth/setup` endpoint only works when `admin_users` table is empty
- File upload field name must be `cv`, form field for job reference is `job_db_id` (database primary key)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
