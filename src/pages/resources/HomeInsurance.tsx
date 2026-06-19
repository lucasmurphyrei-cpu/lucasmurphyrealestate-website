import { ShieldCheck } from "lucide-react";
import VendorDirectory, { type VendorCategory } from "@/pages/preview/vendors/VendorDirectory";
import { insuranceCategories } from "@/data/insuranceProviders";
import { IMG } from "@/pages/preview/_shared/tokens";

const categories: VendorCategory[] = insuranceCategories.map((c) => ({
  name: c.name,
  items: c.providers.map((x) => ({ ...x })),
}));

export default function HomeInsurance() {
  return (
    <VendorDirectory
      icon={ShieldCheck}
      kicker="Trusted Insurance Agents"
      title="Coverage that fits your home"
      intro="Local agents who right-size your homeowners coverage to your property and budget, and are there when you actually need to file a claim."
      heroImg={IMG.pewaukee}
      canonicalPath="/resources/home-insurance"
      metaTitle="Trusted Home Insurance Agents | Metro Milwaukee | Lucas Murphy Real Estate"
      metaDescription="Local home insurance agents serving Milwaukee and Waukesha County who right-size coverage to your home and budget. Personally recommended by Lucas Murphy."
      categories={categories}
      ctaTitle="Know a great insurance agent?"
      ctaBody="If you've worked with an agent who made coverage clear and easy, I'd love to add them here."
    />
  );
}
