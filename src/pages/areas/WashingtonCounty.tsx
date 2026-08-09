import CountyPage from "@/components/CountyPageTemplate";

const municipalities = [
  "Addison", "Barton", "Farmington", "Germantown", "Hartford",
  "Jackson", "Kewaskum", "Newburg", "Polk", "Richfield",
  "Slinger", "Trenton", "Wayne", "West Bend",
];

const WashingtonCounty = () => (
  <CountyPage
    name="Washington County"
    description="West Bend, Germantown, and thriving communities north of Milwaukee. Explore market reports for each municipality below."
    municipalities={municipalities}
  />
);

export default WashingtonCounty;