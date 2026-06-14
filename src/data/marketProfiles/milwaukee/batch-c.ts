import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  south_milwaukee: {
    lifestyle: {
      walkScore: { value: 45, label: "Car-Dependent" },
      commute: {
        carMinutes: "20-25 min",
        routes: ["I-794", "WIS-32", "Lake Shore Dr"],
        transitNote:
          "MCTS bus routes connect South Milwaukee to downtown along Kinnickinnic Avenue and Lake Shore Drive. The South Milwaukee Metra/commuter rail station on 15th Avenue provides an additional option for downtown trips.",
      },
      safety: {
        grade: "C-",
        note:
          "Overall C- on CrimeGrade (54th percentile for safety). Violent crime runs below the national average; property crime pulls the composite lower. The southwest side of the city is generally considered the safest area.",
      },
      idealBuyer: {
        tags: ["Value-focused families", "Outdoor enthusiasts", "First-time buyers", "Lake Michigan lovers"],
        summary:
          "Buyers who want genuine lakefront access, old-growth ravine trails at Grant Park, and a walkable downtown with local character — all at price points well below the inner-ring suburbs.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Grant Park & Seven Bridges Trail",
          category: "Park",
          blurb:
            "Milwaukee County's oldest park at nearly 400 acres along Lake Michigan, established in 1910. The signature Seven Bridges Trail is a 2-mile loop through glacial ravines — lannon-stone staircases, a covered Bavarian-style bridge, and a man-made waterfall built by WPA crews in the 1930s. Named one of Wisconsin's best fall hikes by Midwest Living.",
        },
        {
          name: "South Milwaukee Performing Arts Center",
          category: "Arts",
          blurb:
            "A professionally managed, 786-seat regional theatre founded in 2004 and housed in the South Milwaukee High School complex. The venue presents a full Performing Arts Series with national touring acts — past performers include the Milwaukee Symphony Orchestra, Tommy Emmanuel, and the BoDeans — alongside youth theatre and a free summer outdoor concert series.",
        },
        {
          name: "South Milwaukee Downtown",
          category: "Neighborhood",
          blurb:
            "A traditional, pedestrian-scale main street along Chicago Avenue with more than 100 independent businesses. A weekly downtown market runs during summer months, anchored by local restaurants, retail, and Franciscan Villa programming.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/South_Milwaukee_May_2026_1_%28Parkway_Floral%29.jpg/1280px-South_Milwaukee_May_2026_1_%28Parkway_Floral%29.jpg",
            alt: "Parkway Floral storefront on a sunny day in downtown South Milwaukee, Wisconsin",
            credit: "Photo: Michael Barera / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:South_Milwaukee_May_2026_1_(Parkway_Floral).jpg",
          },
        },
      ],
      more: [
        { name: "Oak Leaf Trail", category: "Recreation" },
        { name: "South Milwaukee Beach", category: "Recreation" },
        { name: "Grant Park Golf Course", category: "Recreation" },
        { name: "South Milwaukee Farmers Market", category: "Event" },
        { name: "Franciscan Villa", category: "Community" },
        { name: "South Milwaukee Public Library", category: "Community" },
      ],
    },
  },

  st_francis: {
    lifestyle: {
      walkScore: { value: 50, label: "Somewhat Walkable" },
      commute: {
        carMinutes: "10-15 min",
        routes: ["I-794", "WIS-32 (Kinnickinnic Ave)", "Lake Shore Dr"],
        transitNote:
          "MCTS bus routes run along Kinnickinnic Avenue (KK), connecting St. Francis to Bay View and downtown Milwaukee. The 6-mile drive north on I-794 is one of the shortest suburb-to-downtown commutes in Milwaukee County.",
      },
      safety: {
        grade: "D+",
        note:
          "Overall D+ on CrimeGrade (30th percentile for safety). Crime rates run modestly above the national average. Residents consider the northwest part of the city the safest. The low population density and tight-knit residential fabric keep actual incident counts low.",
      },
      idealBuyer: {
        tags: ["Value buyers", "Young professionals", "Retirees", "Lake Michigan seekers"],
        summary:
          "Buyers who want a quiet, densely residential suburb with a genuinely short commute to downtown Milwaukee, Lake Michigan access, and home prices meaningfully below the city average — without sacrificing urban proximity.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Nojoshing Trail",
          category: "Recreation",
          blurb:
            "A lakefront multi-use trail running through St. Francis along Lake Michigan, connecting to the Oak Leaf Trail system and the broader Milwaukee County trail network. The path offers open water views and passes through the city's lakeside parks.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/St._Francis_July_2025_2_%28Nojoshing_Trail%29.jpg/1280px-St._Francis_July_2025_2_%28Nojoshing_Trail%29.jpg",
            alt: "Nojoshing Trail path along Lake Michigan in St. Francis, Wisconsin on a summer day",
            credit: "Photo: Michael Barera / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:St._Francis_July_2025_2_(Nojoshing_Trail).jpg",
          },
        },
        {
          name: "Saint Francis Seminary",
          category: "Landmark",
          blurb:
            "A historic Catholic seminary campus founded in 1856, with landmark Romanesque revival buildings set on a bluff overlooking Lake Michigan. The campus grounds are among the most architecturally significant in Milwaukee County.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/St_Francis_Seminary.jpg/1280px-St_Francis_Seminary.jpg",
            alt: "Saint Francis Seminary historic building in St. Francis, Wisconsin",
            credit: "Photo: Sulfur / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:St_Francis_Seminary.jpg",
          },
        },
      ],
      more: [
        { name: "Oak Leaf Trail", category: "Recreation" },
        { name: "South Shore Park", category: "Park" },
        { name: "Kinnickinnic Avenue dining", category: "Dining" },
        { name: "South Shore Yacht Club", category: "Recreation" },
        { name: "St. Francis Public Library", category: "Community" },
      ],
    },
  },

  brown_deer: {
    lifestyle: {
      walkScore: { value: 40, label: "Car-Dependent" },
      commute: {
        carMinutes: "20-25 min",
        routes: ["I-43", "US-45", "WIS-100 (Brown Deer Rd)"],
        transitNote:
          "MCTS bus routes operate along Brown Deer Road. A Park & Ride lot at I-43 / Brown Deer Road (exit 82B) provides express bus access to downtown Milwaukee.",
      },
      safety: {
        grade: "B-",
        note:
          "Overall B- on CrimeGrade, placing Brown Deer above average for safety among comparable Wisconsin communities. Violent and property crime rates track below the national average.",
      },
      idealBuyer: {
        tags: ["Families", "Move-up buyers", "Golf enthusiasts", "Nature lovers"],
        summary:
          "Buyers who want a safe, family-oriented suburb with strong park access, a nationally recognized public golf course, and affordable prices relative to the North Shore — all within a 20-minute freeway commute to downtown Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Brown Deer Park",
          category: "Park",
          blurb:
            "A 363-acre Milwaukee County park offering birding, cycling, fishing, hiking, picnicking, sand volleyball, soccer fields, a children's play area, and a boathouse with a perennial pollinator garden. The park anchors the village's outdoor recreation identity.",
        },
        {
          name: "Brown Deer Park Golf Course",
          category: "Recreation",
          blurb:
            "An 18-hole public course designed in 1929 and cited by Golf Digest as one of the best regulation public courses in the country. The course has hosted multiple national tournaments, including the A.S. Links Championship, and includes a driving range and full clubhouse.",
        },
        {
          name: "Brown Deer Village",
          category: "Neighborhood",
          blurb:
            "A compact village center behind Brown Deer Village Hall, anchored by the Brown Deer Pond, the historic Little White School House, Beaver Creek, and the Brown Deer Recreational Trail — all within walking distance of Village Park.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Browndeer-hs1.jpg/1280px-Browndeer-hs1.jpg",
            alt: "Brown Deer High School building in Brown Deer, Wisconsin",
            credit: "Photo: Bdhs-image / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Browndeer-hs1.jpg",
          },
        },
      ],
      more: [
        { name: "Oak Leaf Trail", category: "Recreation" },
        { name: "Brown Deer Recreational Trail", category: "Recreation" },
        { name: "Brown Deer Pond", category: "Park" },
        { name: "Brown Deer Public Library", category: "Community" },
        { name: "Northridge area shopping", category: "Shopping" },
      ],
    },
  },

  river_hills: {
    lifestyle: {
      walkScore: { value: 8, label: "Car-Dependent" },
      commute: {
        carMinutes: "15-20 min",
        routes: ["I-43", "WIS-100", "WIS-32 (N. Port Washington Rd)"],
      },
      safety: {
        grade: "A+",
        percentile: 98,
        note:
          "A+ on CrimeGrade (98th percentile for safety nationally). River Hills has one of the lowest crime rates in Milwaukee County, consistent with its exclusively residential, estate-lot character.",
      },
      idealBuyer: {
        tags: ["Executive buyers", "Privacy seekers", "Equestrian owners", "Top-school families"],
        summary:
          "Buyers seeking a private estate setting — minimum five-acre lots, dense woodland, and complete separation from commercial density — while remaining 15 minutes from downtown Milwaukee via I-43. Home to Milwaukee Country Club and University School of Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Milwaukee Country Club",
          category: "Recreation",
          blurb:
            "One of the most exclusive private golf and tennis clubs in the Midwest, located within the village boundaries. Membership is by invitation only and anchors River Hills' identity as an estate community.",
        },
        {
          name: "University School of Milwaukee",
          category: "Education",
          blurb:
            "A top-rated independent college-preparatory school serving students from early childhood through grade 12. USM's River Hills campus sits on wooded acreage and draws families from across the North Shore.",
        },
      ],
      more: [
        { name: "Brown Deer Park (adjacent)", category: "Park" },
        { name: "Oak Leaf Trail (nearby)", category: "Recreation" },
        { name: "Schlitz Audubon Nature Center (nearby)", category: "Nature" },
        { name: "Private riding trails", category: "Recreation" },
      ],
    },
  },

  fox_point: {
    lifestyle: {
      walkScore: { value: 32, label: "Car-Dependent" },
      commute: {
        carMinutes: "20-25 min",
        routes: ["I-43", "N. Port Washington Rd", "Lake Shore Dr"],
        transitNote:
          "MCTS Route 68 (Port Washington – Capitol) connects Fox Point to downtown Milwaukee along Port Washington Road.",
      },
      safety: {
        grade: "B",
        note:
          "Crime rates in Fox Point run approximately 36% below the Wisconsin state average (AreaVibes). The village's low density and exclusively residential character contribute to one of the safer profiles on the North Shore.",
      },
      idealBuyer: {
        tags: ["North Shore families", "Lakefront lifestyle buyers", "Nature enthusiasts", "Top-school seekers"],
        summary:
          "Buyers who want the prestige of the North Shore — spacious tree-lined lots, Lake Michigan bluff access at Doctors Park, and highly rated schools — at a more attainable price point than neighboring Bayside or Whitefish Bay.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Doctors Park",
          category: "Park",
          blurb:
            "A 55-acre Lake Michigan bluff park willed to the public in 1927 by ophthalmologist Dr. Joseph Schneider. The park features a secluded pebble beach, WPA-era stone jetties and staircases (built 1939–40), and a ravine hiking trail descending to the shoreline — all free of charge.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Foxpnt-0904-sign.jpg/1280px-Foxpnt-0904-sign.jpg",
            alt: "Village of Fox Point entry sign on Lake Drive, looking north toward the lakefront",
            credit: "Photo: Freekee / Wikimedia Commons",
            license: "Public domain",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Foxpnt-0904-sign.jpg",
          },
        },
        {
          name: "Schlitz Audubon Nature Center",
          category: "Nature",
          blurb:
            "A 185-acre sanctuary bordering Fox Point to the north, with 6 miles of trails through forest, prairie, ponds, and Lake Michigan shoreline. A 60-foot observation tower offers panoramic views of the lake, and the visitor center houses an art gallery and interactive nature exhibits.",
        },
        {
          name: "North Shore Commercial Corridor",
          category: "Neighborhood",
          blurb:
            "Fox Point residents enjoy quick access to the North Shore's boutique dining and retail strip along Port Washington Road and Brown Deer Road, plus easy reach of Bayshore Town Center for larger shopping needs.",
        },
      ],
      more: [
        { name: "Oak Leaf Trail", category: "Recreation" },
        { name: "Milwaukee River Greenway", category: "Recreation" },
        { name: "Bayside / Fox Point Library", category: "Community" },
        { name: "North Shore Country Club", category: "Recreation" },
        { name: "Lake Michigan beach access", category: "Recreation" },
      ],
    },
  },
};

export default batch;
