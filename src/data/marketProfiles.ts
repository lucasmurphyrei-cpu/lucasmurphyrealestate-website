// src/data/marketProfiles.ts
export interface MarketPhoto {
  url: string;
  alt: string;
  credit: string;
  license: string;
  sourceUrl: string;
}
export interface FeaturedPlace {
  name: string;
  category: string;
  blurb: string;
  photo?: MarketPhoto;
}
export interface LifestyleVitalsData {
  walkScore: { value: number; label: string };
  commute: { carMinutes: string; routes: string[]; transitNote?: string };
  safety: { grade: string; percentile?: number; note: string };
  idealBuyer: { tags: string[]; summary: string };
}
export interface MarketProfile {
  lifestyle: LifestyleVitalsData;
  amenities: { featured: FeaturedPlace[]; more: { name: string; category: string }[] };
}

const marketProfiles: Record<string, MarketProfile> = {
  waukesha: {
    lifestyle: {
      walkScore: { value: 35, label: "Car-Dependent" },
      commute: {
        carMinutes: "25-35 min",
        routes: ["I-94", "US-18", "Hwy 59"],
        transitNote:
          "Waukesha Metro Transit serves the city; Badger Bus and Wisconsin Coach Lines run intercity routes to Milwaukee.",
      },
      safety: {
        grade: "B-",
        percentile: 57,
        note:
          "Overall B- on CrimeGrade (57th percentile -- safer than most US cities). Violent crime earns a B+ (69th percentile). Southwest neighborhoods score highest; crime concentrates near the urban core.",
      },
      idealBuyer: {
        tags: ["First-time buyers", "Young professionals", "Growing families"],
        summary:
          "Buyers who want the most accessible price points in Waukesha County, a revitalized walkable downtown along the Fox River, and a tight-knit community feel -- with easy I-94 access to Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Downtown Waukesha & Fox River Riverwalk",
          category: "Neighborhood",
          blurb:
            "The city's historic Main Street district sits on the banks of the Fox River. A paved Riverwalk connects boutique shops, restaurants, and live-music venues, anchored by the landmark 1894 Courthouse and capped by Frame Park to the west.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Old_Waukesha_County_Courthouse_front_view_2012.jpg/1280px-Old_Waukesha_County_Courthouse_front_view_2012.jpg",
            alt: "Front facade of the historic Old Waukesha County Courthouse on a clear day",
            credit: "Photo: Kenneth C. Zirkel / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Old_Waukesha_County_Courthouse_front_view_2012.jpg",
          },
        },
        {
          name: "Fox River Trail",
          category: "Recreation",
          blurb:
            "A 7-mile paved multi-use trail follows the Fox River southwest from Frame Park through mature floodplain forest to Fox River County Park. Perfect for biking, running, and wildlife watching year-round.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Fox_River_Trail%2C_Waukesha_%28October_2023%29_04.jpg/1280px-Fox_River_Trail%2C_Waukesha_%28October_2023%29_04.jpg",
            alt: "Paved Fox River Trail winding through autumn forest along the Fox River in Waukesha, Wisconsin",
            credit: "Photo: DiscoA340 / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Fox_River_Trail,_Waukesha_(October_2023)_04.jpg",
          },
        },
        {
          name: "Retzer Nature Center",
          category: "Park",
          blurb:
            "A 483-acre Waukesha County preserve of prairies, wetlands, woodlands, and butterfly gardens. Features a learning center, planetarium, all-accessible boardwalk, and restored native prairie -- plus year-round nature education programs.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Retzer_Nature_Center_Waukesha_County_Park_System_view_from_northern_observation_tower_-_panoramio.jpg/1280px-Retzer_Nature_Center_Waukesha_County_Park_System_view_from_northern_observation_tower_-_panoramio.jpg",
            alt: "View over the prairie at Retzer Nature Center from the northern observation tower, Waukesha, Wisconsin",
            credit: "Photo: Vince Mulhollon / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Retzer_Nature_Center_Waukesha_County_Park_System_view_from_northern_observation_tower_-_panoramio.jpg",
          },
        },
      ],
      more: [
        { name: "Frame Park", category: "Park" },
        { name: "Waukesha Oktoberfest", category: "Event" },
        { name: "Waukesha County Fair", category: "Event" },
        { name: "Wisconsin Highland Games", category: "Event" },
        { name: "Friday Night Live", category: "Event" },
        { name: "Fox River Sanctuary", category: "Recreation" },
        { name: "WhirlyBall", category: "Recreation" },
      ],
    },
  },
  wauwatosa: {
    lifestyle: {
      walkScore: { value: 60, label: "Somewhat Walkable" },
      commute: {
        carMinutes: "10-15 min",
        routes: ["I-94", "US-45", "Hwy 100"],
        transitNote:
          "MCTS CONNECT 1 BRT runs Wisconsin Ave directly to downtown Milwaukee. Route 30 runs every 10 minutes.",
      },
      safety: {
        grade: "C-",
        percentile: 37,
        note:
          "Overall C- on CrimeGrade (37th percentile). Violent crime earns a B- (60th percentile), running below the national average. Property crime pulls the composite down.",
      },
      idealBuyer: {
        tags: ["Move-up families", "Dual-income professionals", "Young couples"],
        summary:
          "Buyers who want top-ranked schools, a walkable village center, and historic charm without the density of the city -- all within 15 minutes of downtown Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Milwaukee County Zoo",
          category: "Attraction",
          blurb:
            "190 park-like acres and more than 2,200 animals across 340+ species. One of the Midwest's premier zoos, it draws roughly 1.3 million visitors per year and sits directly on Wauwatosa's eastern border.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Milwaukee_County_Zoo_August_2022_001_%28Main_Entrance%29.jpg/1280px-Milwaukee_County_Zoo_August_2022_001_%28Main_Entrance%29.jpg",
            alt: "Main entrance archway of the Milwaukee County Zoo on a sunny day",
            credit: "Photo: Michael Barera / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Milwaukee_County_Zoo_August_2022_001_(Main_Entrance).jpg",
          },
        },
        {
          name: "Hart Park",
          category: "Park",
          blurb:
            "Wauwatosa's 52-acre riverfront park along the Menomonee River. Locals gather at the Rotary Performance Pavilion for Tosa Tonight, a free Wednesday-evening summer concert series running more than 20 years.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Hart_Park.jpg/1280px-Hart_Park.jpg",
            alt: "Hart Park in Wauwatosa, Wisconsin, showing green space along the Menomonee River",
            credit: "Photo: Awkwafaba / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Hart_Park.jpg",
          },
        },
        {
          name: "Wauwatosa Village",
          category: "Neighborhood",
          blurb:
            "The historic commercial heart of Tosa: 100+ independent shops, restaurants, and cafes clustered along State Street, Harwood, and Underwood avenues. Home to the Saturday Tosa Farmers Market and TosaFest each September.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Wauwatosavillage1.jpg/1280px-Wauwatosavillage1.jpg",
            alt: "Ace Hardware building in the Village of Wauwatosa showing the historic commercial streetscape",
            credit: "Photo: NickSchweitzer / Wikimedia Commons",
            license: "CC BY 2.5",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Wauwatosavillage1.jpg",
          },
        },
      ],
      more: [
        { name: "Mayfair Mall", category: "Shopping" },
        { name: "The Mayfair Collection", category: "Shopping" },
        { name: "Eldr+Rime", category: "Dining" },
        { name: "Explorium Brewpub", category: "Dining" },
        { name: "Le Reve Patisserie & Cafe", category: "Dining" },
        { name: "Tosa Farmers Market", category: "Event" },
        { name: "TosaFest", category: "Event" },
        { name: "Oak Leaf Trail", category: "Recreation" },
        { name: "Hank Aaron State Trail", category: "Recreation" },
      ],
    },
  },
};

export function getMarketProfile(id: string): MarketProfile | null {
  return marketProfiles[id] ?? null;
}
export default marketProfiles;
