import type { MarketProfile } from "../marketProfiles";
import batchA from "./waukesha/batch-a";
import batchB from "./waukesha/batch-b";
import batchC from "./waukesha/batch-c";
import batchD from "./waukesha/batch-d";

const waukeshaProfiles: Record<string, MarketProfile> = {
  ...batchA,
  ...batchB,
  ...batchC,
  ...batchD,
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
};

export default waukeshaProfiles;
