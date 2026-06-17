import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllRoutes } from "./routes";
import { siteConfig } from "../src/lib/siteConfig";

export function buildLlmsTxt(): string {
  const indexable = getAllRoutes().filter((r) => !r.noindex);
  const link = (path: string, label: string) => `- [${label}](${siteConfig.url}${path})`;

  const lines: string[] = [];
  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(
    `> ${siteConfig.agent.name}, ${siteConfig.agent.jobTitle} with ${siteConfig.brokerage}. ` +
      `Real estate services across ${siteConfig.counties.join(", ")} Counties in metro Milwaukee, Wisconsin. ` +
      `Free buyer/seller/investor guides, monthly county and municipality market data, and home-buying tools.`
  );
  lines.push("");
  lines.push("## Key pages");
  lines.push(link("/", "Home"));
  lines.push(link("/guides", "Guides overview"));
  lines.push(link("/contact", "Contact"));
  lines.push("");
  lines.push("## Market data by county");
  for (const r of indexable.filter((x) => /^\/areas\/[a-z-]+-county$/.test(x.path))) {
    const name = r.path.split("/").pop()!.replace(/-/g, " ");
    lines.push(link(r.path, name.replace(/\b\w/g, (c) => c.toUpperCase())));
  }
  lines.push("");
  lines.push(`Contact: ${siteConfig.phone} · ${siteConfig.email}`);
  lines.push("");
  return lines.join("\n");
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/llms.txt");
  writeFileSync(out, buildLlmsTxt(), "utf8");
  console.log("llms.txt written");
}
