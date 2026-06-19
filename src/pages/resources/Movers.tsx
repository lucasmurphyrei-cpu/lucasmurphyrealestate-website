import { Truck } from "lucide-react";
import VendorDirectory, { type VendorCategory } from "@/pages/preview/vendors/VendorDirectory";
import { moverCategories } from "@/data/movers";
import { IMG } from "@/pages/preview/_shared/tokens";

const categories: VendorCategory[] = moverCategories.map((c) => ({
  name: c.name,
  items: c.movers.map((x) => ({ ...x, tags: x.serviceAreas })),
}));

export default function Movers() {
  return (
    <VendorDirectory
      icon={Truck}
      kicker="Trusted Movers"
      title="Movers for your big day"
      intro="Reliable, background-checked moving crews who treat your belongings like their own, for local moves across Metro Milwaukee and beyond."
      heroImg={IMG.lacLaBelle}
      canonicalPath="/resources/movers"
      metaTitle="Trusted Moving Companies | Metro Milwaukee | Lucas Murphy Real Estate"
      metaDescription="Reliable, background-checked moving companies serving Milwaukee and Waukesha County. Personally recommended by Lucas Murphy."
      categories={categories}
      ctaTitle="Know a great mover?"
      ctaBody="If a moving crew made your last move painless, I'd love to hear who they were."
    />
  );
}
