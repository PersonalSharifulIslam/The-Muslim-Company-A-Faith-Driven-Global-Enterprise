# The Muslim Company — Professional Website

A faith-driven professional website with admin-managed content system for Careers, Newsroom & PR, Notice & Event, and Blog. Includes a full Employee Portal with attendance, leave, tasks, documents, notifications, and profile management.

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
- Auth: JWT (jsonwebtoken + bcryptjs)
  - Admin token: `tmc_admin_token` in localStorage (8h expiry)
  - Employee token: `tmc_employee_token` in localStorage (12h expiry)
- File upload: multer (CVs stored in `artifacts/api-server/uploads/`)

## Where things live

- `artifacts/the-muslim-company/src/lib/api.ts` — admin fetch client
- `artifacts/the-muslim-company/src/lib/auth.tsx` — admin JWT auth context
- `artifacts/the-muslim-company/src/lib/employee-auth.tsx` — employee auth context + empApi()
- `artifacts/the-muslim-company/src/lib/supabase.ts` — type definitions only
- `artifacts/the-muslim-company/src/components/EmployeeLayout.tsx` — dark sidebar layout for Employee Portal
- `artifacts/api-server/src/lib/employee-auth.ts` — employee JWT middleware + signEmployeeToken
- `artifacts/api-server/src/routes/public.ts` — public API routes
- `artifacts/api-server/src/routes/admin.ts` — admin CRUD routes (JWT protected)
- `artifacts/api-server/src/routes/admin-employees.ts` — admin employee management routes
- `artifacts/api-server/src/routes/employee-auth.ts` — employee login + /me
- `artifacts/api-server/src/routes/employee.ts` — all employee portal routes

## Database Schema

**Existing tables:** `jobs`, `applications`, `newsroom_posts`, `notices`, `blog_posts`, `admin_users`

**Employee Portal tables:**
- `employees` — employee accounts (id, employee_id, name, email, password_hash, department, role, position, phone, address, joining_date, status)
- `attendance` — daily check-in/out records (employee_id, date, check_in, check_out, working_hours, status)
- `leave_requests` — leave applications (employee_id, leave_type, reason, start_date, end_date, days, status, admin_note)
- `tasks` — assigned tasks (employee_id, title, description, priority, status, progress, deadline, assigned_by)
- `employee_notifications` — push notifications (employee_id, title, message, type, is_read, broadcast)
- `employee_documents` — HR documents (employee_id, name, category, file_url, description, is_public)

- IDs are SERIAL integers
- Employee ID format: `TMC-YYYY-NNN` (e.g. TMC-2024-001)
- Job business IDs start at 10925 (job_id field)

## Admin Credentials

- Email: `ceo@themuslim.company`
- Password: `admin123tmc`
- Admin login at: `/admin`
- Admin employee management: `/admin/employees`

## Employee Portal

- Login at: `/employee` (use Employee ID or email)
- Dashboard: `/employee/dashboard`
- Attendance: `/employee/attendance` (check-in/check-out with live timer)
- Leave: `/employee/leave` (apply + history)
- Tasks: `/employee/tasks` (update status + progress)
- Documents: `/employee/documents`
- Notifications: `/employee/notifications`
- Profile: `/employee/profile` (edit info + change password)
- Settings: `/employee/settings`

## Login Portal

Footer "Login" button and nav "Portal Login" open a modal with two options:
- Corporate Admin → `/admin`
- Employee Portal → `/employee`

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

**Admin (Bearer JWT — admin token):**
- `GET /api/admin/stats`
- CRUD: `/api/admin/jobs`, `/api/admin/newsroom`, `/api/admin/notices`, `/api/admin/blog`
- `GET/PUT /api/admin/applications`
- CRUD: `/api/admin/employees` (employee management)
- `GET /api/admin/attendance` — view all attendance
- `GET /api/admin/leave` + `PUT /api/admin/leave/:id` — approve/reject leaves
- `GET/POST/PUT/DELETE /api/admin/tasks` — assign and manage tasks
- `POST /api/admin/notifications/send` — send notification (broadcast or targeted)
- `GET/POST/DELETE /api/admin/documents` — manage HR documents

**Employee Portal (Bearer JWT — employee token):**
- `POST /api/employee/auth/login` — returns JWT
- `GET /api/employee/auth/me` — verify token
- `GET /api/employee/dashboard` — dashboard summary
- `GET/POST /api/employee/attendance` + checkin/checkout
- `GET/POST /api/employee/leave`
- `GET/PUT /api/employee/tasks/:id`
- `GET /api/employee/documents`
- `GET /api/employee/notifications` + mark-read
- `GET/PUT /api/employee/profile` + password change

**Auth (admin):**
- `POST /api/auth/login` — returns JWT token
- `GET /api/auth/me` — verify token
- `POST /api/auth/setup` — create first admin (only works when no admins exist)

## Architecture decisions

- Chose Replit PostgreSQL + Express over Supabase (user preference)
- Separate JWT secrets for admin vs employee (SESSION_SECRET + "_employee")
- Employee portal design: dark forest green #0a1a0e + gold #b08d57, Islamic corporate SaaS
- Raw SQL (pool.query) for all routes — keeps it simple
- CV uploads served statically at `/api/uploads/` — local filesystem (non-persistent in production)

## User preferences

- No Supabase — use Replit PostgreSQL + Express API
- Admin email: ceo@themuslim.company
- Islamic corporate aesthetic throughout

## Gotchas

- CV uploads are stored locally in `artifacts/api-server/uploads/` — not persistent across deployments
- Run `pnpm --filter @workspace/db run push` to apply schema changes (dev only)
- The `/api/auth/setup` endpoint only works when `admin_users` table is empty
- File upload field name must be `cv`, form field for job reference is `job_db_id`
- Employee portal routes all require `Authorization: Bearer <employee_token>` header

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
