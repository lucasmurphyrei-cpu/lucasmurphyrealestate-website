import type { MarketProfile } from "../marketProfiles";
import batchA from "./washington/batch-a";
import batchB from "./washington/batch-b";

const washingtonProfiles: Record<string, MarketProfile> = {
  ...batchA,
  ...batchB,
};

export default washingtonProfiles;
