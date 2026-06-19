import { Hammer } from "lucide-react";
import VendorDirectory, { type VendorCategory } from "@/pages/preview/vendors/VendorDirectory";
import { contractorCategories } from "@/data/contractors";
import { IMG } from "@/pages/preview/_shared/tokens";

const categories: VendorCategory[] = contractorCategories.map((c) => ({
  name: c.name,
  items: c.contractors.map((x) => ({ ...x, tags: x.serviceAreas })),
}));

export default function Contractors() {
  return (
    <VendorDirectory
      icon={Hammer}
      kicker="Trusted Contractors"
      title="Contractors who do it right"
      intro="Reliable trades across Milwaukee and Waukesha County for renovations, repairs, and getting a home ready to sell. Everyone here comes personally recommended."
      heroImg={IMG.thirdWard}
      canonicalPath="/resources/contractors"
      metaTitle="Trusted Contractors | Metro Milwaukee | Lucas Murphy Real Estate"
      metaDescription="Reliable, personally recommended contractors in Milwaukee and Waukesha County for renovations, repairs, and home improvement projects."
      categories={categories}
      ctaTitle="Know a great contractor?"
      ctaBody="If you've worked with a reliable contractor in the Milwaukee or Waukesha County area, I'd love to hear about them."
    />
  );
}
