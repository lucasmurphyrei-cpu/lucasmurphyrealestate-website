// src/pages/preview/_shared/amenities/AmenitiesFeatured.tsx
import type { MarketProfile } from "@/data/marketProfiles";
import FeaturedPlaceCard from "./FeaturedPlaceCard";
import MoreToExplore from "./MoreToExplore";

export default function AmenitiesFeatured({ data }: { data: MarketProfile["amenities"] }) {
  const featured = data.featured.slice(0, 3);
  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <FeaturedPlaceCard key={p.name} place={p} />
        ))}
      </div>
      <MoreToExplore items={data.more} />
    </div>
  );
}
