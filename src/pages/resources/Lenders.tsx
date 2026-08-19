import { Landmark } from "lucide-react";
import VendorDirectory, { type VendorCategory } from "@/pages/preview/vendors/VendorDirectory";
import { lenderCategories } from "@/data/lenders";
import { IMG } from "@/pages/preview/_shared/tokens";

const categories: VendorCategory[] = lenderCategories.map((c) => ({
  name: c.name,
  items: c.lenders.map((x) => ({ ...x, tags: x.bestFor })),
}));

export default function Lenders() {
  return (
    <VendorDirectory
      icon={Landmark}
      kicker="Trusted Lenders"
      title="Lenders who close on time"
      intro="Local loan officers who communicate clearly, structure the right loan for your situation, and get you to the closing table on schedule."
      heroImg={IMG.riverwalk}
      canonicalPath="/resources/lenders"
      metaTitle="Trusted Mortgage Lenders | Metro Milwaukee | Lucas Murphy Real Estate"
      metaDescription="Local Milwaukee and Waukesha County mortgage lenders who close on time and communicate every step. Personally recommended by Lucas Murphy."
      categories={categories}
      ctaTitle="Know a great lender?"
      ctaBody="If you've worked with a loan officer who made financing simple, I'd love to add them to this list."
    />
  );
}
