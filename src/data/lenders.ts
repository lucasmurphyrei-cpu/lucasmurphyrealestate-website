export interface Lender {
  name: string;
  business: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  image: string;
  bio: string;
  nmls?: string;
  bestFor?: string[];
}

export interface LenderCategory {
  name: string;
  slug: string;
  lenders: Lender[];
}

export const lenderCategories: LenderCategory[] = [
  {
    name: "Mortgage Loan Officers",
    slug: "mortgage-loan-officers",
    lenders: [
      {
        name: "Ethan Brooks",
        business: "Refined Mortgage Group — Fairway Independent Mortgage Corporation",
        website: "https://www.ethanbrooks.mortgage/",
        email: "ethan@trustrefined.com",
        phone: "414-488-0438",
        location: "11220 W Burleigh St, Suite 159, Wauwatosa, WI 53222",
        image: "/images/lenders/ethan-brooks.png",
        nmls: "1639987",
        bestFor: ["First-Time Home Buyers", "Traditional Financing"],
        bio: "Ethan Brooks is a Branch Manager at Fairway Independent Mortgage Corporation, operating as Refined Mortgage Group. After being denied a mortgage himself as a first-time homebuyer, Ethan was inspired to pursue a career in lending — and has since helped hundreds of Wisconsin clients close on time or early. A HousingWire 2022 Rising Star with over $64 million in origination volume, Ethan and his team specialize in purchase mortgages and offer guidance on retirement planning, college savings, and emergency funds through strategic mortgage decisions.",
      },
      {
        name: "Zach Starnes",
        business: "Element Mortgage",
        website: "https://apmobile.apmortgage.com/homehub/signup/zach.starnes@elementmortgage.com?from_mobile_share=true",
        email: "zach.starnes@elementmortgage.com",
        phone: "414-710-4999",
        location: "1125 Milwaukee Ave, Suite 104, South Milwaukee, WI 53172",
        image: "/images/lenders/zach-starnes.png",
        nmls: "2099873",
        bestFor: ["Non-Traditional Lending", "Investors"],
        bio: "Zach Starnes is a mortgage lender at Element Mortgage serving the greater Milwaukee area. Specializing in non-traditional lending solutions and investor financing, Zach helps clients navigate complex loan scenarios that fall outside conventional programs. Whether you're purchasing an investment property, exploring DSCR loans, or need creative financing, Zach brings the expertise to find the right solution for your goals.",
      },
    ],
  },
];
