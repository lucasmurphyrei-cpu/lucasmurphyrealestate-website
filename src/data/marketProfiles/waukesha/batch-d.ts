import type { MarketProfile } from "../../marketProfiles";

// Sources: Wikipedia, crimegrade.org, walkscore.com, Waukesha County Parks, Wisconsin DNR.
// Photos: Wikimedia Commons CC0 only (Lapham Peak images by goodfreephotos.com via Slick-o-bot).
// Pewaukee Lake photos omitted — all candidate Wikimedia URLs returned 404 or 429 during verification.
// Nashotah House Seminary photo omitted — Wikimedia returned 400/429 on thumb; source file CC BY-SA 4.0 by Jim Roberts
//   but URL could not be confirmed 200 OK before deadline.

const batch: Record<string, MarketProfile> = {
  north_prairie: {
    lifestyle: {
      walkScore: { value: 8, label: "Car-Dependent" },
      commute: {
        carMinutes: "35-45 min",
        routes: ["I-43 N to I-94 E", "Hwy 59", "County Road NN"],
      },
      safety: {
        grade: "A-",
        percentile: 79,
        note:
          "A- overall on CrimeGrade (79th percentile — safer than 79% of U.S. cities). Very low absolute crime counts for a village of roughly 2,500 residents.",
      },
      idealBuyer: {
        tags: ["Rural-lifestyle seekers", "Growing families", "Privacy buyers"],
        summary:
          "Buyers who want generous lot sizes, a tight small-town feel, and top-rated Mukwonago Area schools, and are comfortable with a 35-45 minute highway commute to Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "North Prairie Village Park",
          category: "Park",
          blurb:
            "The village's central green space anchors community life with open fields, a playground, and a pavilion. Youth sports leagues, summer concerts, and the annual Village Days celebration all draw residents together here.",
        },
      ],
      more: [
        { name: "Mukwonago River Water Trail", category: "Recreation" },
        { name: "Kettle Moraine State Forest (Southern Unit)", category: "Recreation" },
        { name: "Mukwonago Area School District", category: "Education" },
      ],
    },
  },

  big_bend: {
    lifestyle: {
      walkScore: { value: 8, label: "Car-Dependent" },
      commute: {
        carMinutes: "30-40 min",
        routes: ["Hwy 164 to I-894", "Hwy 18", "County Road L"],
      },
      safety: {
        grade: "A",
        percentile: 92,
        note:
          "A overall on CrimeGrade (92nd percentile — safer than 92% of U.S. cities). One of the safest small communities in Waukesha County by per-capita crime rate.",
      },
      idealBuyer: {
        tags: ["Nature lovers", "Fox River enthusiasts", "Value-focused families"],
        summary:
          "Buyers drawn to riverside living on the Fox River, outstanding safety, and village-scale community character at more accessible price points than Lake Country neighbors.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Fox River",
          category: "Recreation",
          blurb:
            "The village sits at the namesake bend where the Fox River curves from east to south. Canoe and kayak put-ins, fishing access, and riverside walking define everyday outdoor life here. Fox River County Park, just upstream, adds picnic areas and additional trail access.",
        },
        {
          name: "Fox River County Park",
          category: "Park",
          blurb:
            "A Waukesha County park straddling the Fox River near Big Bend, offering picnic shelters, fishing piers, and wooded hiking trails through river-bottom hardwood forest.",
        },
      ],
      more: [
        { name: "Mukwonago Area School District", category: "Education" },
        { name: "Kettle Moraine State Forest (Southern Unit)", category: "Recreation" },
        { name: "Big Bend Village Park", category: "Park" },
      ],
    },
  },

  merton: {
    lifestyle: {
      walkScore: { value: 5, label: "Car-Dependent" },
      commute: {
        carMinutes: "35-45 min",
        routes: ["Hwy 16 to I-94", "County Road K", "Hwy 18"],
      },
      safety: {
        grade: "A+",
        note:
          "A+ on CrimeGrade — among the lowest crime rates of any community near Pewaukee. Data sourced from the nearby-cities comparison table on crimegrade.org.",
      },
      idealBuyer: {
        tags: ["Lake Country buyers", "Privacy seekers", "Outdoor recreation enthusiasts"],
        summary:
          "Buyers who want the Lake Country lifestyle — wooded lots, lake access on Upper and Lower Nemahbin Lake, and extreme quiet — without the price premium of Chenequa or Nashotah.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Upper & Lower Nemahbin Lake",
          category: "Recreation",
          blurb:
            "Twin glacial lakes totaling over 900 acres that define Merton's Lake Country identity. Fishing (walleye, muskie, bass), boating, and lakefront living draw buyers to the village and surrounding town.",
        },
        {
          name: "Merton Area Trail System",
          category: "Recreation",
          blurb:
            "A network of unpaved recreational paths and county-road shoulders through the town's glacially sculpted terrain, connecting lake accesses and woodland parcels throughout the Merton area.",
        },
      ],
      more: [
        { name: "Hartland-Lakeside School District", category: "Education" },
        { name: "Merton Community Park", category: "Park" },
        { name: "Lake Country Scenic Drive (Hwy 16 Corridor)", category: "Recreation" },
      ],
    },
  },

  nashotah: {
    lifestyle: {
      walkScore: { value: 4, label: "Car-Dependent" },
      commute: {
        carMinutes: "30-40 min",
        routes: ["Hwy 16 to I-94", "County Road C", "Hwy 18"],
      },
      safety: {
        grade: "A-",
        note:
          "A- on CrimeGrade — sourced from the nearby-cities comparison table on crimegrade.org. One of Waukesha County's safest communities.",
      },
      idealBuyer: {
        tags: ["Lake Country prestige buyers", "Privacy seekers", "Academic / faith community"],
        summary:
          "Buyers seeking an exclusive, ultra-low-density Lake Country enclave anchored by Nashotah House Theological Seminary, with quick access to Pewaukee Lake and the Hwy 16 corridor.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Nashotah Park (Waukesha County)",
          category: "Park",
          blurb:
            "A Waukesha County park adjacent to the village offering swimming, fishing, picnic areas, and hiking trails on several small glacial lakes. One of the county park system's most popular summer destinations.",
        },
        {
          name: "Nashotah House Theological Seminary",
          category: "Landmark",
          blurb:
            "A historic Anglican seminary founded in 1842 on a wooded campus on Nashotah Lake. Its 19th-century Gothic chapel and serene grounds are a defining feature of the village's character and have been listed on the National Register of Historic Places.",
        },
      ],
      more: [
        { name: "Arrowhead Union High School District", category: "Education" },
        { name: "Nashotah Lake", category: "Recreation" },
        { name: "Lake Country Trail access", category: "Recreation" },
      ],
    },
  },

  wales: {
    lifestyle: {
      walkScore: { value: 11, label: "Car-Dependent" },
      commute: {
        carMinutes: "30-40 min",
        routes: ["I-94 E", "Hwy 18", "County Road DL"],
      },
      safety: {
        grade: "A",
        percentile: 91,
        note:
          "A overall on CrimeGrade (91st percentile — safer than 91% of U.S. cities). Safer than both the Wisconsin state average and the national average, per crimegrade.org.",
      },
      idealBuyer: {
        tags: ["Outdoor enthusiasts", "Kettle Moraine hikers", "Quiet-village families"],
        summary:
          "Buyers who want immediate access to Lapham Peak State Forest and the Ice Age Trail, top-rated Kettle Moraine schools, and a true small-village pace — about 28 miles west of Milwaukee via I-94.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Lapham Peak Unit, Kettle Moraine State Forest",
          category: "Recreation",
          blurb:
            "Located just a few miles north of the village, Lapham Peak is the highest point in Waukesha County at 1,233 feet above sea level. The unit features 17 miles of hiking and cross-country ski trails, an observation tower with panoramic views, and Ice Age Trail access.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Gfp-wisconsin-lapham-peak-state-park-pond.jpg/1280px-Gfp-wisconsin-lapham-peak-state-park-pond.jpg",
            alt: "Glacial pond surrounded by prairie and woodland at Lapham Peak State Forest, Wisconsin",
            credit: "Photo: goodfreephotos.com / Wikimedia Commons",
            license: "CC0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Gfp-wisconsin-lapham-peak-state-park-pond.jpg",
          },
        },
        {
          name: "Ice Age National Scenic Trail",
          category: "Recreation",
          blurb:
            "The 1,200-mile Ice Age Trail passes directly through the Wales area and Lapham Peak, tracing the terminal moraine of the last glacier. A popular segment for day hikers and backpackers, it connects to a broader network across Wisconsin.",
        },
      ],
      more: [
        { name: "Kettle Moraine School District", category: "Education" },
        { name: "Wales Village Park", category: "Park" },
        { name: "Scuppernong Springs Nature Area", category: "Recreation" },
      ],
    },
  },

  pewaukee: {
    lifestyle: {
      walkScore: { value: 28, label: "Car-Dependent" },
      commute: {
        carMinutes: "25-30 min",
        routes: ["I-94 E", "Hwy 164", "Hwy 16"],
        transitNote:
          "No fixed-route transit service to downtown Milwaukee. The I-94 corridor provides the primary highway connection; the Pewaukee lakefront and Village area have limited seasonal pedestrian activity.",
      },
      safety: {
        grade: "B+",
        percentile: 74,
        note:
          "B+ overall on CrimeGrade (74th percentile — safer than 74% of U.S. cities). Northeast neighborhoods score highest; crime concentrates near commercial corridors. Source: crimegrade.org.",
      },
      idealBuyer: {
        tags: [
          "Lake lifestyle buyers",
          "Boating enthusiasts",
          "Upper-middle-class families",
          "Water-ski culture",
        ],
        summary:
          "Buyers who want direct access to Pewaukee Lake's 2,493 acres of boating, fishing, and waterski shows, strong A+ Pewaukee schools, and a vibrant summer social scene on the water — all within 25 minutes of Milwaukee via I-94.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Pewaukee Lake",
          category: "Recreation",
          blurb:
            "At 2,493 acres, Pewaukee Lake is the largest lake in Waukesha County and the centerpiece of community life. Renowned for muskie, walleye, and bass fishing, boating, paddleboarding, and the Thursday-evening waterski shows that draw crowds all summer long.",
        },
        {
          name: "Pewaukee Village Beach & Lakefront Park",
          category: "Park",
          blurb:
            "The village's public swimming beach on Pewaukee Lake features a sandy beach, floating pier, and lakefront green space. Wednesday-evening live music at the waterfront and the waterski shows on Thursday nights make this the social hub of summer in Pewaukee.",
        },
        {
          name: "Downtown Pewaukee Village",
          category: "Neighborhood",
          blurb:
            "A compact lakeside commercial district with restaurants, bars, and marinas steps from the water's edge. The mix of year-round locals and summer lake traffic gives it a resort-town energy, particularly from May through September.",
        },
      ],
      more: [
        { name: "Pewaukee School District (Niche A+)", category: "Education" },
        { name: "The Ingleside Hotel & Springs Water Park", category: "Attraction" },
        { name: "Wednesday Night Live Music (lakefront, summer)", category: "Event" },
        { name: "Thursday Waterski Shows", category: "Event" },
        { name: "Lake Country Trail", category: "Recreation" },
        { name: "Generac (major local employer)", category: "Employment" },
      ],
    },
  },
};

export default batch;
