import CountyPage from "@/components/CountyPageTemplate";

const municipalities = [
  "Germantown", "Hartford", "Jackson", "Kewaskum",
  "Newburg", "Richfield", "Slinger", "West Bend",
];

const WashingtonCounty = () => (
  <CountyPage
    name="Washington County"
    description="West Bend, Germantown, and thriving communities north of Milwaukee. Explore market reports for each municipality below."
    municipalities={municipalities}
  />
);

export default WashingtonCounty;