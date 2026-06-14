import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  delafield: {
    lifestyle: {
      walkScore: { value: 25, label: "Car-Dependent" },
      commute: {
        carMinutes: "30-35 min",
        routes: ["I-94", "US-18", "Hwy 83"],
      },
      safety: {
        grade: "B",
        note:
          "Overall B on CrimeGrade. Violent crime earns an A and property crime a B+. Safer than the Wisconsin state average and the national average. One of the lowest violent-crime rates in Waukesha County.",
      },
      idealBuyer: {
        tags: ["Affluent families", "Nature enthusiasts", "Executive relocators", "Empty nesters"],
        summary:
          "Buyers who want a prestigious Lake Country address, direct access to Lapham Peak and the Kettle Moraine State Forest, and a walkable historic downtown -- all at a price point that reflects one of Waukesha County's most sought-after zip codes.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Lapham Peak (Kettle Moraine State Forest)",
          category: "Park",
          blurb:
            "The highest point in Waukesha County at 1,233 feet, Lapham Peak offers premier hiking, mountain biking, cross-country skiing, and snowshoeing across its 1,160 acres. The 45-foot observation tower provides panoramic views of the Kettle Moraine landscape and sits directly adjacent to the Ice Age National Scenic Trail.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Gfp-wisconsin-lapham-peak-state-park-pond.jpg/1280px-Gfp-wisconsin-lapham-peak-state-park-pond.jpg",
            alt: "Tranquil pond surrounded by prairie grasses and woodland at Lapham Peak State Park in the Kettle Moraine, Wisconsin",
            credit: "Photo: goodfreephotos.com / Wikimedia Commons",
            license: "Public Domain",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Gfp-wisconsin-lapham-peak-state-park-pond.jpg",
          },
        },
        {
          name: "Downtown Delafield",
          category: "Neighborhood",
          blurb:
            "A compact, walkable main street lined with upscale boutiques, craft breweries, and restaurants, anchored by the historic 1846 Hawks Inn stagecoach stop. The Wisconsin Veterans Memorial Riverwalk -- a three-quarter-mile paved path along the Bark River with nine war memorial sites -- connects downtown to the water's edge.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Delafield_%281%29.jpg/1280px-Delafield_%281%29.jpg",
            alt: "Delafield City Hall building in Delafield, Wisconsin",
            credit: "Photo: Awkwafaba / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Delafield_(1).jpg",
          },
        },
        {
          name: "Nagawicka Lake",
          category: "Recreation",
          blurb:
            "One of the crown jewels of Waukesha County's Lake Country region, Nagawicka Lake sits at Delafield's doorstep with 975 acres of water for fishing, boating, and paddling. Shoreline properties here rank among the most coveted addresses in southeastern Wisconsin.",
        },
      ],
      more: [
        { name: "Hawks Inn Historic Site", category: "Attraction" },
        { name: "Delafield Brewhaus", category: "Dining" },
        { name: "Wisconsin Veterans Memorial Riverwalk", category: "Recreation" },
        { name: "Ice Age National Scenic Trail", category: "Recreation" },
        { name: "Delafield Fish Day", category: "Event" },
        { name: "Lake Country Recreation Trail", category: "Recreation" },
        { name: "Lois Jensen Nature Preserve", category: "Park" },
      ],
    },
  },

  hartland: {
    lifestyle: {
      walkScore: { value: 27, label: "Car-Dependent" },
      commute: {
        carMinutes: "30-35 min",
        routes: ["Hwy 16", "I-94", "Hwy 83"],
      },
      safety: {
        grade: "B+",
        note:
          "Overall B+ on CrimeGrade, with violent crime at B+ and property crime at B+. Safer than the Wisconsin state average and the national average. Consistent with Waukesha County's strong countywide safety profile.",
      },
      idealBuyer: {
        tags: ["Families", "Young professionals", "School-focused buyers", "Outdoor enthusiasts"],
        summary:
          "Buyers who want the Lake Country lifestyle at a more accessible price point than Delafield or Oconomowoc -- with Arrowhead High School as a standout anchor, a growing downtown dining scene, and the Lake Country Recreation Trail running right through the village.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Arrowhead Union High School",
          category: "Schools",
          blurb:
            "Consistently ranked among the top 15 public high schools in Wisconsin (Niche Grade A), Arrowhead Union High School is the defining community anchor for Hartland and its neighboring communities. The school serves students from the Arrowhead Union High School District and draws families from across Lake Country.",
        },
        {
          name: "Lake Country Recreation Trail",
          category: "Recreation",
          blurb:
            "A paved multi-use trail connecting Hartland to Delafield, Oconomowoc, and Wales across 25+ miles of former railroad corridor. The trail passes through the heart of the village along the Bark River corridor and links riders and runners to the broader Waukesha County trail network.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Lake_Country_Trail.jpg/1280px-Lake_Country_Trail.jpg",
            alt: "Paved Lake Country Recreation Trail passing through a wooded trailhead in Waukesha County, Wisconsin",
            credit: "Photo: CRussell4410 / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Lake_Country_Trail.jpg",
          },
        },
        {
          name: "Downtown Hartland (Cottonwood Avenue)",
          category: "Neighborhood",
          blurb:
            "Hartland's compact village center along Cottonwood Avenue has quietly become one of Lake Country's most pleasant walkable strips, with locally owned restaurants, cafes, and shops. The Bark River runs through the village, adding a scenic backdrop to an already intimate community feel.",
        },
      ],
      more: [
        { name: "Nixon Park", category: "Park" },
        { name: "Hartland Kids Day", category: "Event" },
        { name: "Hartland Hometown Celebration", category: "Event" },
        { name: "Bark River Trail Corridor", category: "Recreation" },
        { name: "Hartland-Lakeside Elementary", category: "Schools" },
        { name: "Lake Country dining corridor", category: "Dining" },
      ],
    },
  },

  mukwonago: {
    lifestyle: {
      walkScore: { value: 32, label: "Car-Dependent" },
      commute: {
        carMinutes: "35-40 min",
        routes: ["I-43", "Hwy 83", "Hwy 99"],
      },
      safety: {
        grade: "A",
        note:
          "Overall A on CrimeGrade, with violent crime at B+ and property crime at A. Safer than the Wisconsin state average and the national average. Among the strongest safety ratings of any Waukesha County village of comparable size.",
      },
      idealBuyer: {
        tags: ["Families seeking affordability", "Semi-rural lifestyle buyers", "First-time buyers", "Hobby farm seekers"],
        summary:
          "Buyers who want strong Waukesha County schools and safety at the county's most accessible price point -- with room for larger lots, hobby farms, and a genuine small-town atmosphere at the southern gateway to the county.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Mukwonago County Park",
          category: "Park",
          blurb:
            "A 355-acre Waukesha County park offering one of the most complete outdoor recreation packages in the region: swimming beach, hiking and mountain bike trails, camping, fishing, archery range, and winter sledding and cross-country skiing. It serves as the community's primary outdoor gathering place year-round.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mukwonago_Park_DSC_1517.jpg/1280px-Mukwonago_Park_DSC_1517.jpg",
            alt: "Open meadow and woodland edge inside Mukwonago Park, a Waukesha County recreational park in Wisconsin",
            credit: "Photo: malsch (Flickr) / Wikimedia Commons",
            license: "CC BY 2.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Mukwonago_Park_DSC_1517.jpg",
          },
        },
        {
          name: "Downtown Mukwonago",
          category: "Neighborhood",
          blurb:
            "The village's compact main corridor retains a genuine small-town character, with locally owned restaurants, taverns, and shops anchored by Field Park -- a 3,000-square-foot pavilion with a baseball diamond and oak-shaded walking path that hosts Maxwell Street Days and community events throughout summer.",
        },
        {
          name: "Mukwonago Area School District",
          category: "Schools",
          blurb:
            "Serving nearly 5,000 students and earning a Niche Grade of A (ranked #41 in Wisconsin), the Mukwonago Area School District is a primary draw for families relocating from higher-cost areas who want strong public schools without the premium price tag of communities to the north.",
        },
      ],
      more: [
        { name: "Field Park", category: "Park" },
        { name: "Maxwell Street Days", category: "Event" },
        { name: "Mukwonago Summerfeste", category: "Event" },
        { name: "Croatian Day Picnic", category: "Event" },
        { name: "Phantom Lake YMCA Camp", category: "Attraction" },
        { name: "Fox River headwaters access", category: "Recreation" },
      ],
    },
  },

  sussex: {
    lifestyle: {
      walkScore: { value: 22, label: "Car-Dependent" },
      commute: {
        carMinutes: "25-30 min",
        routes: ["Hwy 164", "I-41", "Hwy 74"],
      },
      safety: {
        grade: "A",
        note:
          "Overall A on CrimeGrade, with violent crime at A and property crime at A. Safer than the Wisconsin state average and the national average. One of the highest overall safety grades of any Waukesha County community.",
      },
      idealBuyer: {
        tags: ["Growing families", "Newer construction buyers", "Professionals commuting north", "Young couples"],
        summary:
          "Buyers who want modern, newer construction in a village that still feels intimate -- with the Hamilton School District, state-of-the-art recreational facilities, and one of the best commute positions in the county for workers heading to the I-41 corridor and Menomonee Falls employers.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Grove at Village Park",
          category: "Park",
          blurb:
            "Sussex's signature 75-acre regional park offers one of the most comprehensive community recreation campuses in Waukesha County: a disc golf course, inclusive splash pad, accessible playground, multi-sport courts, and a large pavilion. The park anchors community life and draws residents from across the surrounding area.",
        },
        {
          name: "Bugline Recreation Trail",
          category: "Recreation",
          blurb:
            "A 14-mile paved rail trail connecting Sussex southwest through Menomonee Falls and into the broader Waukesha County trail network. The trail passes through residential neighborhoods and natural corridors, providing a key non-motorized commuter and recreation link for the entire village.",
        },
        {
          name: "Hamilton School District",
          category: "Schools",
          blurb:
            "Ranked #17 in Wisconsin with a Niche Grade of A, the Hamilton School District is the primary reason young families choose Sussex. Serving more than 5,100 students across Sussex and surrounding areas, it consistently outperforms state averages in academic achievement.",
        },
      ],
      more: [
        { name: "Sussex Lions Daze", category: "Event" },
        { name: "Sussex Village Park", category: "Park" },
        { name: "North Shore Bank branch", category: "Services" },
        { name: "Main Street commercial corridor", category: "Dining" },
        { name: "Menomonee Falls proximity", category: "Attraction" },
        { name: "St. Aloysius Parish", category: "Community" },
      ],
    },
  },

  elm_grove: {
    lifestyle: {
      walkScore: { value: 35, label: "Car-Dependent" },
      commute: {
        carMinutes: "15-20 min",
        routes: ["Bluemound Rd", "I-94", "Hwy 18"],
        transitNote:
          "MCTS Route 10 (Bluemound Road) provides bus service toward downtown Milwaukee. Among the closest Waukesha County communities to the city, making it viable for some transit-connected commuters.",
      },
      safety: {
        grade: "A-",
        note:
          "Very safe in absolute terms. The village recorded zero violent crimes in the latest reporting year, and total crime runs roughly 76% below the national average and well below the Wisconsin average (City-Data / FBI UCR). Per-resident 'curve' ratings score Elm Grove lower only because its small residential population is measured against theft reports from the Bluemound Road retail corridor, but the actual incident counts are very low (about 31 property crimes in a year, down 61%).",
      },
      idealBuyer: {
        tags: ["Affluent families", "Milwaukee professionals", "Elmbrook schools seekers", "Empty nesters"],
        summary:
          "Buyers who want the closest thing to a true village lifestyle in Waukesha County -- tree-lined streets, a central park that everyone shares, and the #1-ranked Elmbrook School District -- within 15 minutes of downtown Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Village Park",
          category: "Park",
          blurb:
            "The social and recreational center of Elm Grove, Village Park spans 78 acres with two spring-fed ponds, woodland walking trails, a community swimming pool, tennis courts, basketball courts, and playgrounds. The park hosts Fourth of July fireworks and serves as the gathering point for nearly every community event throughout the year.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Veteran%E2%80%99s_Park_in_Elm_Grove_02.jpg/1280px-Veteran%E2%80%99s_Park_in_Elm_Grove_02.jpg",
            alt: "Tree-lined open green space at Veteran's Park in Elm Grove, Wisconsin on a clear day",
            credit: "Photo: Awkwafaba / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Veteran%27s_Park_in_Elm_Grove_02.jpg",
          },
        },
        {
          name: "Elmbrook School District",
          category: "Schools",
          blurb:
            "Ranked #1 in Waukesha County and among the top five school districts in Wisconsin with a Niche Grade of A+, Elmbrook serves Elm Grove and Brookfield students. The district's reputation is the single strongest driver of Elm Grove's real estate premium and draws buyers from across the Milwaukee metropolitan area.",
        },
        {
          name: "Downtown Elm Grove (Watertown Plank Road)",
          category: "Neighborhood",
          blurb:
            "Elm Grove's intimate commercial strip along Watertown Plank Road features locally owned shops, a deli, salons, and neighborhood restaurants within walking distance of Village Park. The village's compact scale means nearly every resident passes through the same few blocks regularly -- creating the small-town familiarity that defines the community's character.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Downtown_Elm_Grove%2C_Wisconsin.jpg/1280px-Downtown_Elm_Grove%2C_Wisconsin.jpg",
            alt: "Downtown Elm Grove, Wisconsin, looking east along Watertown Plank Road on a clear day",
            credit: "Photo: Wikimedia Commons contributor / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Downtown_Elm_Grove,_Wisconsin.jpg",
          },
        },
      ],
      more: [
        { name: "Elm Grove Library", category: "Community" },
        { name: "Fourth of July Fireworks at Village Park", category: "Event" },
        { name: "Community Pool", category: "Recreation" },
        { name: "Brookfield Square proximity", category: "Shopping" },
        { name: "Bluemound Road dining corridor", category: "Dining" },
        { name: "Elm Grove Historical Society", category: "Attraction" },
      ],
    },
  },
};

export default batch;
