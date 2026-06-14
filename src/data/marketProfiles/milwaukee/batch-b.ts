import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  glendale: {
    lifestyle: {
      walkScore: { value: 22, label: "Car-Dependent" },
      commute: {
        carMinutes: "10-15 min",
        routes: ["I-43", "Port Washington Rd (US-141)", "Green Bay Ave"],
        transitNote:
          "MCTS Route 57 (Port Washington Rd) connects Glendale to downtown Milwaukee. Park-and-ride lots available near I-43.",
      },
      safety: {
        grade: "D+",
        note:
          "Violent crime is low, but property crime runs well above the national average, driven largely by Bayshore Town Center, a regional mall in a city of about 13,000. Residential safety is solid; the elevated rate reflects retail theft concentrated at the mall (AreaVibes / City-Data).",
      },
      idealBuyer: {
        tags: ["Move-up families", "Nature lovers", "Urban-access seekers"],
        summary:
          "Buyers who want quick I-43 access to downtown Milwaukee, a walkable town center at Bayshore, and Milwaukee River parkland in their backyard — without paying city prices.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Bayshore",
          category: "Shopping & Entertainment",
          blurb:
            "A 47-acre open-air mixed-use district converted from a 1950s enclosed mall. Home to 1.1 million sq ft of retail, restaurants, offices, and 400+ residential units centered on a lively public plaza that hosts concerts, markets, and seasonal events.",
        },
        {
          name: "Kletzsch Park",
          category: "Park",
          blurb:
            "A 141-acre Milwaukee County park straddling the Milwaukee River. Features include the Oak Leaf Trail, a disc golf course, disc-golf, sandvolleyball, an archery range, a historic CCC-built dam, and a renowned birding hotspot with 164 recorded species. A fish passage completed in 2023 restored native fish migration for the first time since the 1930s.",
        },
        {
          name: "Milwaukee River Parkway",
          category: "Recreation",
          blurb:
            "The paved Oak Leaf Trail runs through Glendale along the Milwaukee River, linking Kletzsch Park northward into Ozaukee County and south toward the lakefront — a continuous greenway for cyclists, runners, and kayakers.",
        },
      ],
      more: [
        { name: "Glendale Public Library", category: "Civic" },
        { name: "North Shore Cinema", category: "Entertainment" },
        { name: "Oak Leaf Trail", category: "Recreation" },
        { name: "Silver Spring Drive dining corridor", category: "Dining" },
        { name: "River Glen Mountain Bike Trail", category: "Recreation" },
        { name: "Glendale Farmer's Market", category: "Event" },
      ],
    },
  },

  greenfield: {
    lifestyle: {
      walkScore: { value: 40, label: "Car-Dependent" },
      commute: {
        carMinutes: "10-15 min",
        routes: ["I-894", "Hwy 894/43", "S 27th St", "Loomis Rd"],
        transitNote:
          "MCTS provides service along 27th Street and Layton Avenue connecting to downtown Milwaukee.",
      },
      safety: {
        grade: "D",
        note:
          "Overall D on CrimeGrade (23rd percentile). Violent crime earns a B+ — well below national average. Property crime, particularly theft, drives the composite grade down.",
      },
      idealBuyer: {
        tags: ["Value-seekers", "First-time buyers", "Commuters", "Renters converting to owners"],
        summary:
          "Buyers who want an affordable south-side suburb with solid interstate access, an urban-suburban feel, and more square footage per dollar than the city — without sacrificing proximity to downtown Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Greenfield Park",
          category: "Park",
          blurb:
            "A Milwaukee County park of over 265 acres anchoring the northwest edge of Greenfield. Offers a lake, boat launch, ice skating, picnic shelters, and the western trailhead of the Root River Parkway trail system connecting south through Greendale and Franklin.",
        },
        {
          name: "South 27th Street Corridor",
          category: "Dining & Shopping",
          blurb:
            "Greenfield's primary commercial spine — a dense strip of independently owned restaurants representing Milwaukee's South Side ethnic diversity, alongside big-box retail, grocery anchors, and neighborhood services within a few miles of most residential streets.",
        },
        {
          name: "Konkel Park",
          category: "Park",
          blurb:
            "Greenfield's flagship municipal park with a recreation center, ice arena, outdoor pool, baseball diamonds, and tennis courts. The adjacent Greenfield Public Library sits on the same campus, making it the civic heart of the city.",
        },
      ],
      more: [
        { name: "Root River Parkway Trail", category: "Recreation" },
        { name: "Layton Avenue dining corridor", category: "Dining" },
        { name: "Southridge Mall area", category: "Shopping" },
        { name: "Oak Leaf Trail connection", category: "Recreation" },
        { name: "Greenfield Farmers Market", category: "Event" },
        { name: "Greenfield Ice Arena", category: "Recreation" },
      ],
    },
  },

  greendale: {
    lifestyle: {
      walkScore: { value: 44, label: "Car-Dependent" },
      commute: {
        carMinutes: "15-20 min",
        routes: ["I-894", "Loomis Rd", "Hwy 894/43"],
        transitNote:
          "MCTS connects Greendale to downtown Milwaukee via Loomis Road. The village's compact layout makes it walkable within its own boundaries.",
      },
      safety: {
        grade: "C+",
        note:
          "Excellent violent-crime safety, roughly 59% below the national rate and among the lowest in the metro (City-Data / AreaVibes). Southridge Mall, in a village of about 14,000, inflates the per-capita property-crime rate, but violent crime is very low.",
      },
      idealBuyer: {
        tags: ["History buffs", "Walkable-village seekers", "Nature lovers", "Families"],
        summary:
          "Buyers drawn to a one-of-a-kind New Deal planned village — pedestrian-scale streets, mature tree canopy, a real walkable downtown, and immediate access to 600+ acres of Root River greenway — all 13 miles from downtown Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Greendale Historic Village Center",
          category: "Neighborhood",
          blurb:
            "One of only three federally built New Deal 'Greenbelt' communities in America (1936–38). The original downtown on Broad Street retains its pedestrian-scale character: curving streets, communal greens, stone carvings by sculptor Alonzo Hauser, and locally owned shops and restaurants — all on the National Register of Historic Places.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Greendale_Originals_-_Winter.jpg/1280px-Greendale_Originals_-_Winter.jpg",
            alt: "Winter street scene in the historic Greendale village center showing the planned New Deal community architecture",
            credit: "Photo: Mzalewski8803 / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Greendale_Originals_-_Winter.jpg",
          },
        },
        {
          name: "Root River Parkway & Whitnall Park",
          category: "Park",
          blurb:
            "Milwaukee County's largest park system — over 600 connected acres running through Greendale's western edge. Includes the Boerner Botanical Gardens and Arboretum, miles of hiking and biking trails, the Whitnall Golf Course, and some of the largest old-growth hardwoods in the county system.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Boerner_Botanical_Gardens.jpg/1280px-Boerner_Botanical_Gardens.jpg",
            alt: "Formal garden beds and stone pathway at the Boerner Botanical Gardens in Whitnall Park, Greendale, Wisconsin",
            credit: "Photo: James Steakley / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Boerner_Botanical_Gardens.jpg",
          },
        },
        {
          name: "Greendale Farmers Market",
          category: "Event",
          blurb:
            "A Saturday morning market held in the historic village center on Broad Street. Features local produce, artisan foods, and crafts in an outdoor setting that draws the whole community and reinforces Greendale's small-town feel.",
        },
      ],
      more: [
        { name: "Boerner Botanical Gardens", category: "Attraction" },
        { name: "Oak Leaf Trail", category: "Recreation" },
        { name: "Whitnall Golf Course", category: "Recreation" },
        { name: "Greendale Public Library", category: "Civic" },
        { name: "Greendale Village Hall (historic)", category: "Landmark" },
        { name: "Mangan Woods old-growth forest", category: "Nature" },
      ],
    },
  },

  franklin: {
    lifestyle: {
      walkScore: { value: 17, label: "Car-Dependent" },
      commute: {
        carMinutes: "20-30 min",
        routes: ["I-894", "Hwy 894/43", "S 27th St", "S 51st St"],
        transitNote:
          "Limited MCTS coverage. Franklin is primarily a drive-to community; most residents commute by car via I-894 or surface arterials.",
      },
      safety: {
        grade: "B-",
        percentile: 56,
        note:
          "Overall B- on CrimeGrade (56th percentile) — safer than the majority of US cities. One of the safer communities in Milwaukee County with crime rates running below the national average.",
      },
      idealBuyer: {
        tags: ["Families", "Sports enthusiasts", "Space seekers", "Safety-focused buyers"],
        summary:
          "Buyers who prioritize safety, newer construction, highly rated schools, and spacious lots — and who don't mind a car-dependent lifestyle in exchange for a quieter, lower-density suburb with a growing entertainment anchor at Ballpark Commons.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Ballpark Commons / The Rock Sports Complex",
          category: "Sports & Entertainment",
          blurb:
            "A $130 million mixed-use sports and entertainment district anchored by The Rock Sports Complex — six major-league-replica baseball fields hosting 2,000 games and 125,000+ visitors annually — and Franklin Field, home of the Milwaukee Milkmen (American Association). The campus includes the MOSH Performance Center, dining, an Umbrella Bar, and residential components.",
        },
        {
          name: "Root River Parkway (South)",
          category: "Park",
          blurb:
            "The southern reach of Milwaukee County's Root River greenway corridor passes through Franklin, connecting Mangan Woods old-growth forest to Whitnall Park to the north. Offers trails for hiking, biking, and nature observation through wooded river bottomland.",
        },
        {
          name: "Northwestern Mutual Campus",
          category: "Employment",
          blurb:
            "Northwestern Mutual's Franklin campus is one of the largest employment anchors in the south Milwaukee suburbs, bringing professional-class jobs and supporting the surrounding retail and restaurant ecosystem.",
        },
      ],
      more: [
        { name: "Franklin Public Library", category: "Civic" },
        { name: "Franklin High School athletic complex", category: "Recreation" },
        { name: "Mangan Woods Nature Area", category: "Nature" },
        { name: "Oak Leaf Trail connection", category: "Recreation" },
        { name: "Franklin Farmers Market", category: "Event" },
        { name: "Ryan Road retail corridor", category: "Shopping" },
      ],
    },
  },

  oak_creek: {
    lifestyle: {
      walkScore: { value: 22, label: "Car-Dependent" },
      commute: {
        carMinutes: "15-20 min",
        routes: ["I-94", "I-41", "Howell Ave", "Ryan Rd"],
        transitNote:
          "MCTS Route 15 connects Oak Creek to downtown Milwaukee in approximately 35 minutes. Wisconsin Coach Lines offers commuter service north to downtown with stops at Oak Creek park-and-ride lots near I-41/I-94.",
      },
      safety: {
        grade: "C+",
        percentile: 49,
        note:
          "Overall C+ on CrimeGrade (49th percentile). Violent crime earns a B+ (71st percentile), running well below the national average. Property crime is near average.",
      },
      idealBuyer: {
        tags: ["Families", "Airport-area workers", "Move-up buyers", "New-construction seekers"],
        summary:
          "Buyers who want a newer-construction suburb with a genuine town center at Drexel Town Square, easy I-94 access to downtown Milwaukee and Mitchell Airport, and a safer-than-average community at a lower price point than the North Shore.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Drexel Town Square",
          category: "Town Center",
          blurb:
            "Oak Creek's purpose-built downtown on the former 85-acre Delphi industrial site — the city's first real Main Street. Centered on a civic square with a 60-foot clock-tower City Hall and public library, it offers restaurants (Water Street Brewery, BelAir Cantina, Pizza Man), retail, a 17-acre wetland park, and a farmers market and seasonal events.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/20111120_33_Oak_Creek%2C_Wisconsin_%286399487135%29.jpg/1280px-20111120_33_Oak_Creek%2C_Wisconsin_%286399487135%29.jpg",
            alt: "Residential street in Oak Creek, Wisconsin with mature trees lining the road on a winter day",
            credit: "Photo: david_shankbone / Wikimedia Commons (CC BY 2.0)",
            license: "CC BY 2.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:20111120_33_Oak_Creek,_Wisconsin_(6399487135).jpg",
          },
        },
        {
          name: "Drexel Town Square Wetland Park",
          category: "Park",
          blurb:
            "A 17-acre restored wetland and upland natural area integrated into the heart of Drexel Town Square. Features restored prairies, deciduous hardwood forest, and boardwalk trails — an unusual green amenity within walking distance of the city's civic and retail core.",
        },
        {
          name: "Mitchell International Airport Corridor",
          category: "Convenience",
          blurb:
            "Oak Creek sits immediately south of Milwaukee Mitchell International Airport along I-94/I-41, giving residents unmatched access for frequent travelers — typically 10 minutes to the terminal — while flight paths remain north of most residential neighborhoods.",
        },
      ],
      more: [
        { name: "Oak Creek Farmers Market", category: "Event" },
        { name: "Meijer (Drexel Town Square)", category: "Shopping" },
        { name: "Ryan Road retail corridor", category: "Shopping" },
        { name: "Oak Creek Parkway trails", category: "Recreation" },
        { name: "Oak Creek Public Library", category: "Civic" },
        { name: "Wisconsin Coach Lines park-and-ride", category: "Transit" },
      ],
    },
  },
};

export default batch;
