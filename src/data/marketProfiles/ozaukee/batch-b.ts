import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  thiensville: {
    lifestyle: {
      walkScore: { value: 30, label: "Car-Dependent" },
      commute: {
        carMinutes: "25-35 min",
        routes: ["I-43 S", "Hwy 57 S"],
        transitNote:
          "No local bus service. Ozaukee County Express commuter bus stops in nearby Mequon (Port Washington Rd park-and-ride) for downtown Milwaukee service.",
      },
      safety: {
        grade: "A",
        note:
          "Very low crime consistent with small Ozaukee County villages. No published CrimeGrade percentile for this municipality; residents and community sources consistently rate safety as excellent.",
      },
      idealBuyer: {
        tags: ["Empty nesters", "Families", "Remote workers"],
        summary:
          "Buyers who want a true small-town feel on the Milwaukee River — walkable to Main Street shops and Village Park — while staying within 30 minutes of downtown Milwaukee via I-43.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Village Park",
          category: "Park",
          blurb:
            "Thiensville's beloved riverside green space sits along the Milwaukee River just steps from Main Street. The park features open lawns, fishing access, a bandshell, and a canoe/kayak launch — the social hub for warm-weather weekends in the village.",
        },
        {
          name: "Main Street Historic District",
          category: "Neighborhood",
          blurb:
            "A compact, NRHP-listed commercial corridor of early-twentieth-century brick storefronts housing independent boutiques, coffee shops, and restaurants. One of the most intact small-town main streets in Ozaukee County.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Thiensville_Main_St_May09.jpg/1280px-Thiensville_Main_St_May09.jpg",
            alt: "Historic brick storefronts along Thiensville Main Street on a clear day",
            credit: "Photo: Freekee (Kevin Hansen) / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Thiensville_Main_St_May09.jpg",
          },
        },
        {
          name: "Milwaukee River Trail",
          category: "Recreation",
          blurb:
            "The Ozaukee Interurban Trail runs through the village and connects north toward Port Washington and south into Mequon, offering paved multi-use paths ideal for cycling, walking, and inline skating along the river corridor.",
        },
      ],
      more: [
        { name: "Thiensville Farmers Market", category: "Event" },
        { name: "Ozaukee Interurban Trail", category: "Recreation" },
        { name: "Milwaukee River fishing access", category: "Recreation" },
      ],
    },
  },

  saukville: {
    lifestyle: {
      walkScore: { value: 28, label: "Car-Dependent" },
      commute: {
        carMinutes: "30-40 min",
        routes: ["I-43 S"],
        transitNote:
          "Ozaukee County Express commuter bus provides weekday service to downtown Milwaukee from the Saukville Park-and-Ride on I-43.",
      },
      safety: {
        grade: "A",
        note:
          "Low crime consistent with small Ozaukee County villages. No published CrimeGrade percentile for this municipality; community sources rate safety as very good.",
      },
      idealBuyer: {
        tags: ["Nature lovers", "Families", "Value seekers"],
        summary:
          "Buyers who want affordability and elbow room in a growing village with easy I-43 access to Milwaukee, plus world-class nature trails and river paddling literally next door at Riveredge Nature Center.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Riveredge Nature Center",
          category: "Nature",
          blurb:
            "485 acres of prairies, woodlands, wetlands, and a mile and a half of Milwaukee River shoreline, with ten miles of hiking trails. A Cornell Lab eBird hotspot hosting 168 species. One of Wisconsin's premier environmental education centers, operating since 1968.",
        },
        {
          name: "Milwaukee River",
          category: "Recreation",
          blurb:
            "The Milwaukee River flows through Saukville, offering excellent canoeing, kayaking, and fishing. The Saukville-to-Ehlers-Park paddle route is a popular half-day float through wooded river corridors.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Saukville_Wisconsin_3965.jpg/1280px-Saukville_Wisconsin_3965.jpg",
            alt: "Street view of Saukville, Wisconsin showing the small village commercial area",
            credit: "Photo: Dori / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Saukville_Wisconsin_3965.jpg",
          },
        },
      ],
      more: [
        { name: "Ozaukee Interurban Trail", category: "Recreation" },
        { name: "Village Hall Park", category: "Park" },
        { name: "Saukville Public Library", category: "Community" },
      ],
    },
  },

  belgium: {
    lifestyle: {
      walkScore: { value: 15, label: "Car-Dependent" },
      commute: {
        carMinutes: "35-45 min",
        routes: ["I-43 S"],
        transitNote:
          "No local transit. Weekday Ozaukee County Express service is available from Port Washington (approx. 6 miles south) for downtown Milwaukee commuters.",
      },
      safety: {
        grade: "A",
        note:
          "Very low crime consistent with rural Ozaukee County communities. No published CrimeGrade percentile for this municipality.",
      },
      idealBuyer: {
        tags: ["Outdoor enthusiasts", "Lake Michigan lifestyle", "Remote workers", "Retirees"],
        summary:
          "Buyers who prioritize Lake Michigan access, state-park proximity, and quiet rural living over walkability — ideal for those working remotely or willing to commute 40 minutes to Milwaukee via I-43.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Harrington Beach State Park",
          category: "State Park",
          blurb:
            "715 acres of Lake Michigan shoreline, woodland, and wetland surrounding a 26-acre former limestone quarry lake. Features a mile-long sand beach, seven miles of trails, 69 campsites, and remnants of a 700-foot historic quarry pier. One of the most scenic state parks in southeast Wisconsin.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/HarringtonBeachStateParkTrail.jpg/1280px-HarringtonBeachStateParkTrail.jpg",
            alt: "Wooded hiking trail at Harrington Beach State Park in Belgium, Wisconsin",
            credit: "Photo: Royalbroil / Wikimedia Commons",
            license: "CC BY-SA 2.5",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:HarringtonBeachStateParkTrail.jpg",
          },
        },
        {
          name: "Belgium Village Hall",
          category: "Community",
          blurb:
            "The center of civic life in this small village, surrounded by a tight-knit community known for its Belgian heritage and rural character. The village hosts seasonal community events drawing families from across Ozaukee County.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Belgium_village_hall.jpg/1280px-Belgium_village_hall.jpg",
            alt: "Belgium, Wisconsin village hall building",
            credit: "Photo: Lavafrogg / Wikimedia Commons",
            license: "Public Domain",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Belgium_village_hall.jpg",
          },
        },
      ],
      more: [
        { name: "Lake Michigan Beach", category: "Recreation" },
        { name: "Harrington Beach camping", category: "Recreation" },
        { name: "Ozaukee Interurban Trail", category: "Recreation" },
      ],
    },
  },

  fredonia: {
    lifestyle: {
      walkScore: { value: 20, label: "Car-Dependent" },
      commute: {
        carMinutes: "35-45 min",
        routes: ["Hwy 57 S", "I-43 S via Saukville"],
        transitNote:
          "Wisconsin DOT operates a park-and-ride facility in Fredonia (WIS 57 and County H) for Ozaukee County Express commuter bus service to Milwaukee.",
      },
      safety: {
        grade: "A",
        note:
          "Very low crime consistent with small Ozaukee County villages. No published CrimeGrade percentile for this municipality.",
      },
      idealBuyer: {
        tags: ["Nature lovers", "Paddlers", "Families", "Remote workers"],
        summary:
          "Buyers seeking an affordable, small-village lifestyle with outstanding Milwaukee River access for fishing, kayaking, and hiking — and a manageable commute south on Hwy 57 or I-43.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Waubedonia Park",
          category: "Park",
          blurb:
            "A 40-plus-acre Ozaukee County park nestled between the Milwaukee River and the west edge of the village. Open year-round for fishing, hiking, camping, and picnicking, with direct river access that makes it a popular put-in for the Fredonia-to-Saukville canoe and kayak route.",
        },
        {
          name: "Milwaukee River Water Trail",
          category: "Recreation",
          blurb:
            "The stretch of the Milwaukee River through Fredonia is a designated paddling route, running south through wooded corridors toward Saukville and Ehlers Park. Popular with kayakers, canoeists, and anglers chasing smallmouth bass and northern pike.",
        },
      ],
      more: [
        { name: "Ozaukee Interurban Trail", category: "Recreation" },
        { name: "Fredonia Public Library", category: "Community" },
        { name: "Milwaukee River fishing", category: "Recreation" },
      ],
    },
  },
};

export default batch;
