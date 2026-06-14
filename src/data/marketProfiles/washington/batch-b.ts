import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  slinger: {
    lifestyle: {
      walkScore: { value: 28, label: "Car-Dependent" },
      commute: {
        carMinutes: "35-45 min",
        routes: ["US-41 / I-41", "Hwy 60"],
        transitNote: undefined,
      },
      safety: {
        grade: "A",
        percentile: 88,
        note:
          "Overall A on CrimeGrade (88th percentile for safety). Violent and property crime both earn an A — well below national averages for a village its size.",
      },
      idealBuyer: {
        tags: ["Racing enthusiasts", "Young families", "Value seekers", "Commuters"],
        summary:
          "Buyers who want a tight-knit Washington County village with affordable prices, growing amenities, and quick I-41 access to Milwaukee — plus a front-row seat to one of the Midwest's most storied short tracks.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Slinger Super Speedway",
          category: "Attraction",
          blurb:
            "A nationally recognized 1/4-mile high-banked asphalt oval that opened in 1948 and holds the world record for the fastest lap on a quarter-mile oval. The Slinger Nationals draw top ASA STARS National Tour competitors every summer to a 10,000-seat venue that is literally in the village backyard.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/SlingerSuperSpeedway.jpg/1280px-SlingerSuperSpeedway.jpg",
            alt: "Aerial view of the Slinger Super Speedway high-banked quarter-mile oval on a race day",
            credit: "Photo: Royalbroil / Wikimedia Commons",
            license: "CC BY-SA 2.5",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:SlingerSuperSpeedway.jpg",
          },
        },
        {
          name: "Pleasant Valley Nature Park",
          category: "Park",
          blurb:
            "A quiet village-owned nature area offering walking trails through wooded ravines and open meadow — a pocket of natural respite minutes from downtown Slinger.",
        },
        {
          name: "Big Cedar Lake",
          category: "Recreation",
          blurb:
            "A 1,200-acre lake just west of Slinger with a public boat launch, sandy swimming areas, and some of Washington County's best perch and bass fishing.",
        },
      ],
      more: [
        { name: "Pike Lake Unit, Kettle Moraine State Forest", category: "Park" },
        { name: "Little Switzerland Ski Area", category: "Recreation" },
        { name: "Washington County Fair Park", category: "Event" },
        { name: "Slinger Community Library", category: "Community" },
      ],
    },
  },

  kewaskum: {
    lifestyle: {
      walkScore: { value: 24, label: "Car-Dependent" },
      commute: {
        carMinutes: "40-50 min",
        routes: ["US-45 / I-41", "Hwy 28"],
        transitNote: undefined,
      },
      safety: {
        grade: "A-",
        percentile: 85,
        note:
          "Overall A- on CrimeGrade (85th percentile for safety). Violent crime earns an A- and property crime an A — a very low-crime environment relative to the national average.",
      },
      idealBuyer: {
        tags: ["Outdoor enthusiasts", "Families", "Remote workers", "Nature seekers"],
        summary:
          "Buyers drawn to the northern Kettle Moraine's glacial trails and lakes who want a genuine small-town character — walkable to a village core, with the Ice Age National Scenic Trail and Eisenbahn State Trail both accessible on foot or by bike.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Ice Age National Scenic Trail — Kewaskum Segment",
          category: "Recreation",
          blurb:
            "A 5.4-mile point-to-point segment of the 1,200-mile Ice Age Trail that threads through glacially sculpted terrain just south of the village, connecting Kettle Moraine State Forest's Northern Unit to the West Bend segment. Moderately challenging with outstanding views of drumlins and kettles.",
        },
        {
          name: "River Hill Park",
          category: "Park",
          blurb:
            "The village's premier riverfront park on the Milwaukee River at 1155 Riverview Drive. Features fishing piers, kayak and paddleboard access, picnic shelters, a playground, tennis, pickleball, volleyball, and basketball courts — the social hub of the community.",
        },
        {
          name: "Eisenbahn State Trail",
          category: "Recreation",
          blurb:
            "A paved rail-trail running through Kewaskum toward West Bend — popular with cyclists, inline skaters, and walkers looking for an easy, car-free route connecting the northern Kettle Moraine communities.",
        },
      ],
      more: [
        { name: "Kettle Moraine State Forest — Northern Unit", category: "Park" },
        { name: "Milwaukee River Segment, Ice Age Trail", category: "Recreation" },
        { name: "Kewaskum Veterans Memorial Park", category: "Park" },
        { name: "Village Hall Farmers Market", category: "Event" },
      ],
    },
  },

  richfield: {
    lifestyle: {
      walkScore: { value: 18, label: "Car-Dependent" },
      commute: {
        carMinutes: "30-40 min",
        routes: ["I-41 / US-41", "Hwy 167"],
        transitNote: undefined,
      },
      safety: {
        grade: "A-",
        percentile: 81,
        note:
          "Overall A- on CrimeGrade (81st percentile for safety). Violent crime earns an A and property crime an A- — among the safer communities in southeastern Wisconsin.",
      },
      idealBuyer: {
        tags: ["Acreage seekers", "Nature lovers", "Families", "Commuters to NW suburbs"],
        summary:
          "Buyers who want generous lot sizes, lake views, and a rural feel within 30-40 minutes of Milwaukee — with Pike Lake, Kettle Moraine State Forest, and the Holy Hill basilica as weekend anchors.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Pike Lake Unit, Kettle Moraine State Forest",
          category: "Park",
          blurb:
            "A 678-acre state forest unit centered on spring-fed Pike Lake, offering a sandy swimming beach, 18 miles of hiking trails, boat launches, and camping. The forested moraines and kettle topography make it one of Washington County's most visited outdoor destinations.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Pikelakepicnicandlake.JPG/1280px-Pikelakepicnicandlake.JPG",
            alt: "Sandy picnic area and calm waters of Pike Lake in the Kettle Moraine State Forest unit",
            credit: "Photo: Archbob / Wikimedia Commons",
            license: "CC0 1.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Pikelakepicnicandlake.JPG",
          },
        },
        {
          name: "Holy Hill National Shrine",
          category: "Attraction",
          blurb:
            "A Roman Catholic Marian basilica perched atop a 1,350-foot glacial hill four miles east of Richfield. Holy Hill draws nearly half a million visitors a year for its stunning hilltop views, Carmelite monastery, and fall foliage — one of Wisconsin's most recognizable landmarks.",
        },
        {
          name: "Kettle Hills Golf Course",
          category: "Recreation",
          blurb:
            "A 45-hole facility set among wooded kettles and rolling moraines, offering three distinct courses that challenge golfers of every skill level with elevation changes and scenic terrain uncommon in the Milwaukee metro.",
        },
      ],
      more: [
        { name: "Friess Lake", category: "Recreation" },
        { name: "Bark Lake", category: "Recreation" },
        { name: "Richfield Nature Park", category: "Park" },
        { name: "Heritage Park", category: "Park" },
        { name: "Glacier Hills County Park", category: "Park" },
        { name: "Richfield Days Festival", category: "Event" },
      ],
    },
  },

  newburg: {
    lifestyle: {
      walkScore: { value: 15, label: "Car-Dependent" },
      commute: {
        carMinutes: "40-50 min",
        routes: ["Hwy 33", "US-41 / I-41 via Grafton or Slinger"],
        transitNote: undefined,
      },
      safety: {
        grade: "A+",
        percentile: 94,
        note:
          "Overall A+ on CrimeGrade (94th percentile for safety). Violent crime earns an A+ and property crime an A — one of the safest small communities in Washington County.",
      },
      idealBuyer: {
        tags: ["Nature lovers", "Remote workers", "Small-town seekers", "Families"],
        summary:
          "Buyers looking for a truly quiet riverfront village with minimal crime and an exceptional natural amenity — Riveredge Nature Center — right at their doorstep, while remaining within an hour of Milwaukee or Ozaukee County employment centers.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Riveredge Nature Center",
          category: "Attraction",
          blurb:
            "One of the oldest and largest independent nature centers in southeastern Wisconsin, established in 1968. Riveredge spans over 485 acres of prairies, forests, ponds, and more than a mile of Milwaukee River frontage, with ten miles of trails and weekly programming for all ages.",
        },
        {
          name: "Milwaukee River Corridor",
          category: "Recreation",
          blurb:
            "Newburg sits directly on the Milwaukee River, offering residents kayaking, canoeing, and fly-fishing access along a scenic stretch that flows south through Ozaukee County toward Lake Michigan — a rare riverfront setting for a village this size.",
        },
      ],
      more: [
        { name: "Newburg Veteran's Memorial Park", category: "Park" },
        { name: "Washington County Recreational Trail", category: "Recreation" },
        { name: "Pike Lake Unit, Kettle Moraine State Forest", category: "Park" },
      ],
    },
  },
};

export default batch;
