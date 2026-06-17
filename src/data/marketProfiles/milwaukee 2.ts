import type { MarketProfile } from "../marketProfiles";
import batchA from "./milwaukee/batch-a";
import batchB from "./milwaukee/batch-b";
import batchC from "./milwaukee/batch-c";
import batchD from "./milwaukee/batch-d";

const milwaukeeProfiles: Record<string, MarketProfile> = {
  ...batchA,
  ...batchB,
  ...batchC,
  ...batchD,
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

export default milwaukeeProfiles;
