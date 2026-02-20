import CountyPage from "@/components/CountyPageTemplate";

const municipalities = [
  "Belgium", "Cedarburg", "Fredonia", "Grafton",
  "Mequon", "Port Washington", "Saukville", "Thiensville",
];

const OzaukeeCounty = () => (
  <CountyPage
    name="Ozaukee County"
    description="Cedarburg, Mequon, Port Washington — lakeside charm and scenic beauty. Explore market reports for each municipality below."
    municipalities={municipalities}
  />
);

export default OzaukeeCounty;