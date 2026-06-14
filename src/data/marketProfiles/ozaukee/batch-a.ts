import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  mequon: {
    lifestyle: {
      walkScore: { value: 11, label: "Car-Dependent" },
      commute: {
        carMinutes: "20-25 min",
        routes: ["I-43", "Port Washington Rd (US-141)"],
        transitNote:
          "No commuter rail. MCTS Route 143 provides limited weekday express bus service via Port Washington Road.",
      },
      safety: {
        grade: "A+",
        note:
          "A+ overall on CrimeGrade.org. Violent crime runs at roughly one-tenth the national average. Mequon is consistently ranked among the safest cities in Wisconsin.",
      },
      idealBuyer: {
        tags: [
          "Affluent families",
          "Empty-nesters",
          "Lakefront buyers",
          "Concordia University affiliates",
        ],
        summary:
          "Buyers seeking generous lot sizes, top-rated Mequon-Thiensville schools, and a private, estate-home atmosphere on Milwaukee's North Shore — willing to drive in exchange for space, safety, and Lake Michigan access at Virmond Park.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Concordia University Wisconsin",
          category: "University",
          blurb:
            "A private Lutheran university on 192 acres along Lake Michigan's shoreline. The campus anchors Mequon's identity, hosts public cultural events, and provides a built-in community of faculty and graduate families.",
        },
        {
          name: "Virmond Park",
          category: "Park",
          blurb:
            "Ozaukee County's premier lakefront park: 78 wooded acres dropping to a sandy Lake Michigan beach. Trails wind through a glacial ravine to the water's edge — a rare public lakefront access point along the North Shore.",
        },
        {
          name: "Mequon Town Center",
          category: "Shopping & Dining",
          blurb:
            "A walkable mixed-use district along Mequon Road anchoring the city's commercial core. Independent restaurants, boutiques, and services give Mequon's otherwise suburban landscape a genuine gathering place.",
        },
      ],
      more: [
        { name: "Mequon Nature Preserve", category: "Recreation" },
        { name: "Interurban Trail", category: "Recreation" },
        { name: "Milwaukee River Greenway", category: "Recreation" },
        { name: "Mequon-Thiensville School District", category: "Education" },
        { name: "Harvest Market", category: "Shopping" },
        { name: "Brandywine Restaurant", category: "Dining" },
        { name: "Trattoria di Carlo", category: "Dining" },
      ],
    },
  },

  cedarburg: {
    lifestyle: {
      walkScore: { value: 55, label: "Somewhat Walkable" },
      commute: {
        carMinutes: "25-30 min",
        routes: ["I-43", "WI-57 (Washington Ave)"],
        transitNote:
          "No commuter rail. Car is the primary mode; I-43 on-ramp is minutes from downtown.",
      },
      safety: {
        grade: "A+",
        note:
          "A+ on CrimeGrade.org with a near-zero violent crime rate — roughly one-thirtieth the national average. Consistently ranked the safest city in Wisconsin and among the safest small cities in the Midwest.",
      },
      idealBuyer: {
        tags: [
          "Historic-home enthusiasts",
          "Young families",
          "Creatives & artisans",
          "Weekend-getaway seekers",
        ],
        summary:
          "Buyers who want National Register limestone streetscapes, boutique-downtown walkability, and top-tier safety in a small city that draws visitors from across the region — without sacrificing quick I-43 access to Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Washington Avenue Historic District",
          category: "Historic District",
          blurb:
            "One of Wisconsin's most intact 19th-century commercial streetscapes: more than 100 limestone and cream-brick buildings lining Washington Avenue, listed on the National Register of Historic Places in 1986. Independent galleries, wine shops, and cafes occupy every storefront.",
        },
        {
          name: "Cedar Creek Settlement",
          category: "Shopping & Arts",
          blurb:
            "A 19th-century woolen mill complex converted into a destination of 20+ specialty shops, an award-winning winery (Cedar Creek Winery), and art studios set along the rushing Cedar Creek — the commercial and cultural heart of downtown.",
        },
        {
          name: "Covered Bridge Park",
          category: "Park",
          blurb:
            "Home to one of Wisconsin's last remaining historic covered bridges (1876), this park along Cedar Creek offers picnicking, fishing, and a window into Cedarburg's German-settler heritage in a postcard-worthy setting.",
        },
      ],
      more: [
        { name: "Cedarburg Cultural Center", category: "Arts" },
        { name: "Cedar Creek Winery", category: "Dining & Wine" },
        { name: "Cedarburg Strawberry Festival", category: "Event" },
        { name: "Cedarburg Wine & Harvest Festival", category: "Event" },
        { name: "Stagecoach Inn Bed & Breakfast", category: "Lodging" },
        { name: "Ozaukee Interurban Trail", category: "Recreation" },
        { name: "Cedarburg School District", category: "Education" },
        { name: "Hamilton Park", category: "Recreation" },
      ],
    },
  },

  grafton: {
    lifestyle: {
      walkScore: { value: 35, label: "Car-Dependent" },
      commute: {
        carMinutes: "25-30 min",
        routes: ["I-43", "WI-60"],
      },
      safety: {
        grade: "A",
        note:
          "A overall on CrimeGrade.org. Crime rate runs well below both the Wisconsin state average and national average, making Grafton one of the safer communities in the Milwaukee metro.",
      },
      idealBuyer: {
        tags: [
          "Value-conscious families",
          "History buffs",
          "Outdoor enthusiasts",
          "First-time buyers",
        ],
        summary:
          "Buyers who want affordable, well-kept neighborhoods near the Milwaukee River, a genuine small-town character, and a surprising connection to American music history — at a lower price point than Cedarburg or Mequon while still in Ozaukee County.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Paramount Records Historical Site",
          category: "History",
          blurb:
            "Between 1929 and 1932, the Wisconsin Chair Company's factory on this Grafton site housed Paramount Records, where Charley Patton, Son House, Skip James, and Ma Rainey recorded foundational American blues. A historical marker at Lime Kiln Park commemorates this globally significant musical heritage.",
        },
        {
          name: "Lime Kiln Park",
          category: "Park",
          blurb:
            "A Milwaukee River greenway preserving 19th-century lime kiln ruins on the west bank. Trails connect to the Ozaukee Interurban Trail, and the river bottomlands offer fishing, wildlife watching, and quiet wooded respite from the village.",
        },
        {
          name: "Grafton on the Bay (Marina District)",
          category: "Recreation",
          blurb:
            "Grafton's access to the Milwaukee River corridor ties into a network of boating, kayaking, and riverfront dining destinations that give the village an outdoor recreation identity beyond its suburban grid.",
        },
      ],
      more: [
        { name: "Ozaukee Interurban Trail", category: "Recreation" },
        { name: "Milwaukee River Trail", category: "Recreation" },
        { name: "Paramount Blues Festival", category: "Event" },
        { name: "Grafton Public Library", category: "Community" },
        { name: "Grafton High School", category: "Education" },
        { name: "Piggly Wiggly", category: "Shopping" },
        { name: "Big Mouth BBQ", category: "Dining" },
      ],
    },
  },

  port_washington: {
    lifestyle: {
      walkScore: { value: 55, label: "Somewhat Walkable" },
      commute: {
        carMinutes: "30-35 min",
        routes: ["I-43"],
        transitNote:
          "No commuter rail. I-43 provides a direct freeway connection to downtown Milwaukee. Metra-style service is not available in Wisconsin.",
      },
      safety: {
        grade: "A+",
        note:
          "A+ on CrimeGrade.org. Port Washington is safer than the Wisconsin state average and the national average; ranked among the safest communities on the Lake Michigan shoreline.",
      },
      idealBuyer: {
        tags: [
          "Lake Michigan lifestyle seekers",
          "Boaters",
          "Small-town charm buyers",
          "Retirees",
          "Remote workers",
        ],
        summary:
          "Buyers drawn to a genuine harbor town with a working marina, historic lighthouse, bluff-top views, and a walkable downtown of independent shops and restaurants — all 30 minutes from Milwaukee via a single freeway.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Port Washington Marina & Harbor",
          category: "Recreation",
          blurb:
            "One of the largest recreational marinas on Lake Michigan's western shore, with 500+ slips, charter fishing fleets, and a lakefront promenade. The harbor is the social anchor of Port Washington and draws boaters from across the region.",
        },
        {
          name: "1860 Light Station Museum",
          category: "Landmark",
          blurb:
            "Wisconsin's oldest surviving lighthouse complex: a Cream City brick Italianate keeper's house and attached tower built in 1860, now a museum operated by the Port Washington Historical Society. The adjacent 1935 Art Deco breakwater lighthouse is one of the most photographed structures on the Great Lakes.",
        },
        {
          name: "Coal Dock Park",
          category: "Park",
          blurb:
            "A lakefront park on the site of a former coal-handling facility, offering sweeping Lake Michigan panoramas, a public boat launch, and direct access to the breakwater walk. It is Port Washington's premier gathering spot for sunsets and summer events.",
        },
      ],
      more: [
        { name: "Fish Day Festival", category: "Event" },
        { name: "Port Washington Farmers Market", category: "Event" },
        { name: "Smith Brothers Fish Shanty", category: "Dining" },
        { name: "Twisted Willow Restaurant", category: "Dining" },
        { name: "Port Washington Public Library", category: "Community" },
        { name: "Ozaukee Interurban Trail", category: "Recreation" },
        { name: "Port Washington School District", category: "Education" },
        { name: "Rotary Park", category: "Recreation" },
      ],
    },
  },
};

export default batch;
