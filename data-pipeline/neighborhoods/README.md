# Neighborhood profiles — data pipeline

Generates the municipality profile and quiz data the site serves. Folded in from a
standalone `County Neighborhood Profiles` workspace on 2026-08-19, because the website was
its only consumer and keeping them apart produced silent drift.

## The drift this fold ended

`quiz-attributes.json` existed here *and* in `src/data/neighborhoods/`, and the two
disagreed on `median_sale_price` for nine of 69 municipalities — by up to $217,189. Neither
declared an authority. Settled by checking both against RapidStats: every website value
matched, so `src/data/neighborhoods/` was right and this copy was a stale generation.
Evidence and the discarded copy: `~/.attic/2026-08-19/quiz-attributes-drift/`.

## Running it

```bash
cd data-pipeline/neighborhoods
python3 tools/fetch_census.py
python3 tools/update_profiles.py
python3 tools/export_json.py
```

Paths are `PROJECT_ROOT`-relative, so the tools work unchanged from this location.

## Open item — the reason the drift was possible

`tools/export_json.py` writes to `output/json/`, and getting that into the site is still a
manual copy into `src/data/neighborhoods/`. Until it writes there directly, the same drift
can recur. Tracked as `website/T7` in
`Realtor OS/Engines/Ops/reference/workspaces.json`; the doctor's `dupes.hash` check watches
the pair in the meantime.

`output/json/new-*.json` are the unfinished ten-municipality batch from February — see
`HANDOFF-add-10-municipalities.md`.

## Raw feeds

`.tmp/` held ~1.1 GB of Redfin and Zillow bulk downloads. Moved to
`~/.attic/2026-08-19/neighborhood-raw-data/`; the fetch tools re-download them, so it can be
deleted to reclaim the space.
