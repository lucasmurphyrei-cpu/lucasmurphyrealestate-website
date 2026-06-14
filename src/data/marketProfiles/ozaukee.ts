import type { MarketProfile } from "../marketProfiles";
import batchA from "./ozaukee/batch-a";
import batchB from "./ozaukee/batch-b";

const ozaukeeProfiles: Record<string, MarketProfile> = {
  ...batchA,
  ...batchB,
};

export default ozaukeeProfiles;
