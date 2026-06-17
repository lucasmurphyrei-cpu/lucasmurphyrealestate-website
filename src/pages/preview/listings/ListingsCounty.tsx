import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Search } from "lucide-react";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import Seo from "@/components/seo/Seo";
import JsonLd from "@/components/seo/JsonLd";
import { graph, breadcrumbList } from "@/lib/seo/schema";
import { IMG, heroCounties } from "@/pages/preview/_shared/tokens";
import { COUNTY_SLUGS, countySlugToDisplay } from "@/lib/market/counties";
import { getAllMunicipalityRoutes } from "@/data/municipalityLookup";
import {
  PROPERTY_TYPES,
  SearchFilters,
  buildFilteredSearchUrl,
  countyArea,
  muniArea,
} from "./listingsConfig";

const GOLD = "hsl(44, 100%, 53%)";

const cleanName = (name: string) => name.replace(/\s*\([^)]*\)\s*$/, "").trim();
const nameToSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

const PRICE_OPTS = [0, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 600000, 750000, 1000000, 1500000, 2000000];
const fmtPrice = (n: number) =>
  n === 0 ? "" : n >= 1000000 ? `$${(n / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M` : `$${n / 1000}k`;
const COUNT_OPTS = [0, 1, 2, 3, 4, 5];

/* Styled field wrappers ---------------------------------------------------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">{label}</span>
      {children}
    </label>
  );
}
const selectCls =
  "w-full rounded-lg border border-white/12 bg-[#0e1a2d] px-4 py-3 text-sm text-white outline-none transition-colors focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent";

export default function ListingsCounty() {
  const { county = "" } = useParams<{ county: string }>();
  const valid = (COUNTY_SLUGS as readonly string[]).includes(county);
  const countyDisplay = countySlugToDisplay(county);
  const heroImg = heroCounties.find((c) => nameToSlug(c.name) === county)?.img ?? IMG.skyline;

  const munis = useMemo(
    () =>
      getAllMunicipalityRoutes()
        .filter((r) => r.countySlug === county && muniArea(r.id))
        .map((r) => ({ id: r.id, label: cleanName(r.displayName) }))
        .filter((m, i, arr) => arr.findIndex((x) => x.label === m.label) === i)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [county]
  );

  const [community, setCommunity] = useState("ALL");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [minGarage, setMinGarage] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(PROPERTY_TYPES.map((t) => t.label));

  const toggleType = (label: string) =>
    setSelectedTypes((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));

  function runSearch() {
    const area = community === "ALL" ? countyArea(county) : muniArea(community);
    const codes = [
      ...new Set(PROPERTY_TYPES.filter((t) => selectedTypes.includes(t.label)).flatMap((t) => t.codes)),
    ];
    const filters: SearchFilters = { minPrice, maxPrice, minBeds, minBaths, minGarage, types: codes };
    window.open(buildFilteredSearchUrl(area, filters), "_blank", "noopener,noreferrer");
  }

  if (!valid) {
    return (
      <div className="min-h-screen bg-[#0a1424] text-white">
        <PreviewHeader />
        <div className="mx-auto max-w-3xl px-6 py-40 text-center">
          <h1 className="font-display text-3xl font-semibold">County not found</h1>
          <Link to="/preview/v1/listings" className="mt-6 inline-block text-accent underline-offset-4 hover:underline">
            Back to all counties
          </Link>
        </div>
        <PreviewFooter />
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`Search ${countyDisplay} Homes for Sale`}
        description={`Search active listings in ${countyDisplay}, Wisconsin. Filter by community, price, beds, baths, garage, and property type, then view results on the map.`}
        canonicalPath={`/preview/v1/listings/${county}`}
        noindex
      />
      <JsonLd
        data={graph(
          breadcrumbList([
            { name: "Home", path: "/preview/v1" },
            { name: "Listings", path: "/preview/v1/listings" },
            { name: countyDisplay, path: `/preview/v1/listings/${county}` },
          ])
        )}
      />

      <div className="min-h-screen bg-[#0a1424] text-white">
        <PreviewHeader />

        {/* Hero band */}
        <div className="relative overflow-hidden pt-28">
          <img src={heroImg} alt={countyDisplay} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424] via-[#0a1424]/80 to-[#0a1424]/55" />
          <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-10 lg:px-10">
            <Link
              to="/preview/v1/listings"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All counties
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: GOLD }}>
              Home Search
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-white sm:text-5xl">
              Search homes in {countyDisplay}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/75">
              Pick a community and set your criteria. We'll drop you straight onto the map, filtered to exactly
              what you're looking for.
            </p>
          </div>
        </div>

        {/* Form card */}
        <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
          <div className="-mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] sm:p-8 lg:p-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Community */}
              <div className="sm:col-span-2 lg:col-span-3">
                <Field label="Community">
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
                    <select
                      value={community}
                      onChange={(e) => setCommunity(e.target.value)}
                      className={`${selectCls} pl-10`}
                    >
                      <option value="ALL">Entire {countyDisplay}</option>
                      {munis.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {munis.length === 0 && (
                    <span className="mt-1 text-xs text-white/45">
                      City-level filtering for this county is coming soon — searches the whole county for now.
                    </span>
                  )}
                </Field>
              </div>

              {/* Price */}
              <Field label="Min price">
                <select value={minPrice} onChange={(e) => setMinPrice(+e.target.value)} className={selectCls}>
                  <option value={0}>No min</option>
                  {PRICE_OPTS.filter((p) => p > 0).map((p) => (
                    <option key={p} value={p}>
                      {fmtPrice(p)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Max price">
                <select value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className={selectCls}>
                  <option value={0}>No max</option>
                  {PRICE_OPTS.filter((p) => p > 0).map((p) => (
                    <option key={p} value={p}>
                      {fmtPrice(p)}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Garage */}
              <Field label="Garage">
                <select value={minGarage} onChange={(e) => setMinGarage(+e.target.value)} className={selectCls}>
                  <option value={0}>Any</option>
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n}+ car
                    </option>
                  ))}
                </select>
              </Field>

              {/* Beds */}
              <Field label="Bedrooms">
                <select value={minBeds} onChange={(e) => setMinBeds(+e.target.value)} className={selectCls}>
                  {COUNT_OPTS.map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? "Any" : `${n}+`}
                    </option>
                  ))}
                </select>
              </Field>
              {/* Baths */}
              <Field label="Bathrooms">
                <select value={minBaths} onChange={(e) => setMinBaths(+e.target.value)} className={selectCls}>
                  {COUNT_OPTS.map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? "Any" : `${n}+`}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Property types */}
            <div className="mt-8">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Property type</span>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {PROPERTY_TYPES.map((t) => {
                  const on = selectedTypes.includes(t.label);
                  return (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => toggleType(t.label)}
                      aria-pressed={on}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        on
                          ? "border-accent bg-accent/15 text-white"
                          : "border-white/12 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/55">Results open on the live map, filtered to your criteria.</p>
              <button
                type="button"
                onClick={runSearch}
                disabled={selectedTypes.length === 0}
                className="group inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold text-[#0a1424] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: GOLD }}
              >
                <Search className="h-4 w-4" />
                Search homes on the map
              </button>
            </div>
          </div>
        </section>

        <PreviewFooter />
      </div>
    </>
  );
}
