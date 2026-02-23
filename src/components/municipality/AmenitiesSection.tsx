import { Heart, CalendarDays, TreePine, UtensilsCrossed, Briefcase, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AmenitiesCharacter } from "@/data/neighborhoodTypes";

interface AmenitiesSectionProps {
  data: AmenitiesCharacter;
}

const sections = [
  { key: "community_vibe" as const, label: "Community Vibe", icon: Heart },
  { key: "notable_events" as const, label: "Notable Events", icon: CalendarDays },
  { key: "parks_attractions" as const, label: "Parks & Attractions", icon: TreePine },
  { key: "restaurants_dining" as const, label: "Restaurants & Dining", icon: UtensilsCrossed },
  { key: "major_employers" as const, label: "Major Employers", icon: Briefcase },
  { key: "proximity_lake_employers" as const, label: "Lake & Employer Proximity", icon: MapPin },
];

function formatContent(text: string): string {
  // Clean up markdown-style bold markers for display
  return text.replace(/\*\*/g, "");
}

const AmenitiesSection = ({ data }: AmenitiesSectionProps) => (
  <section className="mb-10">
    <h2 className="font-display text-2xl font-bold mb-4">
      Amenities & Community Character
    </h2>
    <div className="grid gap-4 sm:grid-cols-2">
      {sections.map(({ key, label, icon: Icon }) => {
        const content = data[key];
        if (!content) return null;
        return (
          <Card key={key}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{label}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {formatContent(content)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </section>
);

export default AmenitiesSection;
