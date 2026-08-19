/**
 * County property-tax rates — the single table.
 *
 * There were four of these in this repo and they gave three different answers. A visitor
 * pricing the same house saw Milwaukee at 2.27%, 2.35% or 2.58% depending on which
 * calculator they landed on, and Ozaukee was simultaneously the cheapest and the most
 * expensive county. Nobody owned the fact, so nobody noticed.
 *
 * These values are the WI DOR full-value rates and match
 * `Realtor OS/Engines/Marketing/reference/house_hacking.json` → `counties[]`, which is what
 * the published House Hacking guide computes its per-county figures from.
 *
 * Both `name` and `label` are exported because the old copies disagreed on the key; they
 * are the same string. Import from here — do not redeclare a rate in a component.
 *
 * as_of: 2025-12. Rates are set annually in December; re-check then.
 */

export const COUNTY_TAX_AS_OF = "2025-12";
export const COUNTY_TAX_SOURCE = "WI DOR full-value rates";

export type CountyTaxKey = "milwaukee" | "waukesha" | "ozaukee" | "washington";

export const COUNTY_TAX_RATES: Record<
  CountyTaxKey,
  { name: string; label: string; rate: number }
> = {
  milwaukee: { name: "Milwaukee County", label: "Milwaukee County", rate: 2.58 },
  waukesha: { name: "Waukesha County", label: "Waukesha County", rate: 1.856 },
  ozaukee: { name: "Ozaukee County", label: "Ozaukee County", rate: 1.58 },
  washington: { name: "Washington County", label: "Washington County", rate: 1.76 },
} as const;

/** Array form, for components that render a list rather than look up by key. */
export const COUNTY_TAX_LIST: { label: string; rate: number }[] = Object.values(
  COUNTY_TAX_RATES,
).map(({ label, rate }) => ({ label, rate }));
