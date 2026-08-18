# Supabase keep-alive

## Why this exists

Supabase pauses a free project after ~7 days with no activity. The guide-download
form is the only thing on the site that writes to Supabase, and it does not fire
often enough to clear that window on its own.

A pause is not a soft failure. The project's subdomain stops resolving at all
(NXDOMAIN), so every call fails at the DNS layer. On 2026-08-18 this took the
guide downloads down site-wide until the project was restored from the dashboard.

## Setup (one time)

### 1. Apply the migration

Supabase dashboard → **SQL Editor** → paste the contents of
`migrations/20260818120000_keepalive.sql` → Run.

This creates `public.keepalive_log` (one row, no PII) and `public.keepalive()`,
a security-definer function that anon may invoke and nothing else.

Verify:

```sql
select * from public.keepalive_log;
```

### 2. Add the GitHub secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|---|---|
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` (same as `VITE_SUPABASE_URL`) |
| `SUPABASE_ANON_KEY` | the `sb_publishable_...` key (same as `VITE_SUPABASE_PUBLISHABLE_KEY`) |

Both already ship inside the public JS bundle, so neither is a real secret. They
live in Actions secrets so the values can be rotated in one place.

### 3. Push and test

Commit `.github/workflows/supabase-keepalive.yml`, then run it once by hand:
repo → **Actions → Supabase keep-alive → Run workflow**. A green run prints
`Keep-alive OK. Project last pinged: <timestamp>`.

## Cadence

Mondays, Wednesdays and Fridays, 13:00 UTC (08:00 CDT).

Three times a week rather than two, because GitHub drops scheduled runs under
load and the cadence has to survive a miss. Gaps of 2-3 days mean one skipped run
leaves a 5-day worst case. A twice-weekly schedule would put a *single* miss at
exactly 7 days — on the pause threshold with no margin.

## It is also a monitor

Any non-200 fails the job and GitHub notifies the repo owner. A total connection
failure is reported explicitly as a probable pause. If that alert arrives:

1. Restore the project at <https://supabase.com/dashboard>.
2. Wait a few minutes — a restoring project answers HTTP 521 from Cloudflare
   before it is genuinely up.
3. Re-run the workflow to confirm.

## Known gotcha

GitHub **disables scheduled workflows in a repo with 60 days of no activity**.
This repo is committed to regularly, so it should not trigger, but if the repo
ever goes quiet for two months the pings stop silently and the project will pause
again. Re-enable the schedule from the Actions tab.

## Checking the API by hand

`GET /rest/v1/` returns 401 `"Secret API key required"` even when the project is
perfectly healthy — that endpoint now demands a *secret* key, and the site only
holds a publishable one. Do not read it as an outage. To probe the real path
without writing a row, send an insert that deliberately violates the RLS check:

```bash
curl -sS -X POST "$SUPABASE_URL/rest/v1/leads" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"'"$(printf 'x%.0s' {1..400})"'","email":"probe@example.com","consent":true}'
```

A `42501 new row violates row-level security policy` response means the project
is up, the table exists and the anon insert grant is live. Nothing is written.
