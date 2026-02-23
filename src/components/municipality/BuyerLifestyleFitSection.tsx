import { UserCheck, Car, Footprints, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BuyerLifestyleFit } from "@/data/neighborhoodTypes";

interface BuyerLifestyleFitSectionProps {
  data: BuyerLifestyleFit;
}

const cards = [
  { key: "ideal_buyer" as const, label: "Ideal Buyer", icon: UserCheck },
  { key: "commute_to_downtown" as const, label: "Commute to Downtown", icon: Car },
  { key: "walkability_transportation" as const, label: "Walkability & Transit", icon: Footprints },
  { key: "crime_safety" as const, label: "Crime & Safety", icon: Shield },
];

const BuyerLifestyleFitSection = ({ data }: BuyerLifestyleFitSectionProps) => (
  <section className="mb-10">
    <h2 className="font-display text-2xl font-bold mb-4">Buyer & Lifestyle Fit</h2>
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{label}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {data[key]}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default BuyerLifestyleFitSection;
