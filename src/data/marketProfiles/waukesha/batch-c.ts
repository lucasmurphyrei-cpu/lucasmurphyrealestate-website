import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  butler: {
    lifestyle: {
      walkScore: { value: 22, label: "Car-Dependent" },
      commute: {
        carMinutes: "18-25 min",
        routes: ["US-45", "Hwy 100", "I-41/I-894"],
        transitNote:
          "No local bus service in the village. US-45 feeds directly onto I-41/I-894 into Milwaukee.",
      },
      safety: {
        grade: "C+",
        note:
          "Safe overall. Total crime is below the national average and violent crime runs about 53% below the national rate (AreaVibes / City-Data). As a very small village of about 1,800, rates swing on just a few incidents year to year; absolute crime is low.",
      },
      idealBuyer: {
        tags: ["Value hunters", "Industrial workers", "First-time buyers"],
        summary:
          "Buyers seeking the lowest price points on Waukesha County's eastern edge, with a quick hop onto US-45 to Milwaukee and a tight working-class community rooted in over a century of railroad and manufacturing history.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Butler Inn",
          category: "Dining",
          blurb:
            "A long-running local tavern and supper club that has anchored Butler's social life for decades. Known for Friday fish fry and affordable American comfort food in a classic Wisconsin roadhouse setting.",
        },
        {
          name: "Butler Village Park",
          category: "Park",
          blurb:
            "The village's central recreational hub with baseball diamonds, basketball and tennis courts, a horseshoe pit, playground, and a rentable pavilion -- hub of the community's adult softball league and neighborhood gatherings.",
        },
      ],
      more: [
        { name: "Menomonee River Parkway", category: "Recreation" },
        { name: "Joey's Diner", category: "Dining" },
        { name: "Butler Public Library", category: "Community" },
      ],
    },
  },

  chenequa: {
    lifestyle: {
      walkScore: { value: 4, label: "Car-Dependent" },
      commute: {
        carMinutes: "40-50 min",
        routes: ["Hwy 16 (I-94 corridor)", "Hwy 83", "Hwy C"],
        transitNote:
          "No transit service. Hwy 16 (freeway) is the primary artery east toward the I-94 interchange at Pewaukee.",
      },
      safety: {
        grade: "",
        note:
          "No formal CrimeGrade rating available for this very small village (pop. ~526). Waukesha County's Lake Country corridor is broadly low-crime; the village reports near-zero violent incidents. Residents call Waukesha County Sheriff for coverage.",
      },
      idealBuyer: {
        tags: ["Estate buyers", "Lake-life enthusiasts", "Privacy seekers"],
        summary:
          "Buyers who want a private lakefront estate on Pine Lake with a Tree City USA setting -- large minimum lot sizes (2-5 acres), serene Lake Country atmosphere, and acceptance of a 40-50 minute commute to Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Pine Lake",
          category: "Lake",
          blurb:
            "A 703-acre glacial lake that the village completely surrounds. Known for excellent fishing (panfish, bass, northern pike, walleye), non-motorized paddling, and some of the most private shoreline in the Lake Country region. The village name derives from the Potawatomi word for 'pine.'",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Pine_Lake.jpg/1280px-Pine_Lake.jpg",
            alt: "Panoramic view of Pine Lake in Chenequa, Wisconsin on a clear day",
            credit: "Photo: Awkwafaba / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Pine_Lake.jpg",
          },
        },
        {
          name: "Beaver Lake",
          category: "Lake",
          blurb:
            "A smaller glacial lake whose shoreline partially falls within Chenequa's borders, adding a second water amenity to the village's exceptionally lake-rich setting.",
        },
      ],
      more: [
        { name: "North Lake", category: "Lake" },
        { name: "Lake Country Trail", category: "Recreation" },
        { name: "Hartland Village shops (adjacent)", category: "Shopping" },
      ],
    },
  },

  dousman: {
    lifestyle: {
      walkScore: { value: 16, label: "Car-Dependent" },
      commute: {
        carMinutes: "40-50 min",
        routes: ["US-18", "Hwy 67", "I-94 (via Waukesha)"],
        transitNote:
          "No local transit. US-18 runs east through Waukesha to Milwaukee; Hwy 67 north connects to I-94 at Oconomowoc.",
      },
      safety: {
        grade: "A-",
        percentile: 78,
        note:
          "Overall A- on CrimeGrade (78th percentile -- safer than most US cities). Crime rate of roughly 16 per 1,000 residents. Southeast neighborhoods see the lowest incident rates.",
      },
      idealBuyer: {
        tags: ["Nature lovers", "Outdoor recreation families", "Retiring couples"],
        summary:
          "Buyers drawn to the Kettle Moraine's glacial scenery and trail access, who want a quiet Lake Country village with high safety ratings and are comfortable with a 40-50 minute commute to Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Scuppernong Springs State Natural Area",
          category: "Recreation",
          blurb:
            "A state natural area within the Kettle Moraine Southern Unit featuring cold-water springs, a rare spring-fed stream, and wetland habitat. Popular for fishing, wildlife observation, and hiking along the Ice Age National Scenic Trail.",
        },
        {
          name: "Dousman Historic District",
          category: "Neighborhood",
          blurb:
            "The village's compact downtown, named for pioneer politician Talbot C. Dousman, retains its small-town Main Street character. A Wisconsin Historical Marker commemorates the area's early settlement dating to the 1830s.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Dousman_Historic_Marker.jpg/1280px-Dousman_Historic_Marker.jpg",
            alt: "Wisconsin historical marker commemorating the founding of Dousman",
            credit: "Photo: Awkwafaba / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Dousman_Historic_Marker.jpg",
          },
        },
      ],
      more: [
        { name: "Cory Municipal Park", category: "Park" },
        { name: "Ice Age National Scenic Trail", category: "Recreation" },
        { name: "Ottawa Lake Recreation Area", category: "Recreation" },
        { name: "Kettle Moraine State Forest -- Southern Unit", category: "Park" },
      ],
    },
  },

  eagle: {
    lifestyle: {
      walkScore: { value: 13, label: "Car-Dependent" },
      commute: {
        carMinutes: "45-55 min",
        routes: ["Hwy 59", "Hwy 67", "US-18 (via Eagle to Waukesha)", "I-94"],
        transitNote:
          "No transit service. Hwy 59 east is the primary corridor; I-94 is reachable north via Hwy 67 at Oconomowoc.",
      },
      safety: {
        grade: "A-",
        percentile: 84,
        note:
          "Overall A- on CrimeGrade (84th percentile -- one of the safer small villages in southeastern Wisconsin). Crime rate of roughly 14 per 1,000 residents. Southeast neighborhoods are the most peaceful.",
      },
      idealBuyer: {
        tags: ["Outdoor enthusiasts", "History buffs", "Rural families"],
        summary:
          "Buyers who want a gateway village nestled in the Kettle Moraine State Forest -- world-class hiking, mountain biking, and living history at Old World Wisconsin -- with a high safety rating and a true rural feel at about 35 miles from Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Old World Wisconsin",
          category: "Attraction",
          blurb:
            "One of the largest outdoor living history museums in the world, spread across 576 acres of Kettle Moraine glacial landscape. More than 60 historic structures interpret the daily lives of 19th-century immigrant settlers -- German, Scandinavian, Polish, and more -- with costumed interpreters year-round.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Koepsell_House%2C_Old_World_Wisconsin.JPG/1280px-Koepsell_House%2C_Old_World_Wisconsin.JPG",
            alt:
              "Koepsell House at Old World Wisconsin, a 19th-century German immigrant farmstead in Eagle, Wisconsin",
            credit: "Photo: Bridget Bannon / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Koepsell_House,_Old_World_Wisconsin.JPG",
          },
        },
        {
          name: "Kettle Moraine State Forest -- Southern Unit",
          category: "Park",
          blurb:
            "Over 22,000 acres of glacially sculpted terrain beginning at Eagle's doorstep. The forest headquarters is located just outside the village. Features 100+ miles of trails for hiking, mountain biking, and horseback riding, plus camping at Ottawa Lake, and the Ice Age National Scenic Trail.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Kettle_Moraine%2C_Wisconsin_1.jpg/1280px-Kettle_Moraine%2C_Wisconsin_1.jpg",
            alt:
              "Rolling glacial hills and hardwood forest of the Kettle Moraine in Wisconsin",
            credit: "Photo: Sajith T S / Wikimedia Commons",
            license: "CC BY-SA 2.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Kettle_Moraine,_Wisconsin_1.jpg",
          },
        },
      ],
      more: [
        { name: "Ice Age National Scenic Trail", category: "Recreation" },
        { name: "Ottawa Lake Recreation Area", category: "Recreation" },
        { name: "Eagle Historical Society Museum", category: "Culture" },
        { name: "Whitewater Lake Recreation Area", category: "Recreation" },
      ],
    },
  },

  lac_la_belle: {
    lifestyle: {
      walkScore: { value: 5, label: "Car-Dependent" },
      commute: {
        carMinutes: "35-45 min",
        routes: ["I-94 (via Oconomowoc)", "Hwy 67", "Hwy 16"],
        transitNote:
          "No transit service. I-94 is the fastest route east; the nearest interchange is at Oconomowoc, roughly 5 miles north.",
      },
      safety: {
        grade: "",
        note:
          "No CrimeGrade rating available for this very small village (pop. ~281-306). The community is residential and lake-focused with essentially no commercial activity; the Waukesha County Sheriff provides coverage. No significant crime incidents reported in publicly available data.",
      },
      idealBuyer: {
        tags: ["Lakefront buyers", "Boaters and anglers", "Peaceful retreat seekers"],
        summary:
          "Buyers seeking a tight-knit lakefront community built entirely around Lake Lac La Belle -- a 1,154-acre fishery -- with large lots, low density by design, and quiet residential living about 35 miles west of Milwaukee.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Lake Lac La Belle",
          category: "Lake",
          blurb:
            "A 1,154-acre glacial lake with a maximum depth of 45 feet, at the heart of the village. Supports panfish, largemouth and smallmouth bass, northern pike, and walleye. The lake has been the central focus of village planning since the community's founding as a vacation-home colony in the early 20th century.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Lac_La_Belle_%282%29.jpg/1280px-Lac_La_Belle_%282%29.jpg",
            alt: "View of Lake Lac La Belle, a glacial lake in Waukesha County, Wisconsin",
            credit: "Photo: Awkwafaba / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Lac_La_Belle_(2).jpg",
          },
        },
      ],
      more: [
        { name: "Oconomowoc shops and dining (adjacent)", category: "Shopping" },
        { name: "Lake Country Trail", category: "Recreation" },
        { name: "Town of Oconomowoc parks", category: "Park" },
      ],
    },
  },

  lannon: {
    lifestyle: {
      walkScore: { value: 18, label: "Car-Dependent" },
      commute: {
        carMinutes: "22-30 min",
        routes: ["US-45", "Hwy 164", "I-41/I-894"],
        transitNote:
          "No local village transit. US-45 south provides a direct freeway corridor to Milwaukee's western suburbs and downtown.",
      },
      safety: {
        grade: "A-",
        percentile: 83,
        note:
          "Overall A- on CrimeGrade (83rd percentile). Crime rate of roughly 14 per 1,000 residents -- well below state and national averages. Violent crime rate is near zero. Northwest neighborhoods are the quietest.",
      },
      idealBuyer: {
        tags: ["Young families", "Nature and trail enthusiasts", "Milwaukee commuters"],
        summary:
          "Buyers who want a rapidly growing, safe small village with a distinctive limestone-quarry heritage, immediate access to 464-acre Menomonee Park and the 16-mile Bugline Trail, and one of the shorter commutes to Milwaukee among outer Waukesha County communities.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Menomonee Park",
          category: "Park",
          blurb:
            "A 464-acre Waukesha County park adjoining the village, centered on a 16-acre quarry lake (Lannon Pond) with a public swimming beach, canoe and paddleboard rentals, 4.5 miles of hiking trails, picnic areas, and reservable campsites amid rolling maple woods and wetlands.",
        },
        {
          name: "Bugline Recreational Trail",
          category: "Recreation",
          blurb:
            "A 16-mile paved multi-use trail built on the former railroad bed through Lannon, Sussex, and Menomonee Falls. Popular for biking, running, and inline skating; a separated equestrian path runs parallel in sections.",
        },
        {
          name: "Lannon Stone Quarries",
          category: "Landmark",
          blurb:
            "Lannon sits atop the Niagara Escarpment, and its distinctive buff dolomite limestone has been quarried here since 1838. 'Lannon stone' remains a coveted building material across the Midwest; the active and historic quarries give the village its defining visual character and industrial heritage.",
        },
      ],
      more: [
        { name: "Schneider Field / Lannon Stonemen Baseball", category: "Recreation" },
        { name: "Joeck's Park", category: "Park" },
        { name: "Sussex Village Center dining (adjacent)", category: "Dining" },
        { name: "Niagara Escarpment geology sites", category: "Landmark" },
      ],
    },
  },
};

export default batch;
