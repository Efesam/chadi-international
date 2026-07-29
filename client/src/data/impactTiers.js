// The canonical list of "what a donation amount provides" - shared by
// DonateModal's preset buttons and ImpactCalculator's slider, so the two
// never drift out of sync with different claims about the same amount.
export const IMPACT_TIERS = [
  { amount: 2000, label: "Provides a nutrition kit", unit: "nutrition kit", unitPlural: "nutrition kits" },
  { amount: 5000, label: "Supports a health outreach", unit: "health outreach visit", unitPlural: "health outreach visits" },
  { amount: 10000, label: "Trains a child in a new skill", unit: "child trained in a new skill", unitPlural: "children trained in a new skill" },
  { amount: 25000, label: "Supports a family for a month", unit: "family supported for a month", unitPlural: "families supported for a month" },
];
