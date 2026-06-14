import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  milwaukee: {
    lifestyle: {
      walkScore: { value: 62, label: "Somewhat Walkable" },
      commute: {
        carMinutes: "0-15 min",
        routes: ["I-94", "I-43", "US-41", "Hwy 175"],
        transitNote:
          "MCTS operates extensive bus service across the city, including the CONNECT 1 BRT on Wisconsin Ave. Many residents are already downtown or within a 5–10 minute drive of the core.",
      },
      safety: {
        grade: "D",
        note:
          "Overall D on CrimeGrade (30th percentile for safety city-wide). Violent crime rates above the national average; property crime pulls the composite down further. Safety varies significantly by neighborhood — the East Side, Third Ward, and Bay View neighborhoods score considerably better than the city average.",
      },
      idealBuyer: {
        tags: ["Urban professionals", "Arts & culture enthusiasts", "First-time buyers", "Investors"],
        summary:
          "Buyers drawn to a genuine big-city experience at Midwest prices — walkable lakefront neighborhoods, world-class museums, a nationally recognized food scene, and strong rental demand driven by a large healthcare and university workforce.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Milwaukee Art Museum",
          category: "Attraction",
          blurb:
            "Designed by Santiago Calatrava, the MAM's Burke Brise Soleil — movable white steel wings spanning 217 feet — opens and closes daily in a spectacle visible from the lakefront. The permanent collection exceeds 30,000 works, with particular strength in Georgia O'Keeffe and German Expressionism.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Milwaukee_Art_Museum_1_%28Mulad%29.jpg/1280px-Milwaukee_Art_Museum_1_%28Mulad%29.jpg",
            alt: "The Milwaukee Art Museum's Burke Brise Soleil wings open above the lakefront on a clear day",
            credit: "Photo: Michael Hicks (Mulad) / Wikimedia Commons",
            license: "CC BY 2.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Milwaukee_Art_Museum_1_(Mulad).jpg",
          },
        },
        {
          name: "Historic Third Ward",
          category: "Neighborhood",
          blurb:
            "Milwaukee's premier arts-and-dining district occupies a compact grid of restored 19th-century brick warehouse buildings south of the Milwaukee River. The Milwaukee Public Market, dozens of independent galleries, and the Broadway Theatre Center are all within easy walking distance of each other.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Historic_Third_Ward_in_Milwaukee_photographed_in_June_2024_%E2%80%943829.jpg/1280px-Historic_Third_Ward_in_Milwaukee_photographed_in_June_2024_%E2%80%943829.jpg",
            alt: "Brick warehouse streetscape of the Historic Third Ward in Milwaukee",
            credit: "Photo: SecretName101 / Wikimedia Commons",
            license: "CC BY 4.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Historic_Third_Ward_in_Milwaukee_photographed_in_June_2024_–3829.jpg",
          },
        },
        {
          name: "Bradford Beach",
          category: "Park",
          blurb:
            "Milwaukee's most beloved urban beach stretches along Lake Michigan just north of the Art Museum. Sand volleyball courts, lakefront bike trails, and the summer Bradford Beach Bash series make it a magnet from June through August. The adjacent Oak Leaf Trail connects cyclists north to the North Shore suburbs.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Bradford_Beach_July_2022_1.jpg/1280px-Bradford_Beach_July_2022_1.jpg",
            alt: "Bradford Beach on a summer day with Lake Michigan stretching to the horizon",
            credit: "Photo: Michael Barera / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Bradford_Beach_July_2022_1.jpg",
          },
        },
      ],
      more: [
        { name: "Milwaukee Public Market", category: "Shopping" },
        { name: "Fiserv Forum", category: "Attraction" },
        { name: "Lakefront Brewery", category: "Dining" },
        { name: "Transfer Pizzeria", category: "Dining" },
        { name: "Summerfest (World's Largest Music Festival)", category: "Event" },
        { name: "Oak Leaf Trail", category: "Recreation" },
        { name: "Discovery World", category: "Attraction" },
        { name: "Milwaukee Riverwalk", category: "Recreation" },
      ],
    },
  },

  west_allis: {
    lifestyle: {
      walkScore: { value: 60, label: "Somewhat Walkable" },
      commute: {
        carMinutes: "10-15 min",
        routes: ["I-894", "I-94", "US-45", "Greenfield Ave"],
        transitNote:
          "MCTS routes connect West Allis to downtown Milwaukee; Route 23 on Greenfield Ave runs frequently. No dedicated BRT, but bus connections are reliable for commuters without a car.",
      },
      safety: {
        grade: "D+",
        note:
          "Overall D+ on CrimeGrade (29th percentile for safety). Property crime is the primary driver, running above the national average. Residential streets away from the commercial corridors tend to be quieter.",
      },
      idealBuyer: {
        tags: ["First-time buyers", "Value seekers", "Tradespeople", "Young families"],
        summary:
          "Buyers who want affordable, solid post-war bungalows within 15 minutes of downtown Milwaukee — and who appreciate a blue-collar city with genuine community character, annual State Fair excitement, and a resurgent dining scene along Greenfield Avenue.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Wisconsin State Fair Park",
          category: "Attraction",
          blurb:
            "The 200-acre fairgrounds hosts the Wisconsin State Fair every August — one of the country's largest, drawing roughly 1 million visitors for cream puffs, live music, and the famous Cream Puff Pavilion. The grounds operate year-round as an event venue and trade show complex.",
        },
        {
          name: "The Milwaukee Mile",
          category: "Attraction",
          blurb:
            "The oldest major speedway in the world (opened 1903) sits inside the State Fair Park oval. The paved mile oval hosted IndyCar and NASCAR for over a century, and the grandstand and track remain active for regional racing events and special occasions.",
        },
        {
          name: "Greenfield Avenue Corridor",
          category: "Neighborhood",
          blurb:
            "West Allis's revitalized main commercial strip is lined with independent restaurants, craft beer bars, and neighborhood taverns. The weekly Saturday farmers market runs May through October, and the annual West Allis Farmers Market is one of the most attended in the metro area.",
        },
      ],
      more: [
        { name: "West Allis Cheese & Sausage Shoppe", category: "Shopping" },
        { name: "Café Corazón", category: "Dining" },
        { name: "Kegel's Inn", category: "Dining" },
        { name: "West Allis Farmers Market", category: "Event" },
        { name: "West Allis Memorial Park", category: "Recreation" },
        { name: "Oak Leaf Trail", category: "Recreation" },
      ],
    },
  },

  shorewood: {
    lifestyle: {
      walkScore: { value: 73, label: "Very Walkable" },
      commute: {
        carMinutes: "10-15 min",
        routes: ["Lake Dr", "Oakland Ave", "I-43"],
        transitNote:
          "MCTS Route 30 runs Oakland Ave directly into downtown Milwaukee every 10 minutes. Route 31 provides an alternative along Murray Ave. The compact village is also a designated Walk Friendly Community, making errands car-optional for most residents.",
      },
      safety: {
        grade: "D+",
        note:
          "Overall D+ on CrimeGrade (approximately 30th percentile). Property crime — typical of any dense urban-adjacent village — drives the composite; violent crime rates are considerably lower. The east portion of the village, closer to Lake Michigan, is consistently cited as the quietest.",
      },
      idealBuyer: {
        tags: ["UWM faculty & staff", "Walkability-first buyers", "Young professionals", "Empty nesters"],
        summary:
          "Buyers who prioritize a genuinely walkable, transit-rich village with outstanding schools, Lake Michigan access, and Oakland Avenue's independent coffee shops and dining — all within 10 minutes of downtown Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Oakland Avenue",
          category: "Neighborhood",
          blurb:
            "Shorewood's walkable main street is lined with independent coffee shops, a full-service grocery store, wine bars, and neighborhood restaurants, earning the village bronze-level Walk Friendly Community status. The street's human-scale streetscape and year-round energy make it the social heart of the North Shore.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Shorewood_Village_Hall_May09.jpg/1280px-Shorewood_Village_Hall_May09.jpg",
            alt: "Shorewood Village Hall on a clear spring day, surrounded by mature trees",
            credit: "Photo: Freekee / Wikimedia Commons",
            license: "Public Domain",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Shorewood_Village_Hall_May09.jpg",
          },
        },
        {
          name: "Atwater Park & Beach",
          category: "Park",
          blurb:
            "Shorewood's lakefront gem sits at the base of the bluff, offering a small sandy beach, picnic areas, and a staircase descent through wooded ravines. It anchors a chain of lakefront green space connecting to Whitefish Bay to the north and Milwaukee's East Side to the south.",
        },
        {
          name: "Hubbard Park",
          category: "Park",
          blurb:
            "A beloved 22-acre riverside park along the Milwaukee River, Hubbard Park hosts the beloved Beer Garden from May through October — one of the most popular outdoor venues on the North Shore. Tennis courts, a creek trail, and a covered shelter round out the amenities.",
        },
      ],
      more: [
        { name: "Collectivo Coffee (Oakland Ave)", category: "Dining" },
        { name: "Sendik's Food Market", category: "Shopping" },
        { name: "Shorewood Farmers Market", category: "Event" },
        { name: "Hubbard Park Beer Garden", category: "Dining" },
        { name: "Milwaukee River Greenway", category: "Recreation" },
        { name: "Oak Leaf Trail", category: "Recreation" },
      ],
    },
  },

  whitefish_bay: {
    lifestyle: {
      walkScore: { value: 48, label: "Car-Dependent" },
      commute: {
        carMinutes: "15-20 min",
        routes: ["Lake Dr", "Silver Spring Dr", "I-43"],
        transitNote:
          "MCTS Route 30 runs along Oakland Ave on the village's western edge and connects to downtown Milwaukee. Most residents commute by car via Lake Drive or I-43.",
      },
      safety: {
        grade: "B-",
        note:
          "Violent crime earns a B- on CrimeGrade (approximately 45th percentile nationally), running below the national average — one of the better safety profiles in Milwaukee County. The village's residential character and low density contribute to its reputation as one of the North Shore's safest communities.",
      },
      idealBuyer: {
        tags: ["Families with school-age children", "Move-up buyers", "Professionals", "Empty nesters"],
        summary:
          "Buyers seeking highly-rated suburban schools, safe residential streets, and the prestige of the North Shore — while staying within 20 minutes of downtown Milwaukee and steps from Silver Spring Drive's boutiques and restaurants.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Silver Spring Drive",
          category: "Neighborhood",
          blurb:
            "Whitefish Bay's compact commercial main street offers independent boutiques, coffee shops, and well-regarded restaurants within a few walkable blocks. It serves as the social hub for the village and the broader North Shore community.",
        },
        {
          name: "Klode Park",
          category: "Park",
          blurb:
            "A lakefront park perched above Lake Michigan on a wooded bluff, Klode Park offers sweeping water views, a small sandy beach accessible via a stairway path, and shaded picnic areas. It is one of the most scenic public green spaces on the entire North Shore.",
        },
        {
          name: "Whitefish Bay School District",
          category: "Attraction",
          blurb:
            "The Whitefish Bay School District is consistently ranked among Wisconsin's top-performing public school districts, with high test scores and strong extracurricular programs. It is one of the primary draws for families relocating to the North Shore.",
        },
      ],
      more: [
        { name: "Big Bay Park", category: "Recreation" },
        { name: "Cahill Park", category: "Recreation" },
        { name: "Sprecher Brewery (nearby)", category: "Dining" },
        { name: "North Shore Cinema", category: "Attraction" },
        { name: "Oak Leaf Trail", category: "Recreation" },
        { name: "Whitefish Bay Farmers Market", category: "Event" },
      ],
    },
  },

  bay_view: {
    lifestyle: {
      walkScore: { value: 73, label: "Very Walkable" },
      commute: {
        carMinutes: "10-15 min",
        routes: ["Kinnickinnic Ave (KK)", "Bay View Blvd", "I-794", "Hwy 32"],
        transitNote:
          "MCTS Route 15 runs KK Avenue with frequent service into downtown. Route 56 provides additional coverage. The neighborhood's flat, bikeable grid also makes cycling to the Third Ward and downtown a realistic option year-round.",
      },
      safety: {
        grade: "C",
        percentile: 41,
        note:
          "Overall C on CrimeGrade (41st percentile). Violent crime earns a B- (60th percentile), running below the national average. Property crime is the primary concern, consistent with a dense urban neighborhood. The eastern portion of Bay View, closest to South Shore Park, is consistently cited as the quietest.",
      },
      idealBuyer: {
        tags: ["Young creatives", "First-time buyers", "Cyclists", "Craft beer enthusiasts"],
        summary:
          "Buyers who want Milwaukee's most bohemian neighborhood — independent coffee shops, vinyl record stores, a thriving live music scene on KK Avenue, and South Shore Park's lakefront access — all closer to downtown than most people realize.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Kinnickinnic Avenue (KK Ave)",
          category: "Neighborhood",
          blurb:
            "Bay View's beloved main drag is one of Milwaukee's most eclectic commercial strips: vintage shops, craft cocktail bars, independent book and record stores, taquerias, and beloved coffee roasters all packed into a walkable stretch south of downtown. It's consistently named one of Milwaukee's top neighborhoods by local and national outlets alike.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Beulah_Brinton_House.jpg/1280px-Beulah_Brinton_House.jpg",
            alt: "The historic Beulah Brinton House in Bay View, Milwaukee, a Victorian-era landmark",
            credit: "Photo: Sulfur / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Beulah_Brinton_House.jpg",
          },
        },
        {
          name: "South Shore Park",
          category: "Park",
          blurb:
            "Bay View's signature lakefront park spans 55 acres and includes a sandy beach, the beloved South Shore Terrace Beer Garden (open May–September), a yacht club, and a network of paved paths. It is one of Milwaukee County's most-used parks and a cornerstone of Bay View's identity.",
        },
        {
          name: "Humboldt Park",
          category: "Park",
          blurb:
            "A 46-acre park at the western end of Bay View, Humboldt features a lagoon, walking paths, tennis courts, and a popular sledding hill in winter. The park's beer garden runs through summer and draws residents from across the south side.",
        },
      ],
      more: [
        { name: "Company Brewing", category: "Dining" },
        { name: "Vanguard", category: "Dining" },
        { name: "Fuel Café", category: "Dining" },
        { name: "South Shore Farmers Market", category: "Event" },
        { name: "Bay View Bash", category: "Event" },
        { name: "Oak Leaf Trail", category: "Recreation" },
        { name: "Chill on the Hill (Humboldt Park concerts)", category: "Event" },
      ],
    },
  },
};

export default batch;
