# Claude in Chrome — keep-alive setup script

Paste everything in the **Script** section below into Claude in Chrome. It walks
the browser through the three dashboard tasks that finish the Supabase keep-alive.

## Before you start

1. **The push has to happen first.** GitHub only shows the "Run workflow" button
   for workflows that already exist on the default branch. From the repo root:

   ```bash
   git add .github/workflows/supabase-keepalive.yml \
           supabase/migrations/20260818120000_keepalive.sql \
           supabase/KEEPALIVE.md supabase/CHROME_AGENT_SETUP.md
   git commit -m "chore(supabase): weekly keep-alive ping to prevent free-tier pause"
   git push origin main
   ```

   This touches nothing in `src/`, so the Vercel deploy it triggers rebuilds an
   identical bundle. Leave `public/sitemap.xml` out of the commit — it was already
   modified before this work and is unrelated.

2. Be signed in to both <https://supabase.com/dashboard> and <https://github.com>
   in the browser Claude is attached to.

3. Claude in Chrome will pause for your approval on the write actions (running
   SQL, saving a secret). That is expected — approve them as they come.

---

## Script

> You are setting up a scheduled keep-alive for a Supabase project so it stops
> getting paused for inactivity. There are three tasks. Do them in order. After
> each one, confirm the stated success condition before moving on — do not assume
> a step worked because the page looked right.
>
> Guardrails for the whole job:
> - Do not delete, pause, or restore any project.
> - Do not modify any table other than by running the exact SQL I give you.
> - Do not open, export, or read any rows from the `leads` table. It contains
>   real client contact information.
> - If a page looks different from what I describe, stop and tell me what you see
>   instead of guessing at the nearest similar button.
>
> ### Task 1 — Run the migration
>
> Go to <https://supabase.com/dashboard/project/exraailguvityjjtyduq/sql/new>
>
> Paste this into the SQL editor exactly as written and click **Run**:
>
> ```sql
> begin;
>
> create table if not exists public.keepalive_log (
>   id         smallint primary key default 1,
>   last_ping  timestamptz not null default now(),
>   ping_count bigint not null default 0,
>   constraint keepalive_log_singleton check (id = 1)
> );
>
> insert into public.keepalive_log (id) values (1) on conflict (id) do nothing;
>
> alter table public.keepalive_log enable row level security;
> revoke all on public.keepalive_log from anon, authenticated;
>
> comment on table public.keepalive_log is
>   'Singleton heartbeat row written by public.keepalive(). Holds no PII.';
>
> create or replace function public.keepalive()
> returns timestamptz
> language sql
> security definer
> set search_path = public
> as $$
>   update public.keepalive_log
>      set last_ping  = now(),
>          ping_count = ping_count + 1
>    where id = 1
>   returning last_ping;
> $$;
>
> comment on function public.keepalive() is
>   'Heartbeat for the free-tier inactivity pause. Takes no arguments, touches no other table, returns no PII.';
>
> revoke all on function public.keepalive() from public;
> grant execute on function public.keepalive() to anon;
>
> commit;
> ```
>
> **Success condition:** the editor reports success with no error. Then open a new
> query, run `select * from public.keepalive_log;`, and confirm exactly one row
> comes back with `id = 1`. Tell me the `ping_count` value you see.
>
> ### Task 2 — Copy the API credentials into GitHub
>
> First, get the publishable key. Go to
> <https://supabase.com/dashboard/project/exraailguvityjjtyduq/settings/api-keys>
> and copy the **publishable** key — it starts with `sb_publishable_`. Do **not**
> copy the secret or service_role key; that one must never leave the dashboard.
>
> Now add two repository secrets. For each, go to
> <https://github.com/lucasmurphyrei-cpu/lucasmurphyrealestate-website/settings/secrets/actions/new>
>
> | Name | Value |
> |---|---|
> | `SUPABASE_URL` | `https://exraailguvityjjtyduq.supabase.co` |
> | `SUPABASE_ANON_KEY` | the `sb_publishable_...` key you just copied |
>
> Type the names exactly — they are case-sensitive and the workflow looks for
> these two strings specifically.
>
> **Success condition:** the Actions secrets page lists both `SUPABASE_URL` and
> `SUPABASE_ANON_KEY`. GitHub will show them as hidden values; that is correct.
>
> ### Task 3 — Run the workflow and verify
>
> Go to
> <https://github.com/lucasmurphyrei-cpu/lucasmurphyrealestate-website/actions/workflows/supabase-keepalive.yml>
>
> Click **Run workflow**, leave the branch as `main`, and confirm. Wait for the
> run to finish — it takes well under a minute. Open the completed run, click into
> the `ping` job, and expand the **Ping Supabase** step.
>
> **Success condition:** the job is green and the step log contains
> `Keep-alive OK. Project last pinged:` followed by a timestamp.
>
> If it failed, read me the error line. The three likely causes:
> - `Missing secret` → a secret name is misspelled in Task 2.
> - `HTTP 404` → Task 1's SQL did not actually apply.
> - `PAUSED` / connection failure → the project went back to sleep; it needs a
>   restore from the dashboard before this can pass.
>
> ### Report back
>
> When all three are done, tell me:
> 1. The `ping_count` from Task 1.
> 2. Whether both secrets are listed.
> 3. The timestamp from the successful workflow run.

---

## After it's green

The ping runs itself every Monday, Wednesday and Friday at 8am CDT. You do not
need to touch it again. If the project ever pauses anyway, the workflow fails and GitHub
emails you — that alert is the whole point, so don't mute Actions notifications
for this repo.

See [KEEPALIVE.md](./KEEPALIVE.md) for the full runbook and the recovery steps.
