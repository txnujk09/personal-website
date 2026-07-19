# Personal Health Data Agent — Phase 1: Diagnosis & Plan

> Scope: single user (you) now, schema'd multi-user from day one (`user_id` on every table).
> Stack: standalone Supabase (Postgres, not Lovable-managed) · Vercel cron for daily ingestion · TypeScript.
> Sources: Oura Ring (sleep / readiness / HRV), Strava (runs / activities), Hevy (gym, exercise-level).
> Interface (Telegram) and agent layer (Anthropic API + tool use) are **later phases**.
>
> **This document is Phase 1 only — diagnosis and plan. No application code, no repo scaffolding.**
> Facts below were verified against current (July 2026) provider docs; see [References](#references). Two
> items I could not fetch live (Hevy's Swagger and one client lib were proxy-blocked) are flagged **VERIFY**.

---

## 1. API Audit

### 1.1 Oura API v2

| Aspect | Finding | Impact |
|---|---|---|
| **Auth model** | **OAuth2 only.** Personal Access Tokens were **deprecated in Dec 2025** and no longer work. Even for a single user you must register an OAuth app and do the authorization-code flow once. | Adds a one-time consent + callback step. No "just paste an API key". |
| **Token lifetime** | Access token expires after **~30 days**. | Daily cron easily refreshes in time; a >30-day outage forces re-auth. |
| **Refresh** | Refresh tokens are **single-use / rotating** — each refresh returns a *new* refresh token and invalidates the old one. You must persist the new one atomically. | Losing a rotated token bricks the connection. Handle with care (see risks). |
| **Rate limit** | **5,000 requests / 5 min** per access token (and a separate per-application limit). 429 on exceed. | Non-issue for one user; 30-day backfill is a handful of calls. |
| **Sleep / HRV** | `GET /v2/usercollection/daily_sleep` → daily **score** + contributors (deep, rem, efficiency, latency, timing, total). `GET /v2/usercollection/sleep` → detailed sessions incl. **`average_hrv` (rmssd, ms)**, avg/lowest HR, respiratory rate, phase durations, and HRV **time series**. HRV lives on the **detailed `/sleep`** endpoint, not `daily_sleep`. | Need to hit **both** sleep endpoints per day and join on `day`. |
| **Readiness** | `GET /v2/usercollection/daily_readiness` → **score** + contributors (hrv_balance, resting_heart_rate, body_temperature, recovery_index, activity_balance, previous_day_activity, previous_night). | Contributors are *sub-scores*, not raw values; raw RHR/HRV come from sleep/heartrate. |
| **(Optional) raw HR** | `GET /v2/usercollection/heartrate` → datetime-bounded BPM samples. | Not needed for daily summaries; skip for now. |
| **Backfill** | All collection endpoints accept `start_date` / `end_date` (`YYYY-MM-DD`). Oura serves **up to ~2 years** of history. | **No blocker.** 30 days (or 2 years) is trivial. |
| **Scopes** | Need `daily`, `heartrate`, `personal`. | Set at OAuth app registration. |

### 1.2 Strava API v3

| Aspect | Finding | Impact |
|---|---|---|
| **Auth model** | **OAuth2** (authorization-code). No static key option. | One-time consent + callback, same as Oura. |
| **Token lifetime** | Access token expires **6 hours** after creation. | A once-daily cron **cannot** reuse yesterday's access token — it must refresh every run. |
| **Refresh** | `POST /oauth/token` with `grant_type=refresh_token`. May return a **new** refresh token which **immediately invalidates the old one** — always persist the most recent. Refresh only issues a new access token if the current one expires within 1 hour. | Rotating-token handling required (same as Oura). |
| **Rate limit** | Default **200 requests / 15 min** and **2,000 / day**, per application. | Fine for one user. Detailed per-activity fetches during backfill must be paced (see backfill). |
| **Activities** | `GET /athlete/activities` → summary list. Params: `before` / `after` (epoch), `page`, `per_page` (**max 200**, default 30). `after` sorts oldest-first. Gives distance, moving/elapsed time, avg/max HR, avg speed, cadence, elevation, type/sport_type. | Primary incremental + backfill source. |
| **Per-activity detail** | `GET /activities/{id}` → adds calories, splits, laps, device info. | Optional; one extra call per activity — pace during backfill. |
| **HRV** | Strava does **not** expose HRV. | Expected — HRV is Oura's job. Strava = activities only. |
| **Backfill** | `after=<epoch 30d ago>` + paginate. | **No blocker.** |
| **Scopes** | `activity:read_all` (covers private activities), `read`. | Set at authorization. |

### 1.3 Hevy API

| Aspect | Finding | Impact |
|---|---|---|
| **Access gate** | **Requires Hevy Pro.** API keys and the docs are inaccessible without an active Pro subscription — **confirmed**. | **Hard prerequisite.** If you're not Pro, nothing here works. First thing to verify. |
| **Auth model** | **Static API key** (bearer token) from `hevy.com/settings?developer`. No OAuth, no refresh, no expiry. | Simplest of the three. Store as a secret; no rotation logic. |
| **Base URL** | `https://api.hevyapp.com`, header `api-key: <key>` (bearer). | — |
| **Workouts** | `GET /v1/workouts?page=&pageSize=` (**pageSize max 10**). `GET /v1/workouts/{id}`, `GET /v1/workouts/count`. Responses nest `exercises[]` → `sets[]` with `weight_kg`, `reps`, `distance_meters`, `duration_seconds`, `set_type`, `rpe`, plus `exercise_template_id` / title → **full exercise-level + set-level detail**. | Covers the workout logging requirement. |
| **Incremental sync** | `GET /v1/workouts/events?since=<ISO8601>&page=&pageSize=` returns **updated / deleted** events since a timestamp — the intended incremental primitive. **VERIFY** exact param names & payload against live Swagger once Pro is active; if unavailable, fall back to paging `/v1/workouts` newest-first until `start_time < watermark`. | Enables clean handling of edited/deleted workouts. |
| **Rate limit** | **Not publicly documented (VERIFY).** Community usage suggests generous limits. `pageSize` capped at 10 means a large history = many pages. | 30-day backfill is a few dozen calls — fine. Treat conservatively (throttle). |
| **Backfill** | Page through `/v1/workouts` (10/page) until older than cutoff. | **No blocker** for 30 days; just slower per page. |

### 1.4 Backfill blockers — summary

- **None are hard blockers** for 30+ days. Oura (2 yr), Strava (`after` epoch), Hevy (paged) all support it.
- **Prerequisites that gate the whole build:** (a) **Hevy Pro** must be active; (b) **OAuth apps registered** for Oura + Strava and the **one-time consent** completed to mint the first refresh tokens.
- **Watch item:** Oura's PAT deprecation means the "quick single-user API key" shortcut is gone — plan for real OAuth from the start.

---

## 2. Schema Design (Supabase / Postgres)

Design notes:
- Every domain table carries `user_id uuid` → multi-user ready; single row today.
- Natural keys (`oura_id`, `strava_id`, `hevy_id`, `day`) drive **idempotent upserts** so revisions/backfills are re-runnable.
- Each table keeps a `raw jsonb` copy of the provider payload — cheap insurance against schema drift and future fields.
- **RLS** enabled on all tables (`user_id = auth.uid()`); the cron uses the **service-role** key server-side and bypasses RLS.
- Tokens are secrets — encrypt at rest (Supabase Vault or `pgcrypto`), never expose via a client-readable policy.

```sql
-- === identity ===
create table users (
  id          uuid primary key default gen_random_uuid(),
  email       text unique,
  timezone    text not null default 'UTC',   -- for day-boundary alignment across providers
  created_at  timestamptz not null default now()
);
-- (Alternatively make users.id reference auth.users(id) if using Supabase Auth — see open questions.)

-- === credentials ===  (Oura/Strava = OAuth rotating; Hevy = static key)
create table oauth_tokens (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references users(id) on delete cascade,
  provider            text not null check (provider in ('oura','strava','hevy')),
  access_token        text not null,          -- encrypt at rest; for Hevy this is the API key
  refresh_token       text,                   -- null for Hevy
  expires_at          timestamptz,            -- null for Hevy (no expiry)
  scope               text,
  external_account_id text,                    -- Strava athlete id / provider account id
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, provider)
);

-- === Oura: sleep (daily_sleep summary + main /sleep session incl. HRV) ===
create table sleep_daily (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references users(id) on delete cascade,
  day                 date not null,                 -- Oura's attributed calendar day
  oura_sleep_id       text,                          -- id of the main sleep session
  score               int,
  total_sleep_seconds int,
  deep_sleep_seconds  int,
  rem_sleep_seconds   int,
  light_sleep_seconds int,
  efficiency          int,
  latency_seconds     int,
  average_hrv         int,                           -- rmssd ms, from detailed /sleep
  lowest_heart_rate   int,
  average_heart_rate  numeric,
  respiratory_rate    numeric,
  bedtime_start       timestamptz,
  bedtime_end         timestamptz,
  raw                 jsonb,                          -- merged daily_sleep + sleep payloads
  ingested_at         timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, day)
);
create index sleep_daily_user_day_idx on sleep_daily (user_id, day desc);

-- === Oura: readiness ===
create table readiness_daily (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references users(id) on delete cascade,
  day                   date not null,
  oura_id               text,
  score                 int,
  temperature_deviation numeric,
  temperature_trend_dev numeric,
  hrv_balance           int,                          -- contributor sub-score
  resting_heart_rate    int,                          -- contributor sub-score
  recovery_index        int,
  contributors          jsonb,                         -- full contributor block
  raw                   jsonb,
  ingested_at           timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (user_id, day)
);
create index readiness_daily_user_day_idx on readiness_daily (user_id, day desc);

-- === Strava: activities ===
create table activities (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references users(id) on delete cascade,
  strava_id           bigint not null,
  type                text,                            -- Run, Ride, ...
  sport_type          text,
  name                text,
  start_date          timestamptz,                     -- UTC
  start_date_local    timestamptz,
  timezone            text,
  distance_m          numeric,
  moving_time_s       int,
  elapsed_time_s      int,
  total_elevation_m   numeric,
  average_speed       numeric,
  max_speed           numeric,
  average_heartrate   numeric,
  max_heartrate       numeric,
  average_cadence     numeric,
  calories            numeric,                          -- detailed endpoint only
  raw                 jsonb,
  ingested_at         timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, strava_id)
);
create index activities_user_start_idx on activities (user_id, start_date desc);

-- === Hevy: workouts ===
create table workouts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references users(id) on delete cascade,
  hevy_id        text not null,
  title          text,
  description    text,
  start_time     timestamptz,
  end_time       timestamptz,
  ext_updated_at timestamptz,                           -- Hevy's updated_at, drives revisions
  raw            jsonb,
  ingested_at    timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (user_id, hevy_id)
);
create index workouts_user_start_idx on workouts (user_id, start_time desc);

-- === Hevy: flattened sets (exercise-level detail) ===
create table workout_sets (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references users(id) on delete cascade,  -- denormalized for RLS + per-exercise queries
  workout_id           uuid not null references workouts(id) on delete cascade,
  exercise_index       int not null,
  exercise_template_id text,
  exercise_title       text,
  set_index            int not null,
  set_type             text,                             -- normal, warmup, dropset, failure
  weight_kg            numeric,
  reps                 int,
  distance_m           numeric,
  duration_s           int,
  rpe                  numeric,
  unique (workout_id, exercise_index, set_index)
);
create index workout_sets_workout_idx on workout_sets (workout_id);
create index workout_sets_user_exercise_idx on workout_sets (user_id, exercise_template_id);

-- === cron observability ===
create table sync_log (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references users(id) on delete cascade,
  run_id            uuid,                                -- groups all providers in one cron invocation
  provider          text not null check (provider in ('oura','strava','hevy')),
  trigger           text not null default 'cron' check (trigger in ('cron','backfill','manual')),
  status            text not null check (status in ('running','success','partial','error')),
  window_start      timestamptz,                          -- range requested
  window_end        timestamptz,
  records_fetched   int default 0,
  records_upserted  int default 0,
  records_failed    int default 0,
  http_status       int,
  error             text,
  started_at        timestamptz not null default now(),
  finished_at       timestamptz
);
create index sync_log_user_provider_started_idx on sync_log (user_id, provider, started_at desc);

-- === durable incremental watermark (separate from the append-only log) ===
create table sync_state (
  user_id        uuid not null references users(id) on delete cascade,
  provider       text not null check (provider in ('oura','strava','hevy')),
  last_synced_at timestamptz,                             -- high-water mark
  cursor         jsonb,                                    -- provider-specific (strava after-epoch, hevy events-since, oura last day)
  updated_at     timestamptz not null default now(),
  primary key (user_id, provider)
);
```

Indexing rationale: every read is "this user, recent days/activities first", so each domain table gets a `(user_id, <time> desc)` index (the natural-key `unique` constraints double as lookup indexes for upserts). `workout_sets` additionally indexes `(user_id, exercise_template_id)` for "show my bench-press history".

---

## 3. Ingestion Plan

### 3.1 Daily Vercel cron flow

- **Trigger:** `vercel.json` cron (e.g. `0 8 * * *` UTC) → `GET /api/cron/sync`. Guard the route with a `CRON_SECRET` header check so only Vercel can invoke it. Use the Supabase **service-role** key (server-only env var).
- **Per run** (one `run_id`), loop users → loop providers:
  1. **Ensure valid token.** Oura: refresh if `expires_at` within a few days. Strava: refresh **every run** (6 h access lifetime). Hevy: static key, no refresh. On refresh, **persist the rotated refresh token *before* using the new access token** (rotation is single-use).
  2. **Compute the fetch window** from `sync_state.last_synced_at`, minus a deliberate overlap (see 3.3).
  3. **Fetch incrementally** (3.2), **upsert** (3.3), update `sync_state`, and write one `sync_log` row (`running` → `success`/`partial`/`error`) with counts.
- **Isolation:** a failure in one provider must not abort the others — catch per provider, mark that provider `error`, continue.

### 3.2 Incremental fetch (per provider)

- **Oura** — request `daily_sleep`, `daily_readiness`, and detailed `sleep` for `start_date = last_synced_day − 3` … `end_date = today + 1`. The 3-day lookback re-pulls the window Oura tends to revise. Join `sleep` (HRV) to `daily_sleep` (score) on `day`; upsert both Oura tables.
- **Strava** — `GET /athlete/activities?after=<epoch(last_start − 1 day)>&per_page=200`, paginate. Optionally follow up with `GET /activities/{id}` for `calories` on new rows only (pace it). Upsert on `strava_id`.
- **Hevy** — `GET /v1/workouts/events?since=<last_synced_at>` (pageSize 10, paginate): `updated` → upsert workout + **replace** its sets; `deleted` → delete workout (sets cascade). Fallback if `events` is unavailable: page `/v1/workouts` newest-first until `start_time < last_synced_at`.

### 3.3 Upsert strategy (corrected / late data)

- All writes are `INSERT … ON CONFLICT (<natural key>) DO UPDATE SET …, updated_at = now()`, replacing scored columns **and** `raw`. Oura's revised scores therefore overwrite cleanly.
- **Oura revisions:** covered by the 3-day re-pull window + `ON CONFLICT (user_id, day)`.
- **Hevy edited workouts:** in one transaction, `delete from workout_sets where workout_id = …` then re-insert the current sets, so removed/renamed sets don't leave orphans. `deleted` events remove the workout.
- **Strava:** activities are rarely edited; the small overlap window + `ON CONFLICT (user_id, strava_id)` handles the occasional rename/HR correction.
- Idempotency means the daily cron and the backfill share the exact same upsert path — re-running never duplicates.

### 3.4 One-off 30-day backfill script

- A standalone TS script (`scripts/backfill.ts`) run **locally** (`tsx`/`bun`) against prod Supabase with the service-role key — **not** a Vercel cron, to avoid serverless timeouts.
- Params: `--days=30` (default), `--provider=all|oura|strava|hevy`, `--user=<id>`.
- Per provider: Oura `start_date = today − 30`; Strava `after = epoch(today − 30)` paginate oldest-first; Hevy page `/v1/workouts` until `start_time < cutoff`. Throttle (esp. Strava detailed calls and Hevy's 10/page) to stay under rate limits.
- Writes `sync_log` rows with `trigger='backfill'`, seeds `sync_state` so the first daily cron continues seamlessly. Fully idempotent → safe to re-run / extend the window later.

---

## 4. Risks & Unknowns

| # | Risk | Likelihood × Impact | Mitigation |
|---|---|---|---|
| 1 | **Hevy Pro not active** → no API access at all. | Med × High | **Verify first.** Subscribe before Phase 2; if you'd rather not pay, drop Hevy from v1 and design `workouts`/`workout_sets` as a later add. |
| 2 | **Oura PAT deprecated (Dec 2025)** → must implement full OAuth even for one user. | High × Med | Build a tiny one-time localhost OAuth flow (or use Oura's sandbox redirect) to mint the first tokens; budget ~half a session for OAuth plumbing across Oura + Strava. |
| 3 | **Rotating refresh tokens (Oura + Strava)** — a crash between refresh and DB write permanently invalidates the token. | Med × High | Write the new token **before** first use of the new access token; make the refresh step retry-safe; alert on refresh failure. Consider briefly retaining the prior token. |
| 4 | **Strava 6-hour access token** — cron must refresh every run, not reuse. | High × Low | Always refresh-then-fetch in the Strava branch; never cache access tokens across runs. |
| 5 | **Hevy API under-documented** (events endpoint semantics, rate limits) — **VERIFY** against live Swagger once Pro. | Med × Med | Thin client with a `/v1/workouts` paging fallback if `events` differs; throttle conservatively; keep `raw` payloads to adapt to field changes. |
| 6 | **Vercel serverless timeouts** (Hobby ~10 s; Pro/Fluid longer) — backfill or a slow multi-provider run overruns. | Med × Med | Keep the daily cron tiny (incremental only); run backfill locally. Split providers into separate cron routes if the combined run gets slow. |
| 7 | **Vercel Hobby cron limits** (once-daily, few crons). | Low × Low | Daily-only fits Hobby; upgrade to Pro only if you want intra-day syncs. |
| 8 | **Token secrets in Postgres.** | Low × High | Encrypt with Supabase Vault / `pgcrypto`; service-role only; RLS never exposes `oauth_tokens` to a client role. |
| 9 | **Day-boundary mismatches** (Oura `day` vs Strava UTC vs local time). | Med × Low | Store both UTC and local timestamps; key Oura tables on Oura's `day`; carry `users.timezone`. |
| 10 | **Two-weekend timeline.** Main sinks: OAuth for 2 providers + Hevy Pro/verification. | Med × Med | Weekend 1: Supabase schema + OAuth + token storage + backfill. Weekend 2: daily cron + upserts + `sync_log`. Defer detailed Strava per-activity calls and Telegram/agent to later. |

---

## 5. Open Questions (need your call before Phase 2)

1. **Repo placement.** I put this `PLAN.md` in `personal-website` (a feature branch, so easily moved). The health agent is a **new** project — do you want a **dedicated repo** (e.g. `health-agent`) created for Phase 2 instead of living here or in `simplytk-mentor-hub`?
2. **Hevy Pro** — is it already active on your account? (Gates the entire Hevy path.)
3. **Vercel plan** — Hobby or Pro? Affects cron frequency and any in-cloud backfill timeouts.
4. **Users source of truth** — plain app-managed `users` table (as drafted), or tie `users.id` to **Supabase Auth** (`auth.users`) now so RLS/`auth.uid()` works out of the box?
5. **Token encryption** — Supabase Vault, `pgcrypto`, or app-level encryption? (I'd default to Vault.)
6. **Raw retention** — keep `raw jsonb` on every table (future-proof, more storage) or slim to typed columns only?
7. **Oura scope** — sleep/readiness/HRV only, or also pull Oura's own activity/workout collections (Strava + Hevy already cover activity)?
8. **Backfill depth** — firm 30 days, or grab the full ~2 years Oura now offers (Strava/Hevy as far back as they go) since it's cheap and one-time?
9. **Failure alerting** — want a minimal "sync failed" notification stub now (email/log), or defer all notifications to the Telegram phase?

---

## References

Verified July 2026. Items marked **VERIFY** in §1.3 could not be fetched live (Hevy Swagger and a client lib were proxy-blocked) and should be confirmed against the live docs once Hevy Pro is active.

- Oura — OAuth2 authentication & token rotation: https://cloud.ouraring.com/docs/authentication
- Oura — API v2 reference (daily_sleep, daily_readiness, sleep, heartrate): https://api.ouraring.com/v2/docs
- Oura — sleep / HRV / readiness fields overview: https://openwearables.io/blog/oura-api-accessing-ring-data-sleep-hrv-readiness
- Strava — authentication, 6 h access token, rotating refresh: https://developers.strava.com/docs/authentication/
- Strava — API v3 reference (activities, pagination, before/after): https://developers.strava.com/docs/reference/
- Strava — rate limits & activity data guide: https://openwearables.io/blog/strava-api-developer-guide-activities-heart-rate-gps-data
- Hevy — API docs (Swagger, Pro-gated): https://api.hevyapp.com/docs/
- Hevy — key location: https://hevy.com/settings?developer
- Hevy — client reference (endpoints, pageSize 10): https://github.com/chrisdoc/hevy-mcp

---

*End of Phase 1. Awaiting your answers to §5 before starting Phase 2 (schema migration + scaffolding).*
