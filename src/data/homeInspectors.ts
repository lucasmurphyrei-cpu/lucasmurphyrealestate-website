export interface HomeInspector {
  name: string;
  business: string;
  website: string;
  email: string;
  phone: string;
  phones?: { label: string; number: string }[];
  location: string;
  image: string;
  bio: string;
  serviceAreas?: string[];
}

export interface InspectorCategory {
  name: string;
  slug: string;
  inspectors: HomeInspector[];
}

export const inspectorCategories: InspectorCategory[] = [
  {
    name: "Home Inspectors",
    slug: "home-inspectors",
    inspectors: [
      {
        name: "Tri County Inspection & Environmental, LLC",
        business: "Tri County Inspection & Environmental, LLC",
        website: "https://app.spectora.com/home-inspectors/tri-county-home-inspection-llc",
        email: "hello@wisconsininspection.com",
        phone: "(262) 716-8364",
        phones: [
          { label: "Waukesha", number: "(262) 225-9668" },
          { label: "Janesville & Madison", number: "(608) 531-1441" },
          { label: "Milwaukee", number: "(414) 433-4983" },
          { label: "Southeastern Wisconsin", number: "(262) 225-9668" },
        ],
        location: "375 Williamstowne #201, 202, Delafield, WI 53018",
        image: "/images/inspectors/tri-county-logo.png",
        serviceAreas: ["Waukesha", "Lake Geneva", "Milwaukee", "Kenosha", "Oak Creek", "Fort Atkinson", "Watertown", "Delafield", "Dousman", "Fontana", "Oconomowoc", "Whitewater"],
        bio: "Tri County Inspection & Environmental is a team of state-licensed, third-party Certified Home Inspection Experts — a designation held by only one in fifty home inspectors. With over two decades of experience and thousands of completed inspections across southeastern Wisconsin, they deliver thorough, reliable inspections that give buyers confidence in their investment. Protect your investment — contact one of our local offices today.",
      },
    ],
  },
];
