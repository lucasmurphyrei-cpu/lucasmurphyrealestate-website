export interface InsuranceProvider {
  name: string;
  business: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  image: string;
  bio: string;
}

export interface InsuranceCategory {
  name: string;
  slug: string;
  providers: InsuranceProvider[];
}

export const insuranceCategories: InsuranceCategory[] = [
  {
    name: "Home Insurance Agents",
    slug: "home-insurance-agents",
    providers: [
      {
        name: "Leticia Guzman",
        business: "Leticia Guzman & Associates — American Family Insurance",
        website: "https://www.amfam.com/agents/wisconsin/waukesha/leticia-guzman",
        email: "lguzman@amfam.com",
        phone: "(262) 542-9695",
        location: "744 N Grand Ave, Waukesha, WI 53186",
        image: "/images/insurance/leticia-guzman.jpg",
        bio: "Leticia Guzman and Associates, Inc. is an American Family Insurance agency located in Downtown Waukesha, WI. Whether you're purchasing a new car, buying a home, managing an investment property, starting a small business, or leaving behind a legacy, Leticia and her team will provide you with a free auto, home, life, and commercial insurance quote. Bilingual in English and Spanish, with a 4.92/5 rating from nearly 500 customer reviews.",
      },
    ],
  },
];
