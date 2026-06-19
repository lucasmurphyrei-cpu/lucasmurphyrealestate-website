import { ClipboardCheck } from "lucide-react";
import VendorDirectory, { type VendorCategory } from "@/pages/preview/vendors/VendorDirectory";
import { inspectorCategories } from "@/data/homeInspectors";
import { IMG } from "@/pages/preview/_shared/tokens";

const categories: VendorCategory[] = inspectorCategories.map((c) => ({
  name: c.name,
  items: c.inspectors.map((x) => ({ ...x, tags: x.serviceAreas })),
}));

export default function HomeInspectors() {
  return (
    <VendorDirectory
      icon={ClipboardCheck}
      kicker="Trusted Home Inspectors"
      title="Inspectors who tell it straight"
      intro="Thorough, detail-driven inspectors who give you the full picture of a home, so you can negotiate and buy with confidence."
      heroImg={IMG.foxRiver}
      canonicalPath="/resources/home-inspectors"
      metaTitle="Trusted Home Inspectors | Metro Milwaukee | Lucas Murphy Real Estate"
      metaDescription="Thorough, honest home inspectors serving Milwaukee, Waukesha, and the surrounding counties. Personally recommended by Lucas Murphy."
      categories={categories}
      ctaTitle="Know a great inspector?"
      ctaBody="If you've worked with an inspector who was thorough and straight with you, I'd love to hear about them."
    />
  );
}
