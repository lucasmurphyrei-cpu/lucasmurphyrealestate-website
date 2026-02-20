import CountyPage from "@/components/CountyPageTemplate";

const municipalities = [
  "Bayside", "Brown Deer", "Cudahy", "Fox Point", "Franklin",
  "Glendale", "Greendale", "Greenfield", "Hales Corners", "Milwaukee",
  "Oak Creek", "River Hills", "Shorewood", "South Milwaukee",
  "St. Francis", "Wauwatosa", "West Allis", "West Milwaukee", "Whitefish Bay",
];

const MilwaukeeCounty = () => (
  <CountyPage
    name="Milwaukee County"
    description="From downtown Milwaukee to the charming suburbs — we know every neighborhood. Explore market reports for each municipality below."
    municipalities={municipalities}
  />
);

export default MilwaukeeCounty;