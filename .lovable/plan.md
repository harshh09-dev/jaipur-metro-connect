
# JMRC Connect — Full UX Redesign + Auth + RBAC (Phase-in-one)

## Goal
Rebuild the app around a clear UX journey: **Public browse → Sign up / Login → Passenger dashboard → Personalized services**, plus a **hidden `/admin` portal** with role-based access. Every existing page and feature stays; visuals get a premium, unified redesign (Apple/Linear/Vercel aesthetic).

## Backend (Lovable Cloud)
Tables (with GRANTs + RLS):
- `profiles` — id (=auth.uid), full_name, phone, email, dob, gender, address, city, state, pincode, gov_id, emergency_contact, avatar_url, passenger_id (e.g. `JMR-2026-XXXXX`), created_at.
- `smart_cards` — id, user_id (unique), card_number, balance (numeric), status (active/blocked), issue_date, expiry_date.
- `transactions` — id, user_id, card_id, type (recharge/journey/refund), amount, balance_after, description, created_at.
- `complaints` — id, user_id, category, subject, description, station, status (submitted/under_review/resolved/rejected), admin_response, image_url, created_at, updated_at.
- `tickets` — id, user_id, from_station, to_station, fare, qr_payload, status, journey_date, created_at.
- `app_role` enum (`admin`, `passenger`) + `user_roles` table + `has_role()` security-definer function.

Triggers:
- On `auth.users` insert → create `profiles` row (from raw_user_meta_data), create `smart_cards` row with random card_number and ₹0 balance, assign default `passenger` role.

RLS: users can select/update **their own** rows; admins (via `has_role`) can select/update all. Admin promotion is manual (user runs SQL — instructions given).

## Auth flow
- `/auth` — combined Login / Register (email+password + Google). Register form collects all required fields; stored in `user_metadata` so the trigger writes them to `profiles`.
- Protected features route through `<RequireAuth>` — unauthenticated click → redirect `/auth?next=<path>`.
- `<RequireAdmin>` — checks `has_role(uid,'admin')`, else 403 page.

## Routing
Public: `/`, `/journey-planner`, `/metro-map`, `/stations`, `/timings`, `/alerts`, `/announcements`, `/tourism`, `/about`, `/contact`, `/faq`, `/emergency`.
Protected: `/dashboard`, `/smart-card`, `/tickets/buy`, `/tickets`, `/journeys`, `/complaints`, `/complaints/new`, `/track-complaint`, `/notifications`, `/profile`.
Admin (hidden — not in nav/footer): `/admin` (login) → `/admin/dashboard`, `/admin/users`, `/admin/complaints`, `/admin/smart-cards`, `/admin/announcements`, `/admin/analytics`, `/admin/settings`, etc.
403 → `/unauthorized`.

## Design system
- Tailwind tokens (index.css) refreshed:
  - bg `#F8FAFC`, surface `#FFFFFF`, border `#E2E8F0`, text `#0F172A`, muted `#64748B`, primary (JMRC deep blue) `#123B63`, secondary `#2563EB`, accent `#0EA5E9`, success `#22C55E`, warning `#F59E0B`, danger `#EF4444`.
  - Radius 20px on cards; softer shadows (`shadow-[0_8px_30px_-12px_rgba(15,23,42,0.08)]`).
  - Inter everywhere (drop Manrope).
- New primitives: `PageHeader`, `KpiCard`, `GlassCard`, `SectionHeading`, `EmptyState`, `Skeleton`, `AnimatedCounter`.
- Framer Motion installed for page fade/slide, card reveal, hover lift.
- Passenger app shell: floating rounded navbar (public) vs. **sidebar shell** after login (Linear-style).
- Admin shell: separate dark enterprise sidebar layout — completely different chrome, never linked from public UI.

## Redesigned surfaces
Hero (with embedded journey planner + live-status glass cards + next-train timer + quick actions), Journey Planner, Metro Map, Stations, Timings, Announcements, Alerts, Tourism, FAQ (new), Emergency (new), About (new), Contact (new), Auth, Passenger Dashboard, Smart Card (live user data + recharge modal), Tickets (buy + history + QR), Complaints (list + create + track — user-scoped), Profile (edit), Admin Dashboard + all admin modules with KPI cards, charts (recharts), user table, complaints queue.

## Data wiring
- All `localStorage`-backed data (`smart-card-data.ts`, complaints) replaced with Supabase queries scoped to `auth.uid()`.
- Smart card always shows the logged-in user's name/number/balance (no placeholders).
- Complaints list filters `user_id = auth.uid()` for passengers; admin sees all.
- Recharge = insert transaction + increment balance (RPC for atomicity).

## Kept intact
Every existing page and route remains reachable; the metro map animation, route drawing, tourist data, timings data, announcements data — all preserved. No functionality removed.

## Deliverables (single pass)
1. Migration: enum, tables, triggers, RLS, GRANTs, has_role.
2. `AuthProvider`, `RequireAuth`, `RequireAdmin`, `useProfile`, `useSmartCard`, `useComplaints` hooks.
3. New pages: `/auth`, `/dashboard`, `/profile`, `/tickets*`, `/journeys`, `/notifications`, `/faq`, `/emergency`, `/about`, `/contact`, `/unauthorized`, `/admin/*`.
4. Redesign of every existing page against the new design system.
5. New Layouts: `PublicShell`, `PassengerShell` (sidebar), `AdminShell` (dark sidebar).
6. Framer Motion + recharts + zod added.

## Note on scope
This is a very large single change. Some polish items (per-page micro-interactions, illustration assets) may land as follow-ups. First admin: after you sign up, tell me your email and I'll run one SQL to grant admin.
