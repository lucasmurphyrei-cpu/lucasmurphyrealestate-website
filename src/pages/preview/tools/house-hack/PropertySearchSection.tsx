import { useState, useMemo } from "react";
import { MapPin, Search } from "lucide-react";
import type { PropertyType } from "@/pages/tools/house-hack/types";
import { PROPERTY_TYPE_UNITS } from "@/pages/tools/house-hack/defaults";
import { formatCurrency } from "@/pages/tools/house-hack/calculations";
import { getAllSlim } from "@/data/municipalityLookup";
import { getRapidStats } from "@/data/municipalityRapidStats";
import { PreviewInputField, cardCls, fieldCls, labelCls } from "./previewUi";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

function getMedianPrice(muni: ReturnType<typeof getAllSlim>[number]): number | null {
  const rapidStats = getRapidStats(muni.id);
  if (rapidStats?.median_sale_price) return rapidStats.median_sale_price;
  return muni.api_data?.redfin?.median_sale_price ?? muni.api_data?.zillow?.zhvi ?? null;
}

interface PropertySearchSectionProps {
  propertyType: PropertyType;
  purchasePrice: number;
}

const primaryBtn = "w-full rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60";
const outlineBtn = "w-full rounded-sm border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent";

const PropertySearchSection = ({ propertyType, purchasePrice }: PropertySearchSectionProps) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [showResultsList, setShowResultsList] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [priceMin, setPriceMin] = useState(() => Math.max(0, purchasePrice - 75000));
  const [priceMax, setPriceMax] = useState(() => purchasePrice + 75000);

  const matchingMunicipalities = useMemo(() => {
    if (!hasSearched) return [];
    return getAllSlim()
      .filter((muni) => {
        const medianPrice = getMedianPrice(muni);
        if (!medianPrice) return false;
        return medianPrice >= priceMin && medianPrice <= priceMax;
      })
      .sort((a, b) => (getMedianPrice(a) || 0) - (getMedianPrice(b) || 0));
  }, [hasSearched, priceMin, priceMax]);

  const handleSearch = () => { setHasSearched(true); setShowResultsList(true); setShowCta(true); setShowLeadForm(false); };
  const handleReset = () => { setHasSearched(false); setShowResultsList(false); };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    try {
      if (!GOOGLE_SHEETS_URL) throw new Error("Form endpoint not configured");
      const params = new URLSearchParams();
      params.append("name", formData.get("name") as string);
      params.append("email", formData.get("email") as string);
      params.append("phone", (formData.get("phone") as string) || "");
      params.append("source", "house-hack-property-search");
      params.append("property_type", propertyType);
      params.append("price_min", String(priceMin));
      params.append("price_max", String(priceMax));
      params.append("matching_areas", matchingMunicipalities.map((m) => m.display_name).join(", "));
      params.append("message", (formData.get("message") as string) || "");
      params.append("timestamp", new Date().toISOString());
      await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: params });
      setSubmitted(true);
      setShowLeadForm(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const propertyLabel = propertyType === "duplex" ? "duplexes" : propertyType === "triplex" ? "triplexes" : "fourplexes";

  return (
    <div className={cardCls}>
      <div className="mb-4">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Search className="h-5 w-5 text-accent" /> Find Investment Properties
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">See which areas in the Milwaukee metro have {propertyLabel} in your price range.</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <PreviewInputField label="Min Price" value={priceMin} onChange={setPriceMin} prefix="$" useCommas step={25000} />
          <PreviewInputField label="Max Price" value={priceMax} onChange={setPriceMax} prefix="$" useCommas step={25000} />
        </div>
        <p className="text-[10px] text-muted-foreground">Searching for {PROPERTY_TYPE_UNITS[propertyType]}-unit properties between {formatCurrency(priceMin)} and {formatCurrency(priceMax)}</p>
        {hasSearched ? (
          <button onClick={handleReset} className={outlineBtn}>Reset</button>
        ) : (
          <button onClick={handleSearch} className={primaryBtn}>Search Areas</button>
        )}

        {hasSearched && showResultsList && (
          <div className="space-y-3">
            {matchingMunicipalities.length > 0 ? (
              <>
                <p className="text-xs text-muted-foreground">{matchingMunicipalities.length} area{matchingMunicipalities.length !== 1 ? "s" : ""} with median home prices in your range:</p>
                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {matchingMunicipalities.map((muni) => {
                    const price = getMedianPrice(muni);
                    return (
                      <div key={muni.id} className="flex items-start gap-2 rounded-sm border border-border bg-secondary/40 p-2.5">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{muni.display_name}</p>
                          <p className="text-xs text-muted-foreground">{muni.county.charAt(0).toUpperCase() + muni.county.slice(1)} County{price && ` — Median: ${formatCurrency(price)}`}</p>
                          {muni.quick_snapshot?.average_rent && <p className="text-xs text-muted-foreground">Avg Rent: {muni.quick_snapshot.average_rent}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">No areas found in this price range. Try adjusting your min/max price.</p>
            )}
          </div>
        )}

        {submitted && (
          <div className="rounded-sm border border-accent/30 bg-accent/[0.06] p-4 text-center">
            <p className="text-sm font-medium">You're all set!</p>
            <p className="mt-1 text-xs text-muted-foreground">We'll set up a custom property search for you.</p>
          </div>
        )}

        {showCta && !submitted && matchingMunicipalities.length > 0 && (
          <>
            {!showLeadForm ? (
              <div className="rounded-sm border border-accent/30 bg-accent/[0.06] p-4 text-center">
                <p className="text-sm font-medium">Interested in these areas?</p>
                <p className="mt-1 text-xs text-muted-foreground">I can set up a custom property search so you're notified when matching {propertyLabel} hit the market.</p>
                <button onClick={() => setShowLeadForm(true)} className="mt-3 rounded-sm bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-all hover:-translate-y-0.5">Set Up Custom Search</button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3 rounded-sm border border-accent/30 bg-accent/[0.06] p-4">
                <p className="text-sm font-medium">Get notified when properties match</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input name="name" placeholder="John Doe" required className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input name="email" type="email" placeholder="john@email.com" required className={fieldCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input name="phone" type="tel" required placeholder="(414) 555-0123" className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>What does your ideal property look like?</label>
                  <textarea name="message" rows={3} placeholder="e.g. A duplex near downtown with 2BR units, off-street parking, and separate utilities..." className="w-full resize-none rounded-sm border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-accent focus:ring-2 focus:ring-accent/25" />
                </div>
                {error && <p className="text-xs text-red-600">Something went wrong. Please try again or call (414)-458-1952.</p>}
                <button type="submit" disabled={loading} className={primaryBtn}>{loading ? "Setting up..." : "Set Up My Search"}</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertySearchSection;
