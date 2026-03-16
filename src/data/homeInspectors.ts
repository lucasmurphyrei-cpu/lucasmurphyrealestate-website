export interface HomeInspector {
  name: string;
  business: string;
  website: string;
  email: string;
  phone: string;
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
        name: "Zack Wolf",
        business: "Tri County Inspection & Environmental, LLC",
        website: "https://app.spectora.com/home-inspectors/tri-county-home-inspection-llc",
        email: "hello@wisconsininspection.com",
        phone: "(262) 716-8364",
        location: "375 Williamstowne #201, 202, Delafield, WI 53018",
        image: "/images/inspectors/zack-wolf.png",
        serviceAreas: ["Waukesha", "Lake Geneva", "Milwaukee", "Kenosha", "Oak Creek", "Fort Atkinson", "Watertown", "Delafield", "Dousman", "Fontana", "Oconomowoc", "Whitewater"],
        bio: "Zack Wolf is a state-licensed, third-party Certified Home Inspection Expert at Tri County Inspection & Environmental — a designation held by only one in fifty home inspectors. Along with his partner Aaron, their team brings over two decades of experience and thousands of completed inspections across southeastern Wisconsin. From Waukesha to Lake Geneva, they deliver thorough, reliable inspections that give buyers confidence in their investment.",
      },
    ],
  },
];
