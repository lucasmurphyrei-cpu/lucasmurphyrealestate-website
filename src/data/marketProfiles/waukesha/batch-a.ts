import type { MarketProfile } from "../../marketProfiles";

const batch: Record<string, MarketProfile> = {
  brookfield: {
    lifestyle: {
      walkScore: { value: 20, label: "Car-Dependent" },
      commute: {
        carMinutes: "15-20 min",
        routes: ["I-94", "Bluemound Rd", "Hwy 18"],
      },
      safety: {
        grade: "C+",
        percentile: 51,
        note:
          "Overall C+ on CrimeGrade (51st percentile -- about average for US cities). Safer than the Wisconsin state average and the national average. Crime concentrates in the commercial corridors along Bluemound Road; residential neighborhoods to the north earn significantly higher marks.",
      },
      idealBuyer: {
        tags: ["Affluent families", "Corporate executives", "Elmbrook schools seekers", "Move-up buyers"],
        summary:
          "Buyers who want Waukesha County's premier suburban address -- top-ranked Elmbrook schools, upscale shopping at The Corners and Brookfield Square, fine dining, and one of the shortest commutes to Milwaukee in the county, all in a polished, well-maintained community.",
      },
    },
    amenities: {
      featured: [
        {
          name: "The Corners of Brookfield",
          category: "Shopping",
          blurb:
            "Brookfield's upscale open-air lifestyle center anchors the city's retail scene with a curated mix of boutique shops, chef-driven restaurants, and a Whole Foods Market. The pedestrian-friendly streetscape hosts seasonal markets and outdoor events throughout the year.",
        },
        {
          name: "Sharon Lynne Wilson Center for the Arts",
          category: "Attraction",
          blurb:
            "Waukesha County's premier performing arts venue hosts a full calendar of professional theater, dance, jazz, and classical performances year-round. The outdoor Wendy Engel Park Amphitheater presents free summer concerts drawing audiences from across the metro area.",
        },
        {
          name: "Quarry Lake Park",
          category: "Park",
          blurb:
            "A 223-acre Brookfield city park built around a flooded 22-acre quarry lake with a sandy beach, pedal boat rentals, a heated lodge, picnic pavilions, and a mile-long paved loop trail. Open for swimming in summer and ice skating in winter, it is the community's most-used outdoor space.",
        },
      ],
      more: [
        { name: "Elmbrook School District", category: "Schools" },
        { name: "Brookfield Square Mall", category: "Shopping" },
        { name: "Mr. B's -- A Bartolotta Steakhouse", category: "Dining" },
        { name: "Cafe Hollander Brookfield", category: "Dining" },
        { name: "Brookfield Farmers Market", category: "Event" },
        { name: "Brookfield Arts, Crafts & Drafts Festival", category: "Event" },
        { name: "Greenway Trail System", category: "Recreation" },
      ],
    },
  },

  new_berlin: {
    lifestyle: {
      walkScore: { value: 19, label: "Car-Dependent" },
      commute: {
        carMinutes: "20-25 min",
        routes: ["I-43", "I-894", "National Ave (Hwy 15)"],
      },
      safety: {
        grade: "B+",
        percentile: 74,
        note:
          "Overall B+ on CrimeGrade (74th percentile -- safer than 74% of US cities). Safer than the Wisconsin state average and the national average. Southwest neighborhoods are the safest; east-side commercial areas see slightly higher property crime.",
      },
      idealBuyer: {
        tags: ["Established families", "Move-up buyers", "Nature trail enthusiasts", "Value-focused buyers"],
        summary:
          "Buyers who want more home for the money than Brookfield, spacious lots in a safe, family-first community, and quick access to both Milwaukee and the western suburbs via I-43 -- without sacrificing school quality or green space.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Deer Creek Sanctuary",
          category: "Park",
          blurb:
            "A nature preserve and trail system winding through creek corridors and native woodland on New Berlin's northwest side. Popular with cyclists and hikers, it connects to the New Berlin Recreation Trail -- a 10-mile paved path linking the city's parks from east to west.",
        },
        {
          name: "New Berlin Recreation Trail",
          category: "Recreation",
          blurb:
            "A 10-mile paved multi-use trail running the length of the city, connecting major parks and neighborhoods from the eastern border to the western edge. The trail passes through wooded creek valleys and open prairie corridors, making it a four-season resource for cycling, running, and dog walking.",
        },
        {
          name: "New Berlin Historical Society & Museum",
          category: "Attraction",
          blurb:
            "A free, volunteer-run museum complex at 19885 W. National Avenue preserving the agricultural and small-town history of the community. The grounds include a one-room schoolhouse, a restored farmhouse, and rotating exhibits on life in southeastern Wisconsin from the 19th century onward.",
        },
      ],
      more: [
        { name: "New Berlin Hills Golf Course", category: "Recreation" },
        { name: "New Berlin Parks system (29 parks)", category: "Park" },
        { name: "July Fourth Festival & Fireworks", category: "Event" },
        { name: "Summer Concert Series", category: "Event" },
        { name: "New Berlin School District", category: "Schools" },
        { name: "National Avenue dining corridor", category: "Dining" },
        { name: "Harvest Festival", category: "Event" },
      ],
    },
  },

  menomonee_falls: {
    lifestyle: {
      walkScore: { value: 27, label: "Car-Dependent" },
      commute: {
        carMinutes: "20-30 min",
        routes: ["I-41", "Hwy 45", "Appleton Ave"],
      },
      safety: {
        grade: "B+",
        percentile: 73,
        note:
          "Overall B+ on CrimeGrade (73rd percentile -- safer than 73% of US cities). Safer than the Wisconsin state average and the national average. Southwest neighborhoods score highest; the north side sees the most incidents, though total counts remain low for a community of this size.",
      },
      idealBuyer: {
        tags: ["Families", "Kohl's & I-41 corridor employees", "Community-oriented buyers", "Village charm seekers"],
        summary:
          "Buyers who want a genuine village identity -- a revitalized historic downtown, the Bugline Trail out the back door, and strong community events -- with a painless commute to Kohl's HQ, Menomonee Falls business parks, and the broader I-41 corridor.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Downtown Menomonee Falls (Main Street)",
          category: "Neighborhood",
          blurb:
            "The village's revitalized commercial core along Main Street and Appleton Avenue is lined with locally owned restaurants, boutiques, and gathering spots, punctuated by colorful community murals. The district hosts the weekly seasonal Farmers Market, Falls Family Movie Nights, and the annual Lavender Festival.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Main_Street_Historic_District_of_Menomonee_Falls%2C_WI.JPG/1280px-Main_Street_Historic_District_of_Menomonee_Falls%2C_WI.JPG",
            alt: "Historic Main Street commercial district of Menomonee Falls, Wisconsin, showing brick storefronts along the village corridor",
            credit: "Photo: Shadowe / Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Main_Street_Historic_District_of_Menomonee_Falls,_WI.JPG",
          },
        },
        {
          name: "Bugline Recreation Trail",
          category: "Recreation",
          blurb:
            "A 14-mile paved rail-to-trail corridor stretching from Menomonee Falls southwest through Sussex and into the broader Waukesha County trail network. The trail runs through residential neighborhoods, natural creek corridors, and woodland edges, serving as the community's primary non-motorized commuter and recreation spine.",
        },
        {
          name: "Old Falls Village",
          category: "Attraction",
          blurb:
            "A living history park on the banks of the Menomonee River that stages immersive events spanning eras from the Renaissance through World War II. The Miller-Davidson House -- childhood home of Walter Davidson's wife, co-founder of Harley-Davidson -- stands on the grounds and anchors the site's regional historical significance.",
        },
      ],
      more: [
        { name: "Menomonee Falls Farmers Market", category: "Event" },
        { name: "Falls Family Movie Nights", category: "Event" },
        { name: "Lavender Festival", category: "Event" },
        { name: "Kohl's Corporation headquarters", category: "Employer" },
        { name: "Mill Pond Park", category: "Park" },
        { name: "Menomonee Falls High School (Hamilton School District)", category: "Schools" },
        { name: "Garcade Arcade & Pinball", category: "Attraction" },
      ],
    },
  },

  oconomowoc: {
    lifestyle: {
      walkScore: { value: 32, label: "Car-Dependent" },
      commute: {
        carMinutes: "35-40 min",
        routes: ["I-94", "US-18", "Hwy 67"],
      },
      safety: {
        grade: "B+",
        percentile: 75,
        note:
          "Overall B+ on CrimeGrade (75th percentile -- safer than 75% of US cities). Safer than the Wisconsin state average and the national average. North-side neighborhoods are the safest; the active downtown commercial core sees the most incidents, typical of a lakefront destination city.",
      },
      idealBuyer: {
        tags: ["Lakefront lifestyle buyers", "Retirees", "Boutique lifestyle seekers", "Remote workers"],
        summary:
          "Buyers who want a rare combination: a genuinely walkable, character-filled downtown wrapped around a lake, with year-round resort-town energy, historic Midwest charm, and access to three lakes -- at a commute distance that works for hybrid Milwaukee schedules.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Downtown Oconomowoc & Fowler Lake",
          category: "Neighborhood",
          blurb:
            "A compact, walkable downtown of boutiques, wine bars, art galleries, and waterfront restaurants encircling 97-acre Fowler Lake, complete with a 2-mile lakefront walking loop. The city holds the distinction of hosting the 1939 world premiere of The Wizard of Oz and celebrates that legacy with Oz Plaza -- a public space with character statues and a yellow brick road.",
          photo: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/City_Beach_Aerial.jpg/1280px-City_Beach_Aerial.jpg",
            alt: "Aerial view of Oconomowoc City Beach along Fowler Lake in downtown Oconomowoc, Wisconsin",
            credit: "Photo: Pbrunclik / Wikimedia Commons",
            license: "CC BY-SA 4.0",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:City_Beach_Aerial.jpg",
          },
        },
        {
          name: "Lac La Belle",
          category: "Recreation",
          blurb:
            "One of Waukesha County's premier recreational lakes, Lac La Belle borders downtown Oconomowoc and offers boating, fishing, kayaking, and waterfront dining at Cafe LaBelle. Together with Fowler Lake and nearby Okauchee Lake, it gives residents access to a three-lake network within minutes of home.",
        },
        {
          name: "Oconomowoc Festival of the Arts",
          category: "Attraction",
          blurb:
            "An annual juried fine arts festival drawing artists and visitors from across the Midwest to downtown Oconomowoc. Held along the lakefront streets, the event is a signature expression of the city's arts-forward identity and one of the strongest community gatherings in Waukesha County.",
        },
      ],
      more: [
        { name: "Oconomowoc City Beach", category: "Recreation" },
        { name: "Oz Plaza", category: "Attraction" },
        { name: "Pabst Farms commercial district", category: "Shopping" },
        { name: "Cafe LaBelle", category: "Dining" },
        { name: "Okauchee Lake", category: "Recreation" },
        { name: "Lake Country Recreation Trail", category: "Recreation" },
        { name: "Oconomowoc Farmers Market & downtown parades", category: "Event" },
      ],
    },
  },

  muskego: {
    lifestyle: {
      walkScore: { value: 16, label: "Car-Dependent" },
      commute: {
        carMinutes: "25-35 min",
        routes: ["I-43", "Hwy 36", "Racine Ave"],
      },
      safety: {
        grade: "A",
        percentile: 88,
        note:
          "Overall A on CrimeGrade (88th percentile -- safer than 88% of US cities). Safer than the Wisconsin state average and the national average. South-side neighborhoods are the quietest; the northeast corner sees the most incidents, though annual totals remain extremely low for a city of this size.",
      },
      idealBuyer: {
        tags: ["Families prioritizing schools", "Lake access buyers", "Semi-rural lifestyle seekers", "Safety-focused buyers"],
        summary:
          "Buyers who put school quality and safety first, want a spacious lot or possible lake access, and are drawn to a four-season outdoor lifestyle -- fishing, boating, and ice skating in their own backyard -- without the price premium of the lakefront communities to the north.",
      },
    },
    amenities: {
      featured: [
        {
          name: "Big Muskego Lake",
          category: "Recreation",
          blurb:
            "The largest of Muskego's three lakes at roughly 2,100 acres, Big Muskego Lake is the defining feature of the community's outdoor identity. Residents launch boats from multiple public access points for fishing, waterskiing, and pontoon cruising in summer, and return for ice fishing tournaments and skating in winter.",
        },
        {
          name: "Muskego-Norway School District",
          category: "Schools",
          blurb:
            "Consistently among the top-rated school districts in Waukesha County, the Muskego-Norway School District earns a Niche grade of A and a SchoolGrade of A, with 60% actual proficiency exceeding projected levels. It is the primary reason families plant roots in Muskego over comparable southern-county communities.",
        },
        {
          name: "Waukesha County Parks -- Muskego Area",
          category: "Park",
          blurb:
            "Waukesha County parkland surrounding the Muskego lakes provides residents with half a dozen loop hiking trails, fishing piers, swimming areas, and scenic overlooks accessible from the city's southern and western edges. Lake Denoon County Park, along Big Muskego Lake, is the most-used outdoor gathering point.",
        },
      ],
      more: [
        { name: "Little Muskego Lake", category: "Recreation" },
        { name: "Lake Denoon", category: "Recreation" },
        { name: "Muskego-Norway School District", category: "Schools" },
        { name: "Community parks & skate park", category: "Recreation" },
        { name: "Muskego Community Festivals & fishing tournaments", category: "Event" },
        { name: "I-43 corridor employment access", category: "Employer" },
      ],
    },
  },
};

export default batch;
