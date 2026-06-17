#!/usr/bin/env node
/**
 * Build-time Google Reviews fetcher.
 *
 * Pulls live reviews from the Google Places API (New) and writes them to
 * src/pages/preview/_shared/googleReviews.json, which GoogleReviewsBadge.tsx
 * renders inline (no redirect). Re-run this whenever you want fresh reviews,
 * then commit + redeploy.
 *
 * Setup (one time):
 *   1. Google Cloud Console -> enable "Places API (New)".
 *   2. Create an API key (restrict it to the Places API).
 *   3. Find your Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
 *
 * Usage:
 *   GOOGLE_MAPS_API_KEY=xxx GOOGLE_PLACE_ID=ChIJ... node scripts/fetch-google-reviews.mjs
 *   # or pass as flags:
 *   node scripts/fetch-google-reviews.mjs --key=xxx --place=ChIJ...
 *
 * Notes:
 *   - The Places API returns up to 5 reviews (Google's "most relevant"); you
 *     cannot choose which. The overall rating + total count are exact.
 *   - Google's terms require attribution (kept via the Google "G" + "Google
 *     Reviews" label in the UI) and that cached review data be refreshed
 *     periodically. Re-run this script on a cadence (e.g. monthly).
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "../src/pages/preview/_shared/googleReviews.json");

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : undefined;
}

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || arg("key");
const PLACE_ID = process.env.GOOGLE_PLACE_ID || arg("place");

if (!API_KEY || !PLACE_ID) {
  console.error(
    "Missing credentials.\n" +
      "  Provide GOOGLE_MAPS_API_KEY and GOOGLE_PLACE_ID via env vars or --key= / --place= flags.\n" +
      "  Example: GOOGLE_MAPS_API_KEY=xxx GOOGLE_PLACE_ID=ChIJ... node scripts/fetch-google-reviews.mjs"
  );
  process.exit(1);
}

const FIELD_MASK = "displayName,rating,userRatingCount,googleMapsUri,reviews";
const URL = `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}`;

function initialOf(name) {
  const ch = (name || "").trim().charAt(0).toUpperCase();
  return /[A-Z0-9]/.test(ch) ? ch : "G";
}

async function main() {
  const res = await fetch(URL, {
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Places API request failed (${res.status}).`);
    console.error(body);
    if (res.status === 403) {
      console.error(
        '\nHint: 403 usually means "Places API (New)" is not enabled for this key, or the key is restricted.'
      );
    }
    process.exit(1);
  }

  const place = await res.json();
  const rawReviews = Array.isArray(place.reviews) ? place.reviews : [];

  const reviews = rawReviews.map((r) => {
    const name = r.authorAttribution?.displayName?.trim() || "Google user";
    const text = (r.originalText?.text || r.text?.text || "").trim();
    return {
      name,
      initial: initialOf(name),
      photo: r.authorAttribution?.photoUri || null,
      rating: typeof r.rating === "number" ? r.rating : 5,
      relativeTime: r.relativePublishTimeDescription || "",
      text,
    };
  });

  const out = {
    rating: typeof place.rating === "number" ? place.rating : 5,
    total: typeof place.userRatingCount === "number" ? place.userRatingCount : reviews.length,
    fetchedAt: new Date().toISOString().slice(0, 10),
    placeUri: place.googleMapsUri || "",
    reviews,
  };

  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(
    `Wrote ${reviews.length} reviews (rating ${out.rating}, ${out.total} total) for "${
      place.displayName?.text || "place"
    }" -> ${OUT_PATH}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
