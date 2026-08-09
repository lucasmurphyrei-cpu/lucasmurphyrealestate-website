import CountyPage from "@/components/CountyPageTemplate";

const municipalities = [
  "Big Bend", "Brookfield", "Butler", "Chenequa", "Delafield",
  "Dousman", "Eagle", "Elm Grove", "Genesee", "Hartland",
  "Lac La Belle", "Lannon", "Lisbon", "Menomonee Falls", "Merton",
  "Mukwonago", "Muskego", "Nashotah", "New Berlin", "North Prairie",
  "Oconomowoc", "Pewaukee", "Summit", "Sussex", "Vernon",
  "Wales", "Waukesha",
];

const WaukeshaCounty = () => (
  <CountyPage
    name="Waukesha County"
    description="Brookfield, Wauwatosa, New Berlin and beyond — your gateway to suburban living. Explore market reports for each municipality below."
    municipalities={municipalities}
  />
);

export default WaukeshaCounty;