/**
 * Refresh the county market-update video links from YouTube.
 *
 *   npx tsx scripts/refreshCountyVideos.ts --dry-run
 *   npx tsx scripts/refreshCountyVideos.ts
 *   npx tsx scripts/refreshCountyVideos.ts --month "September 2026" --series Report
 *
 * Reads the channel's public RSS feed. No API key, no quota, no auth — YouTube
 * publishes this for every channel and it carries the last 15 uploads, which is
 * comfortably more than the 8 videos posted per month.
 *
 * Two series are published per county each month ("Market Update" and "Market
 * Report"). They are NOT interchangeable, and July 2026 shipped a mix of both by
 * accident, so the series is explicit here rather than inferred. Default: Update.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CHANNEL_ID = "UCmmrgDSmMffaH-OpNFPU88w"; // @LucasMurphy-LivingInMilwaukee
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const DATA_FILE = resolve(import.meta.dirname, "../src/data/countyMarketData.ts");
const COUNTIES = ["Waukesha", "Milwaukee", "Ozaukee", "Washington"];

const arg = (flag: string) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const dryRun = process.argv.includes("--dry-run");
const series = arg("--series") ?? "Update";

type Video = { title: string; id: string; month: string; county: string; series: string };

function parseFeed(xml: string): Video[] {
  const out: Video[] = [];
  for (const [, entry] of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
    const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
    if (!title || !id) continue;
    // "August 2026 | Waukesha County Real Estate Market Update"
    const m = title.match(/^(\w+ \d{4})\s*\|\s*(\w+) County Real Estate Market (\w+)$/);
    if (!m) continue;
    out.push({ title, id, month: m[1], county: m[2], series: m[3] });
  }
  return out;
}

const monthKey = (m: string) => {
  const [name, year] = m.split(" ");
  const i = ["January","February","March","April","May","June","July",
             "August","September","October","November","December"].indexOf(name);
  return Number(year) * 12 + i;
};

const res = await fetch(FEED);
if (!res.ok) throw new Error(`feed fetch failed: ${res.status}`);
const videos = parseFeed(await res.text());
if (!videos.length) throw new Error("no parseable market videos in the feed — title format may have changed");

// Default to the newest month actually present, so this needs no argument each month.
const month = arg("--month") ?? videos.map(v => v.month).sort((a, b) => monthKey(b) - monthKey(a))[0];

const picked = new Map<string, string>();
for (const c of COUNTIES) {
  const hit = videos.find(v => v.county === c && v.month === month && v.series === series);
  if (hit) picked.set(c, `https://youtu.be/${hit.id}`);
}

console.log(`month: ${month}   series: Market ${series}`);
for (const c of COUNTIES) {
  console.log(`  ${c.padEnd(11)} ${picked.get(c) ?? "*** NOT FOUND — not published yet? ***"}`);
}

const missing = COUNTIES.filter(c => !picked.has(c));
if (missing.length) {
  // Partial writes are worse than none: half the county pages would silently show
  // last month's video next to this month's figures.
  console.error(`\nAborting — missing ${missing.length} of ${COUNTIES.length}: ${missing.join(", ")}`);
  process.exit(1);
}

let src = readFileSync(DATA_FILE, "utf8");
let changed = 0;
for (const [county, url] of picked) {
  const block = new RegExp(`("${county} County":\\s*\\{[\\s\\S]*?)(\\n\\s*videoUrl: "[^"]*",)?(\\n\\s*stats:)`);
  const before = src;
  src = src.replace(block, (_m, head, _old, tail) => `${head}\n    videoUrl: "${url}",${tail}`);
  if (src !== before) changed++;
  else console.error(`  ! could not patch ${county} County — check the file shape`);
}

if (dryRun) {
  console.log(`\n--dry-run: would update ${changed}/${COUNTIES.length} counties. Nothing written.`);
} else {
  writeFileSync(DATA_FILE, src);
  console.log(`\nWrote ${changed}/${COUNTIES.length} county video links to src/data/countyMarketData.ts`);
}
