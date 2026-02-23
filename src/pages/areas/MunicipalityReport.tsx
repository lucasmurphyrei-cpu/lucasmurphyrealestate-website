import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import MunicipalityHero from "@/components/municipality/MunicipalityHero";
import QuickSnapshotGrid from "@/components/municipality/QuickSnapshotGrid";
import RealEstateTrendsCard from "@/components/municipality/RealEstateTrendsCard";
import BuyerLifestyleFitSection from "@/components/municipality/BuyerLifestyleFitSection";
import AmenitiesSection from "@/components/municipality/AmenitiesSection";
import MunicipalitySkeleton from "@/components/municipality/MunicipalitySkeleton";
import NeighborhoodQuizSection from "@/components/quiz/NeighborhoodQuizSection";
import {
  getSlimBySlug,
  getFullProfile,
  countySlugToKey,
} from "@/data/municipalityLookup";
import type { MunicipalityProfile } from "@/data/neighborhoodTypes";

const MunicipalityReport = () => {
  const { county, municipality } = useParams();
  const [full, setFull] = useState<MunicipalityProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const countyDisplay = county
    ? county.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "";

  const slim = county && municipality ? getSlimBySlug(county, municipality) : undefined;
  const countyKey = county ? countySlugToKey(county) : "";

  useEffect(() => {
    if (!slim || !countyKey) return;
    let cancelled = false;
    getFullProfile(countyKey, slim.id).then((p) => {
      if (!cancelled) {
        setFull(p ?? null);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [countyKey, slim?.id]);

  // Fallback if slug doesn't match any data
  if (!slim) {
    const muniName = municipality
      ? municipality.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "";
    return (
      <main className="container py-16">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to={`/areas/${county}`} className="hover:text-primary">{countyDisplay}</Link>
          <span>/</span>
          <span>{muniName}</span>
        </div>
        <h1 className="font-display text-4xl font-bold mb-4">{muniName}</h1>
        <p className="text-muted-foreground mb-8">
          Profile data for {muniName} is not yet available. Contact us for the latest insights.
        </p>
        <Button asChild>
          <Link to="/contact">Get a Custom Market Report</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container py-16">
      <Helmet>
        <title>{slim.display_name}, {countyDisplay} | Neighborhood Profile | Lucas Murphy Real Estate</title>
        <meta
          name="description"
          content={`Explore ${slim.display_name} in ${countyDisplay}, WI. Home prices, school districts, commute times, lifestyle fit, and more. ${slim.lifestyle_summary.slice(0, 120)}`}
        />
        <link
          rel="canonical"
          href={`https://www.lucasmurphyrealestate.com/areas/${county}/${municipality}`}
        />
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to={`/areas/${county}`} className="hover:text-primary">{countyDisplay}</Link>
        <span>/</span>
        <span>{slim.display_name}</span>
      </div>

      <MunicipalityHero slim={slim} countyDisplay={countyDisplay} />
      <QuickSnapshotGrid snapshot={slim.quick_snapshot} />
      <RealEstateTrendsCard trends={slim.real_estate_trends} apiData={slim.api_data} />

      {loading ? (
        <MunicipalitySkeleton />
      ) : full ? (
        <>
          <BuyerLifestyleFitSection data={full.buyer_lifestyle_fit} />
          <AmenitiesSection data={full.amenities_character} />
        </>
      ) : null}

      <NeighborhoodQuizSection
        mode="municipality"
        contextCounty={countyKey}
        contextMunicipalityId={slim.id}
      />

      <div className="mt-10">
        <Button asChild>
          <Link to="/contact">Schedule a Consultation</Link>
        </Button>
      </div>
    </main>
  );
};

export default MunicipalityReport;
