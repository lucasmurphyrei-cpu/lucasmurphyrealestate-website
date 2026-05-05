export interface HomeInspector {
  name: string;
  business: string;
  website?: string;
  bookingUrl?: string;
  email?: string;
  phone?: string;
  phones?: { label: string; number: string }[];
  location?: string;
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
        website: "https://tricountyhomeinspectionllc.com/",
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
      {
        name: "HomeSight Inspections",
        business: "HomeSight Inspections",
        bookingUrl: "https://inspectionsupport.com/milwaukeehomesight/online-scheduler?t=aDRqRlRZRmJuaGhCLg==&office=a60ac7a4-65c4-5205-99c4-52c3e5f37002",
        phone: "(414) 321-1070",
        image: "/images/inspectors/homesight-logo.webp",
        serviceAreas: ["Milwaukee", "Waukesha", "Greater Milwaukee Area"],
        bio: "HomeSight Inspections offers a few standout advantages that make them a great choice for buyers. Their contractor quote/bid option provides estimated repair pricing for many of the items uncovered during the inspection — giving you real numbers to bring into negotiations. With a larger team of inspectors on staff, they can often schedule you in sooner than smaller outfits when timing is tight. And rather than paying at the time of the inspection, they let you defer payment until closing, which keeps more cash in your pocket during the offer-to-close window.",
      },
    ],
  },
];
