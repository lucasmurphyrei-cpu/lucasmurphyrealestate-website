import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllRoutes } from "./routes";
import { siteConfig } from "../src/lib/siteConfig";

export function buildLlmsTxt(): string {
  const indexable = getAllRoutes().filter((r) => !r.noindex);
  const link = (path: string, label: string) => `- [${label}](${siteConfig.url}${path})`;

  const cap = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bWi\b/, "WI");

  const lines: string[] = [];
  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(`> ${siteConfig.agent.description}`);
  lines.push("");
  lines.push(
    `Lucas Murphy provides free buyer, seller, relocation, condo, and house-hacking guides; ` +
      `monthly county and municipality market data; and free calculators (mortgage, budget, CMA, ` +
      `seller net sheet, house hack) for ${siteConfig.counties.join(", ")} Counties, Wisconsin.`
  );
  lines.push("");
  lines.push("## Key pages");
  for (const [p, l] of [
    ["/", "Home"], ["/about", "About Lucas Murphy"], ["/contact", "Contact"],
    ["/market", "Metro Milwaukee market data"], ["/listings", "Search homes for sale"],
    ["/guides", "Real estate guides"], ["/tools", "Free calculators and tools"],
    ["/vendors", "Trusted local vendors"],
  ] as const)
    lines.push(link(p, l));
  lines.push("");

  lines.push("## Market data by county");
  for (const r of indexable.filter((x) => /^\/market\/[a-z-]+-county$/.test(x.path)))
    lines.push(link(r.path, `${cap(r.path.split("/").pop()!)} market data`));
  lines.push("");

  lines.push("## Guides");
  for (const r of indexable.filter((x) => /^\/guides\/[a-z-]+$/.test(x.path)))
    lines.push(link(r.path, `${cap(r.path.split("/").pop()!)} guide`));
  lines.push("");

  lines.push("## Tools");
  for (const r of indexable.filter((x) => /^\/tools\/[a-z-]+$/.test(x.path)))
    lines.push(link(r.path, cap(r.path.split("/").pop()!)));
  lines.push("");

  lines.push(
    `## Contact\n${siteConfig.agent.name}, ${siteConfig.agent.jobTitle} — ${siteConfig.brokerage}. ` +
      `Phone: ${siteConfig.phone}. Email: ${siteConfig.email}. Web: ${siteConfig.url}.`
  );
  lines.push("");
  return lines.join("\n");
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/llms.txt");
  writeFileSync(out, buildLlmsTxt(), "utf8");
  console.log("llms.txt written");
}
