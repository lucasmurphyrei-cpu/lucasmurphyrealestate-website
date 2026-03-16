export interface Contractor {
  name: string;
  business: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  image: string;
  bio: string;
  serviceAreas?: string[];
  isLogo?: boolean;
}

export interface ContractorCategory {
  name: string;
  slug: string;
  contractors: Contractor[];
}

export const contractorCategories: ContractorCategory[] = [
  {
    name: "General Contractors",
    slug: "general-contractors",
    contractors: [
      {
        name: "Ben Townsend",
        business: "BT Renovations",
        website: "https://www.bt-renovations.com/contact",
        email: "btrenovations.wil@gmail.com",
        phone: "919-208-5660",
        location: "P.O. Box 405 Wales, WI 53183",
        image: "/images/contractors/ben-townsend.png",
        bio: "Ben Townsend is a dedicated general contractor based in Waukesha, Wisconsin and the owner of BT Renovations. With a strong commitment to quality craftsmanship and honest service, Ben specializes in home renovations, remodeling projects, and residential improvements that help homeowners bring their vision to life. Known for his attention to detail and hands-on approach, he works closely with clients from planning through completion to ensure every project is completed on time, on budget, and to the highest standards.",
      },
    ],
  },
  {
    name: "Roofers",
    slug: "roofers",
    contractors: [
      {
        name: "American Roofing & Home Improvements",
        business: "American Roofing & Home Improvements, LLC",
        website: "https://ar-hi.com/",
        email: "",
        phone: "(262) 662-5311",
        location: "Waukesha County, WI + Surrounding Areas",
        image: "/images/contractors/american-roofing.jpg",
        isLogo: true,
        serviceAreas: ["Big Bend", "Muskego", "Waukesha", "Franklin", "Mukwonago", "Brookfield", "Milwaukee", "Hales Corners", "New Berlin"],
        bio: "With over 30 years of experience, American Roofing & Home Improvements is Wisconsin's trusted choice for roofing, gutters, and siding. Their hands-on team specializes in asphalt, cedar, and rubber roofing installations — most completed in a single day. BBB Accredited, VSI Certified, and a licensed Wisconsin Professional Dwelling Contractor, they treat every home as if it were their own.",
      },
    ],
  },
];
