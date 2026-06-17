# Pre-Launch Checklist — things to come back to before going live

Running list of items to resolve before promoting the PreviewV1 redesign + market hub to production.
Add to this as we build.

## Action required by Lucas (outside the codebase)

- [ ] **Contact form Google Sheet:** add two columns to the sheet behind the
      `VITE_GOOGLE_SHEETS_URL` Apps Script endpoint so the new contact-form fields are captured:
  - `preferredMethod` (Phone call / Text / Email)
  - `bestTime` (Morning / Midday / Afternoon / Evening — only sent when "Phone call" is chosen)
  - The preview contact page (`/preview/v1/contact`) already posts these field names; they
    just need matching columns or the Apps Script will drop them.
- [ ] **Guide lead-capture column:** the guide download landing pages post a `guide` field
      (which guide was requested). Add a `guide` column to the same sheet.
- [x] **Guide PDF (First-Time Home Buyers):** real PDF found in `public/` and wired
      (`downloadUrl: /Your_First_Time_Home_Buyers_Guide_to_The_Milwaukee_Metro_Area.pdf`). — 2026-06-14
- [ ] **Guide PDFs (remaining):** other guide download pages capture the lead but still need a
      PDF. Once one exists, drop it in `public/` and set its `downloadUrl` in
      `src/pages/preview/guides/guidesData.ts`. (A `Seasonal-Home-Maintenance-Guide.pdf` already
      exists in `public/` too.)

## Favicon / branding

- [ ] **Favicon (Lovable icon on Google):** the new Provision-house favicons ARE in the repo
      (`public/favicon-32.png`, `favicon.png`, `favicon.ico`, `apple-touch-icon.png`, linked in
      `index.html`). Google still shows the old Lovable icon because the new version is NOT yet
      DEPLOYED to production — Google reads the favicon from the live site. After deploy, Google
      re-crawls favicons on its own schedule (days to ~weeks); nudge via Search Console.
      ALSO: a stale `public/favicon.svg` (Feb 19) remains and is not linked — replace or delete it
      so it can't be auto-discovered.

## Optional: live Google reviews feed

- [ ] The sticky Google Reviews badge popup currently shows curated real client quotes + a
      "Read all reviews on Google" link. For a LIVE auto-updating feed in the popup, wire a free
      widget (Featurable / Elfsight / Trustindex) or the Google Places API (needs the Place ID +
      an API key). Swap the `REVIEWS` array in `src/pages/preview/_shared/GoogleReviewsBadge.tsx`.

## Content / assets to replace before launch

- [ ] **Hero videos** — currently generic Pexels stock clips; swap in real local drone footage.
- [ ] **Placeholder photos** — guide/card/background images are free-license Wikimedia/Pexels
      stand-ins; replace with Lucas's own listing photos where preferred.
- [ ] **Google rating** — homepage reviews badge shows "5.0"; confirm the real rating + review count.
- [ ] **Origin-story copy** — About section bio is a plausible draft; confirm wording.
- [ ] **Photo-less small villages** — some market municipalities still lack a featured photo.

## Done / resolved

- [x] **Phone number standardized** to (414) 458-1952 across the site (was (414)-269-4909 in
      Navbar, Contact, tools, PDFs, quiz, PreviewV2). — 2026-06-14

## Decisions still open

- [ ] **Branch integration / merge strategy** — feat/seo-infrastructure → feat/market-hub →
      feat/market-profile-enrichment are stacked and unmerged atop the uncommitted PreviewV1 redesign.
- [ ] **Accuracy spot-check** of the 59 municipality enrichments.
- [ ] **Promote PreviewV1 homepage to production** (currently lives under /preview/v1).
