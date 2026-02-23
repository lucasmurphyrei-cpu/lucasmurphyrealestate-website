import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MunicipalitySlim } from "@/data/neighborhoodTypes";

interface MunicipalityHeroProps {
  slim: MunicipalitySlim;
  countyDisplay: string;
}

const MunicipalityHero = ({ slim, countyDisplay }: MunicipalityHeroProps) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-3">
      <MapPin className="h-8 w-8 text-primary" />
      <h1 className="font-display text-4xl font-bold md:text-5xl">
        {slim.display_name}
      </h1>
    </div>
    <p className="text-lg text-muted-foreground mb-4">
      {countyDisplay}, Wisconsin
    </p>
    <p className="max-w-3xl text-base leading-relaxed text-foreground/80">
      {slim.lifestyle_summary}
    </p>
    <div className="mt-4 flex flex-wrap gap-2">
      {slim.quiz_tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  </div>
);

export default MunicipalityHero;
