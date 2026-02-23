// --- Shared sub-types ---

export interface QuickSnapshot {
  population: string;
  median_age: string;
  median_household_income: string;
  median_home_price: string;
  average_rent: string;
  typical_home_style: string;
  school_district: string;
}

export interface BuyerLifestyleFit {
  ideal_buyer: string;
  commute_to_downtown: string;
  walkability_transportation: string;
  crime_safety: string;
}

export interface AmenitiesCharacter {
  community_vibe: string;
  notable_events: string;
  proximity_lake_employers: string;
  major_employers: string;
  parks_attractions: string;
  restaurants_dining: string;
}

export interface RealEstateTrends {
  median_sale_price_yoy: string;
  avg_days_on_market: string;
  price_per_sqft: string;
  market_competitiveness: string;
}

export interface CensusData {
  population: number;
  median_age: number;
  median_household_income: number;
  source_year: string;
}

export interface ZillowData {
  zhvi: number | null;
  zhvi_yoy_pct: number | null;
  zori: number | null;
  zori_yoy_pct: number | null;
}

export interface RedfinData {
  median_sale_price: number | null;
  median_sale_price_yoy: number | null;
  median_dom: number | null;
  median_dom_yoy: number | null;
  median_ppsf: number | null;
  median_ppsf_yoy: number | null;
  sale_to_list: number | null;
  homes_sold: number | null;
  latest_period: string;
}

export interface ApiData {
  census: CensusData;
  zillow: ZillowData;
  redfin: RedfinData;
}

// --- Full profile (profiles.json) ---

export interface MunicipalityProfile {
  id: string;
  display_name: string;
  county: string;
  section_number: number;
  quick_snapshot: QuickSnapshot;
  buyer_lifestyle_fit: BuyerLifestyleFit;
  amenities_character: AmenitiesCharacter;
  real_estate_trends: RealEstateTrends;
  lifestyle_summary: string;
  quiz_tags: string[];
  api_data: ApiData;
}

export interface CountyProfile {
  slug: string;
  name: string;
  overview: string;
  municipality_count: number;
  municipalities: MunicipalityProfile[];
}

export interface ProfilesData {
  meta: {
    exported_at: string;
    source: string;
    version: string;
    counties: number;
    total_municipalities: number;
  };
  counties: Record<string, CountyProfile>;
}

// --- Slim profile (profiles-slim.json) ---

export interface MunicipalitySlim {
  id: string;
  display_name: string;
  county: string;
  quick_snapshot: QuickSnapshot;
  real_estate_trends: RealEstateTrends;
  quiz_tags: string[];
  lifestyle_summary: string;
  api_data: ApiData;
}

export interface SlimData {
  meta: {
    exported_at: string;
    source: string;
    version: string;
    counties: number;
    total_municipalities: number;
  };
  municipalities: MunicipalitySlim[];
}

// --- Quiz types ---

export interface QuizChoice {
  label: string;
  text: string;
  attribute_boosts: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  weight: number;
  choices: QuizChoice[];
}

export interface QuizGuardrail {
  rule: string;
  description: string;
  penalty?: number;
  bonus?: number;
  trigger_question?: string;
  trigger_choice?: string;
  exclude_below?: number;
  attribute?: string;
}

export interface QuizQuestionsData {
  meta: Record<string, unknown>;
  questions: QuizQuestion[];
  scoring: {
    method: string;
    tie_break_priority: string[];
    guardrails: QuizGuardrail[];
    output_count: number;
    output_note: string;
  };
  crm_tagging: {
    format: string;
    example: string;
  };
}

export interface AreaAttributes {
  display_name: string;
  county: string;
  median_sale_price: number;
  attributes: Record<string, number>;
  tags: string[];
}

export interface QuizAttributesData {
  meta: Record<string, unknown>;
  attribute_definitions: Record<string, string>;
  areas: Record<string, AreaAttributes>;
}
