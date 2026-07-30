// The canonical list of "what a donation amount provides" - shared by
// DonateModal's preset buttons and ImpactCalculator's slider, so the two
// never drift out of sync with different claims about the same amount.
// Display text (label/unit/unitPlural) lives in locale files under
// `impactTiers.<key>` so it's translated - see en/common.json.
export const IMPACT_TIERS = [
  { amount: 2000, key: "nutritionKit" },
  { amount: 5000, key: "healthOutreach" },
  { amount: 10000, key: "skillTraining" },
  { amount: 25000, key: "familySupport" },
];
