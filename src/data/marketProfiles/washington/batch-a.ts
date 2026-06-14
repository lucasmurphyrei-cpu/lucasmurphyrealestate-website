import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  germantown: {
    lifestyle: {
      walkScore: { value: 28, label: "Car-Dependent" },
      commute: {
        carMinutes: "25-30 min",
        routes: ["US-45", "Hwy 145 / Fond du Lac Ave"],
        transitNote:
          "No direct commuter transit to Milwaukee. US-45 is the primary expressway corridor south to the metro.",
      },
      safety: {
        grade: "B",
        percentile: 69,
        note:
          "B overall on CrimeGrade (69th percentile for safety). Crime rate of roughly 18 per 1,000 residents — below the national average. Safer than the Wisconsin state average.",
      },
      idealBuyer: {
        tags: ["Families", "First-time buyers", "Commuters", "History enthusiasts"],
        summary:
          "Buyers who want a quiet suburban village with good schools and a short expressway hop to Milwaukee — and appreciate the unexpected charm of a 5,000-bell museum and 1850s heritage settlement in their backyard.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Dheinsville Historic Park & Bast Bell Museum",
          category: "Attraction",
          blurb:
            "A nine-acre 1850s settlement preserved intact off Hwy 145. The Sila Lydia Bast Bell Museum displays more than 5,000 bells from around the world in a restored 1870 barn, while the Christ Church Museum — listed on the National Register of Historic Places — and the Valentine Wolf Haus round out the living-history campus.",
        },
        {
          name: "Germantown Park",
          category: "Park",
          blurb:
            "The village's central recreational hub with athletic fields, picnic areas, playgrounds, and access to the paved trail system that runs through Germantown's green corridors.",
        },
        {
          name: "Hwy 145 Retail Corridor",
          category: "Shopping",
          blurb:
            "A concentrated strip of national and regional retailers, grocers, and restaurants along Fond du Lac Avenue / Hwy 145 gives Germantown everyday convenience without the congestion of a large commercial center.",
        },
      ],
      more: [
        { name: "Germantown Historical Society", category: "Culture" },
        { name: "Mequon-Germantown Trail", category: "Recreation" },
        { name: "Washington County Fair Park", category: "Event" },
        { name: "Cedar Creek Watershed", category: "Nature" },
        { name: "Germantown Public Library", category: "Community" },
      ],
    },
  },

  west_bend: {
    lifestyle: {
      walkScore: { value: 42, label: "Car-Dependent" },
      commute: {
        carMinutes: "40-45 min",
        routes: ["US-45"],
        transitNote:
          "No commuter rail. US-45 is the direct expressway link south to Milwaukee. County bus service (Washington County Transit) operates limited routes.",
      },
      safety: {
        grade: "B",
        percentile: 69,
        note:
          "B overall on CrimeGrade (69th percentile for safety). Violent crime earns an A- (82nd percentile), running well below the national average. Burglary rate is A+ (95th percentile).",
      },
      idealBuyer: {
        tags: ["Move-up families", "Empty nesters", "Arts & culture seekers", "Outdoor enthusiasts"],
        summary:
          "Buyers who want a genuine small-city lifestyle — walkable downtown, a nationally recognized art museum on the river, miles of trails, and strong schools — without paying metro prices, accepting a 40-minute expressway commute.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Museum of Wisconsin Art (MOWA)",
          category: "Culture",
          blurb:
            "One of the top regional art museums in the country, housed in a striking 32,000-sq-ft wedge building on the east bank of the Milwaukee River. MOWA showcases Wisconsin artists from the 1850s to today and anchors West Bend's downtown cultural scene.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Aerial_view_of_downtown_West_Bend_Wisconsin.jpg/1280px-Aerial_view_of_downtown_West_Bend_Wisconsin.jpg",
            alt: "Aerial view of downtown West Bend, Wisconsin, showing the Milwaukee River corridor and city center",
            credit: "Photo: Mjrichter / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Aerial_view_of_downtown_West_Bend_Wisconsin.jpg",
          },
        },
        {
          name: "Downtown Riverwalk",
          category: "Recreation",
          blurb:
            "A three-mile riverfront parkway along the Milwaukee River connecting downtown shops and restaurants to Regner Park. The Riverwalk links MOWA, the Eisenbahn State Trail, and the city's dining district in a single continuous path.",
        },
        {
          name: "Regner Park",
          category: "Park",
          blurb:
            "West Bend's signature recreational green space at the south end of the Riverwalk. Highlights include a natural swimming pond, splash pad, Labyrinth Garden, and extensive picnic facilities — one of the most-visited parks in Washington County.",
        },
      ],
      more: [
        { name: "Eisenbahn State Trail", category: "Recreation" },
        { name: "Lizard Mound County Park", category: "Nature" },
        { name: "Washington County Historical Society", category: "Culture" },
        { name: "West Bend Farmers Market", category: "Event" },
        { name: "Kettle Moraine State Forest (Pike Lake Unit)", category: "Nature" },
        { name: "Downtown West Bend dining district", category: "Dining" },
      ],
    },
  },

  hartford: {
    lifestyle: {
      walkScore: { value: 32, label: "Car-Dependent" },
      commute: {
        carMinutes: "45-55 min",
        routes: ["US-41 / I-41", "WI-60"],
        transitNote:
          "No direct transit to Milwaukee. Take WI-60 east to US-41/I-41 south. Rural highway commute; drive times lengthen with peak-hour traffic near Germantown.",
      },
      safety: {
        grade: "A-",
        percentile: 84,
        note:
          "A- overall on CrimeGrade (84th percentile for safety). Crime rate of approximately 14 per 1,000 residents — meaningfully below both the Wisconsin state average and the national average.",
      },
      idealBuyer: {
        tags: ["Families", "Hobbyists", "Outdoor enthusiasts", "Value seekers"],
        summary:
          "Buyers who prioritize safety, affordability, and access to nature — Pike Lake State Park is minutes away — and don't mind the longer drive to Milwaukee in exchange for a quieter small-city lifestyle with genuine automotive heritage.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Wisconsin Automotive Museum",
          category: "Attraction",
          blurb:
            "The largest automotive museum in Wisconsin, displaying 125 vehicles across an acre of exhibit space in downtown Hartford. Famous for housing the world's largest collection of Hartford-built Kissel automobiles (manufactured locally 1906–1931), plus dozens of other rare makes.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/George_A._Kissel_House.JPG/1280px-George_A._Kissel_House.JPG",
            alt: "George A. Kissel House in Hartford, Wisconsin — home of the Kissel Motor Car Company founders",
            credit: "Photo: Shadowe / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:George_A._Kissel_House.JPG",
          },
        },
        {
          name: "Pike Lake Unit — Kettle Moraine State Forest",
          category: "Nature",
          blurb:
            "A 678-acre state forest unit just east of Hartford on WI-60, centered on 461-acre Pike Lake. Residents enjoy swimming, fishing, hiking the glacial terrain of the Kettle Moraine, camping, and winter snowshoeing — all within a 10-minute drive of downtown Hartford.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Pike_Lake,_Hartford,_WI_-_panoramio.jpg/1280px-Pike_Lake,_Hartford,_WI_-_panoramio.jpg",
            alt: "Pike Lake in Hartford, Wisconsin, surrounded by glacial terrain of the Kettle Moraine State Forest",
            credit: "Photo: NaturesFan1226 / Wikimedia Commons",
            license: "CC BY 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Pike_Lake,_Hartford,_WI_-_panoramio.jpg",
          },
        },
        {
          name: "Downtown Hartford",
          category: "Neighborhood",
          blurb:
            "A compact historic main street with local shops, restaurants, and the Kissel-era architecture that reflects Hartford's early-20th-century manufacturing prosperity. The 1911 Hartford High School — a landmark civic building — anchors the downtown streetscape.",
        },
      ],
      more: [
        { name: "Hartford Public Library", category: "Community" },
        { name: "Veterans Memorial Park", category: "Park" },
        { name: "Cedar Lake", category: "Recreation" },
        { name: "Schauer Arts Center", category: "Culture" },
        { name: "Washington County Fair Park", category: "Event" },
      ],
    },
  },

  jackson: {
    lifestyle: {
      walkScore: { value: 22, label: "Car-Dependent" },
      commute: {
        carMinutes: "25-35 min",
        routes: ["US-45", "I-41"],
        transitNote:
          "No transit service to Milwaukee. US-45, just minutes from the village center, is a four-lane limited-access expressway enabling a 25-to-30-minute commute under normal conditions.",
      },
      safety: {
        grade: "A+",
        percentile: 94,
        note:
          "A+ violent crime grade on CrimeGrade (94th percentile for safety). Violent crime rate of approximately 1.3 per 1,000 residents — far below the national average. One of the safest communities in Washington County.",
      },
      idealBuyer: {
        tags: ["Young families", "Safety-focused buyers", "Commuters", "Nature lovers"],
        summary:
          "Buyers who want one of the safest small villages in the Milwaukee metro with an easy US-45 commute, access to Cedar Creek and the Jackson Marsh natural area, and a genuine neighborhood feel at a fraction of suburban Milwaukee prices.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Jackson Park",
          category: "Park",
          blurb:
            "The village's central park with baseball and softball diamonds, tennis courts, picnic areas, and open green space. A community gathering point for youth athletics and seasonal events in this tight-knit village.",
        },
        {
          name: "Cedar Creek Corridor",
          category: "Nature",
          blurb:
            "Cedar Creek — a Milwaukee River tributary running more than 32 miles — meanders through Jackson, offering fishing and natural scenery. The broader watershed connects to the Jackson Marsh State Natural Area, a protected habitat for rare and endangered species including the Kentucky Warbler.",
        },
        {
          name: "Hickory Lane Park",
          category: "Park",
          blurb:
            "Jackson's family-friendly park featuring a splash pad for summer fun and a beer garden for adults, alongside picnic facilities and open recreation space — a lively community hub on warm-weather weekends.",
        },
      ],
      more: [
        { name: "Jackson Marsh State Natural Area", category: "Nature" },
        { name: "Hasmer Lake", category: "Recreation" },
        { name: "Village of Jackson trails", category: "Recreation" },
        { name: "Washington County Fair Park (nearby)", category: "Event" },
        { name: "Cedar Creek fishing access", category: "Recreation" },
      ],
    },
  },
};

export default batch;
