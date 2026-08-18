-- Keep-alive endpoint for the free-tier pause problem.
--
-- Supabase pauses a free project after ~7 days with no activity. This site's only
-- Supabase write is the guide-download form, and Lucas does not get enough
-- submissions to clear that window reliably. When the project pauses its
-- subdomain stops resolving entirely (NXDOMAIN), which is not a graceful
-- degradation -- see the ordering hazard in GuideLeadLanding.tsx.
--
-- A scheduled job (.github/workflows/supabase-keepalive.yml) calls
-- public.keepalive() on a cadence well inside the 7-day window, so the project
-- never idles out.
--
-- Why an RPC and not a plain SELECT: anon has INSERT-only on public.leads
-- (see 20260802000000_intake_tables.sql) and no SELECT anywhere, so there is no
-- table the keep-alive can legitimately read. Granting anon SELECT on a real
-- table to solve that would widen the public surface for no reason. A
-- security-definer function is a single, fixed entry point: anon can invoke it
-- and nothing else, and it performs a genuine write so the activity is
-- unambiguous rather than relying on a read counting as "activity".

begin;

-- Singleton row. The id check keeps this table from ever growing.
create table if not exists public.keepalive_log (
  id         smallint primary key default 1,
  last_ping  timestamptz not null default now(),
  ping_count bigint not null default 0,
  constraint keepalive_log_singleton check (id = 1)
);

insert into public.keepalive_log (id) values (1) on conflict (id) do nothing;

-- No policies are created on purpose: with RLS on and no policy, the table is
-- unreachable through PostgREST by anon. Only the definer function below and a
-- dashboard/service-role session can touch it.
alter table public.keepalive_log enable row level security;
revoke all on public.keepalive_log from anon, authenticated;

comment on table public.keepalive_log is
  'Singleton heartbeat row written by public.keepalive(). Holds no PII. Read it to confirm the scheduled ping is still running.';

create or replace function public.keepalive()
returns timestamptz
language sql
security definer
set search_path = public
as $$
  update public.keepalive_log
     set last_ping  = now(),
         ping_count = ping_count + 1
   where id = 1
  returning last_ping;
$$;

comment on function public.keepalive() is
  'Heartbeat for the free-tier inactivity pause. Writes public.keepalive_log and returns the new timestamp. Safe to call publicly: takes no arguments, touches no other table, returns no PII.';

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon;

commit;
