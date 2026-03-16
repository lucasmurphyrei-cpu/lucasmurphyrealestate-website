export interface Mover {
  name: string;
  title: string;
  business: string;
  website: string;
  email: string;
  phone: string;
  officePhone?: string;
  location: string;
  image: string;
  bio: string;
  isLogo?: boolean;
  serviceAreas?: string[];
}

export interface MoverCategory {
  name: string;
  slug: string;
  movers: Mover[];
}

export const moverCategories: MoverCategory[] = [
  {
    name: "Moving Companies",
    slug: "moving-companies",
    movers: [
      {
        name: "Tony Carini",
        title: "Operations Manager",
        business: "Capitol North American Moving Services",
        website: "https://capitolnorthamerican.com/milwaukee-moving-company/",
        email: "info@capitolnorthamerican.com",
        phone: "262-951-5093",
        officePhone: "262-910-3257",
        location: "16055 Stratton Drive, New Berlin, WI 53151",
        image: "/images/movers/capitol-north-american.png",
        isLogo: true,
        serviceAreas: ["Milwaukee", "Waukesha", "New Berlin", "Madison", "Southeastern WI"],
        bio: "Tony Carini is the Operations Manager at Capitol North American, a full-service moving company operating out of a 100,000 sq ft facility in New Berlin since 1962. Capitol North American provides residential and commercial moving — local, long-distance, and international — along with storage, office relocation, and specialty moving services. Their crews are trained, certified, and background-checked to ensure your move is handled with care from start to finish.",
      },
    ],
  },
];
