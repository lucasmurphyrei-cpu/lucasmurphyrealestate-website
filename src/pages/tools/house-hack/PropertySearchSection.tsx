import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";
import InputField from "./InputField";
import { useToast } from "@/hooks/use-toast";
import type { PropertyType } from "./types";
import { PROPERTY_TYPE_UNITS } from "./defaults";
import { formatCurrency } from "./calculations";
import { getAllSlim } from "@/data/municipalityLookup";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

function getMedianPrice(muni: ReturnType<typeof getAllSlim>[number]): number | null {
  return muni.api_data?.redfin?.median_sale_price ?? muni.api_data?.zillow?.zhvi ?? null;
}

interface PropertySearchSectionProps {
  propertyType: PropertyType;
  purchasePrice: number;
}

const PropertySearchSection = ({ propertyType, purchasePrice }: PropertySearchSectionProps) => {
  const { toast } = useToast();
  const [hasSearched, setHasSearched] = useState(false);
  const [showResultsList, setShowResultsList] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [priceMin, setPriceMin] = useState(() => Math.max(0, purchasePrice - 75000));
  const [priceMax, setPriceMax] = useState(() => purchasePrice + 75000);

  const matchingMunicipalities = useMemo(() => {
    if (!hasSearched) return [];
    const allMunis = getAllSlim();
    return allMunis
      .filter((muni) => {
        const medianPrice = getMedianPrice(muni);
        if (!medianPrice) return false;
        return medianPrice >= priceMin && medianPrice <= priceMax;
      })
      .sort((a, b) => {
        const priceA = getMedianPrice(a) || 0;
        const priceB = getMedianPrice(b) || 0;
        return priceA - priceB;
      });
  }, [hasSearched, priceMin, priceMax]);

  const handleSearch = () => {
    setHasSearched(true);
    setShowResultsList(true);
    setShowCta(true);
    setShowLeadForm(false);
  };

  const handleReset = () => {
    setHasSearched(false);
    setShowResultsList(false);
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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

      toast({ title: "You're all set!", description: "We'll set up a custom property search for you." });
      setShowLeadForm(false);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us at (414) 458-1952.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const propertyLabel = propertyType === "duplex" ? "duplexes" : propertyType === "triplex" ? "triplexes" : "fourplexes";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Find Investment Properties
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          See which areas in the Milwaukee metro have {propertyLabel} in your price range.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Min Price"
            value={priceMin}
            onChange={setPriceMin}
            prefix="$"
            useCommas
            step={25000}
          />
          <InputField
            label="Max Price"
            value={priceMax}
            onChange={setPriceMax}
            prefix="$"
            useCommas
            step={25000}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          Searching for {PROPERTY_TYPE_UNITS[propertyType]}-unit properties between {formatCurrency(priceMin)} and {formatCurrency(priceMax)}
        </p>
        {hasSearched ? (
          <Button onClick={handleReset} variant="outline" className="w-full" size="sm">
            Reset
          </Button>
        ) : (
          <Button onClick={handleSearch} className="w-full" size="sm">
            Search Areas
          </Button>
        )}

        {/* Expanded area results list */}
        {hasSearched && showResultsList && (
          <div className="space-y-3">
            {matchingMunicipalities.length > 0 ? (
              <>
                <p className="text-xs text-muted-foreground">
                  {matchingMunicipalities.length} area{matchingMunicipalities.length !== 1 ? "s" : ""} with median home prices in your range:
                </p>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {matchingMunicipalities.map((muni) => {
                    const price = getMedianPrice(muni);
                    return (
                      <div
                        key={muni.id}
                        className="flex items-start gap-2 rounded-md border border-border bg-secondary/30 p-2.5"
                      >
                        <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{muni.display_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {muni.county.charAt(0).toUpperCase() + muni.county.slice(1)} County
                            {price && ` — Median: ${formatCurrency(price)}`}
                          </p>
                          {muni.quick_snapshot?.average_rent && (
                            <p className="text-xs text-muted-foreground">
                              Avg Rent: {muni.quick_snapshot.average_rent}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No areas found in this price range. Try adjusting your min/max price.
              </p>
            )}
          </div>
        )}

        {/* CTA + lead form — stays visible after reset */}
        {showCta && matchingMunicipalities.length > 0 && (
          <>
            {!showLeadForm ? (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                <p className="text-sm font-medium">Interested in these areas?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  I can set up a custom property search so you're notified when matching {propertyLabel} hit the market.
                </p>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => setShowLeadForm(true)}
                >
                  Set Up Custom Search
                </Button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm font-medium">Get notified when properties match</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Full Name</Label>
                    <Input name="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input name="email" type="email" placeholder="john@email.com" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone (optional)</Label>
                  <Input name="phone" type="tel" placeholder="(414) 555-0123" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">What does your ideal property look like?</Label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="e.g. A duplex near downtown with 2BR units, off-street parking, and separate utilities..."
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <Button type="submit" className="w-full" size="sm" disabled={loading}>
                  {loading ? "Setting up..." : "Set Up My Search"}
                </Button>
              </form>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertySearchSection;
