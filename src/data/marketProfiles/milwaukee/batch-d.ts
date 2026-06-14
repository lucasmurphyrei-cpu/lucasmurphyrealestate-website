import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  bayside: {
    lifestyle: {
      walkScore: { value: 23, label: "Car-Dependent" },
      commute: {
        carMinutes: "15-20 min",
        routes: ["I-43", "Lake Dr (WIS-32)", "Brown Deer Rd"],
        transitNote:
          "MCTS Route 143 (Brown Deer) provides bus service toward downtown. Most residents commute by car via I-43 south.",
      },
      safety: {
        grade: "A-",
        note:
          "One of the safest communities in metro Milwaukee. Total crime runs roughly 75% below the national average and violent crime is near zero (City-Data / AreaVibes). Its small residential population can make per-resident curve ratings look middling, but the absolute incident counts are very low.",
      },
      idealBuyer: {
        tags: [
          "Empty nesters",
          "Nature lovers",
          "Executives",
          "Privacy seekers",
        ],
        summary:
          "Buyers who want a secluded, lakeside enclave — large lots, bluff views, and immediate access to 185 acres of Lake Michigan shoreline at Schlitz Audubon — while staying within 20 minutes of downtown Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Schlitz Audubon Nature Center",
          category: "Nature",
          blurb:
            "185 acres of forests, prairies, wetlands, and Lake Michigan shoreline laced with 6 miles of hiking trails. A 60-foot observation tower overlooks the bluff and lake, and an on-site raptor center rehabilitates birds of prey. The land was once the Schlitz Brewery's draft-horse farm before being donated to the National Audubon Society.",
        },
        {
          name: "Lake Michigan Bluff",
          category: "Recreation",
          blurb:
            "Bayside's eastern edge sits on the Lake Michigan bluff, with several neighborhood access points and parklands offering dramatic views. The shoreline draw is a key reason buyers choose the village over comparable inland suburbs.",
        },
        {
          name: "Ellsworth Park",
          category: "Park",
          blurb:
            "Village-owned green space within walking distance of Bayside's residential core, offering open play fields and a neighborhood gathering point for this 4,400-resident village.",
        },
      ],
      more: [
        { name: "Brown Deer Road Corridor", category: "Shopping" },
        { name: "Bayside Village Hall", category: "Civic" },
        { name: "Fox Point Farmers Market (adjacent)", category: "Event" },
        { name: "Lake Drive Scenic Route", category: "Recreation" },
        { name: "Oak Leaf Trail (North Shore segment)", category: "Recreation" },
      ],
    },
  },

  west_milwaukee: {
    lifestyle: {
      walkScore: { value: 65, label: "Somewhat Walkable" },
      commute: {
        carMinutes: "5-10 min",
        routes: ["I-894 / US-45", "W National Ave", "W Greenfield Ave"],
        transitNote:
          "MCTS bus stops on National Ave and Greenfield Ave within a short walk of most addresses. Route 14 (National) and Route 15 (Greenfield) connect to downtown Milwaukee.",
      },
      safety: {
        grade: "F",
        note:
          "Genuinely elevated. Property crime runs several times the national rate and violent crime is above average (AreaVibes). Its dense industrial and commercial footprint and small residential population of about 4,200 both contribute, but the absolute incident counts are high for its size.",
      },
      idealBuyer: {
        tags: [
          "First-time buyers",
          "Budget-conscious commuters",
          "Investors",
          "Tradespeople",
        ],
        summary:
          "Buyers who prioritize an ultra-short commute and affordable entry price in Milwaukee County. At just 1.1 square miles, West Milwaukee offers a compact, walkable village core with immediate freeway access — best suited to buyers who commute into downtown or the medical corridor.",
      },
    },
    amenities: {
      featured: [
        {
          name: "W National Ave Commercial Strip",
          category: "Shopping",
          blurb:
            "The village's main commercial artery has grocery, dining, and everyday retail within walking distance of most West Milwaukee addresses — a genuine convenience for a community of only 4,100 residents.",
        },
        {
          name: "Miller Park Way / American Family Field Access",
          category: "Recreation",
          blurb:
            "West Milwaukee sits directly adjacent to American Family Field (Milwaukee Brewers), giving residents some of the fastest game-day access of any address in Milwaukee County.",
        },
        {
          name: "Industrial Heritage District",
          category: "Neighborhood",
          blurb:
            "The village's history as a 19th-century railroad and manufacturing hub is visible in its brick industrial buildings, many now repurposed for small-batch manufacturing, auto services, and creative businesses.",
        },
      ],
      more: [
        { name: "W Greenfield Ave Shopping", category: "Shopping" },
        { name: "American Family Field", category: "Sports" },
        { name: "Mitchell Street Corridor (adjacent)", category: "Dining" },
        { name: "Pulaski Park (nearby)", category: "Park" },
        { name: "Oak Leaf Trail access", category: "Recreation" },
      ],
    },
  },

  cudahy: {
    lifestyle: {
      walkScore: { value: 45, label: "Car-Dependent" },
      commute: {
        carMinutes: "15-20 min",
        routes: ["I-794", "I-94 (Mitchell Interchange)", "S Lake Dr (WIS-32)"],
        transitNote:
          "MCTS serves Cudahy with several routes. I-794 provides a direct expressway connection north to downtown Milwaukee.",
      },
      safety: {
        grade: "C-",
        percentile: 34,
        note:
          "Overall C- on CrimeGrade.org (34th percentile). Property crime pulls the composite down while the cost of crime per resident ($440/year) tracks close to the national average.",
      },
      idealBuyer: {
        tags: [
          "Families",
          "Outdoor enthusiasts",
          "South Shore commuters",
          "First-time buyers",
        ],
        summary:
          "Buyers who want Lake Michigan lakefront park access and dense suburban amenities at working-class price points. Cudahy's 132-acre Sheridan Park — a Lake Michigan shoreline park with trails, a pool, and a birding hotspot — and the Oak Leaf Trail give active families an outdoor lifestyle most suburbs can't match at this price.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Sheridan Park",
          category: "Park",
          blurb:
            "Cudahy's marquee amenity: 132 acres along the Lake Michigan shore, created in 1914. The park includes a swimming pool, baseball and tennis facilities, fishing pond, model boat launch, children's playground, and the Oak Leaf Trail. The Cornell Lab's eBird program lists it as a birding hotspot with 210 species observed on the Great Lakes Migratory Bird Route.",
        },
        {
          name: "Oak Leaf Trail",
          category: "Recreation",
          blurb:
            "Milwaukee County's 135-mile multi-use trail passes through Cudahy, connecting Sheridan Park to the broader trail network. The lakefront segment through Cudahy is among the most scenic stretches for cyclists and runners.",
        },
        {
          name: "S Packard Ave Commercial District",
          category: "Shopping",
          blurb:
            "Cudahy's main commercial street runs north–south through the city with grocery stores, diners, taverns, and everyday retail. The corridor gives residents a compact, drivable downtown alternative for day-to-day errands.",
        },
      ],
      more: [
        { name: "Lake Drive Lakefront Corridor", category: "Recreation" },
        { name: "Cudahy Community Park", category: "Park" },
        { name: "Patrick Cudahy Memorial", category: "Landmark" },
        { name: "South Milwaukee border shops", category: "Shopping" },
        { name: "Cudahy School District", category: "Education" },
        { name: "Milwaukee Mitchell Airport (adjacent)", category: "Travel" },
      ],
    },
  },

  hales_corners: {
    lifestyle: {
      walkScore: { value: 28, label: "Car-Dependent" },
      commute: {
        carMinutes: "20-25 min",
        routes: [
          "I-894 / I-43 (Hale Interchange)",
          "Hwy 100 (S 108th St)",
          "Greenfield Ave",
        ],
        transitNote:
          "Minimal transit — only 0.9% of residents commute by public transportation. The I-894/I-43/Hwy 100 interchange sits at the village edge, making the car commute straightforward.",
      },
      safety: {
        grade: "B",
        note:
          "Very safe. Total crime is roughly 65% below the national average and violent crime runs about half the national rate (AreaVibes / City-Data). Moderate retail nudges the per-capita property rate, but absolute crime is low.",
      },
      idealBuyer: {
        tags: [
          "Garden enthusiasts",
          "Nature lovers",
          "Families with children",
          "Southwest commuters",
        ],
        summary:
          "Buyers drawn to Milwaukee County's largest park system anchor — Whitnall Park and Boerner Botanical Gardens are on the village's doorstep — and who want a quiet, tree-lined village feel with immediate freeway access southwest of the city. Best for car-dependent households prioritizing green space over walkability.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Boerner Botanical Gardens",
          category: "Attraction",
          blurb:
            "The oldest nationally recognized public garden in the Great Lakes region, built in the 1930s with Civilian Conservation Corps labor on the grounds of Whitnall Park. Forty acres of formal gardens — rose, perennial, annual, herb, and trial gardens — with arboretum plantings along the surrounding parkways. Open late April through early November.",
        },
        {
          name: "Whitnall Park",
          category: "Park",
          blurb:
            "The largest park in the Milwaukee County system, named for parks champion Charles B. Whitnall. In addition to Boerner Botanical Gardens, the park contains golf courses, picnic areas, hiking trails, and the Milwaukee County Grounds, making it a year-round destination for southwest-side residents.",
        },
        {
          name: "Hales Corners Village Center",
          category: "Neighborhood",
          blurb:
            "A compact, tree-lined village core along Janesville Road and Hwy 100 with independently owned restaurants, taverns, and shops. Residents cite a genuine small-town identity despite being surrounded by larger suburbs.",
        },
      ],
      more: [
        { name: "Hales Corners Park", category: "Park" },
        { name: "Village of Hales Corners Library", category: "Education" },
        { name: "Janesville Rd shops and dining", category: "Shopping" },
        { name: "Milwaukee County Golf (Whitnall)", category: "Recreation" },
        { name: "Root River Parkway (nearby)", category: "Recreation" },
        { name: "Hales Corners Fest", category: "Event" },
      ],
    },
  },
};

export default batch;
