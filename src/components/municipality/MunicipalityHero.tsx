import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MunicipalitySlim } from "@/data/neighborhoodTypes";
import municipalityImages from "@/data/municipalityImages";

interface MunicipalityHeroProps {
  slim: MunicipalitySlim;
  countyDisplay: string;
}

const MunicipalityHero = ({ slim, countyDisplay }: MunicipalityHeroProps) => {
  const image = municipalityImages[slim.id];

  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-start md:gap-10">
        {/* Text content */}
        <div className="flex-1 min-w-0">
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

        {/* Municipality photo */}
        {image && (
          <div className="mt-6 md:mt-0 shrink-0 w-full md:w-[340px] lg:w-[400px]">
            <div className="overflow-hidden rounded-xl border border-border/60 shadow-sm">
              <img
                src={image.src}
                alt={image.alt}
                className="h-[220px] md:h-[260px] w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MunicipalityHero;
