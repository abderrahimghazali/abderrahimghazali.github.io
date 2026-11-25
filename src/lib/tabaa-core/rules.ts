// Copied from https://github.com/abderrahimghazali/tabaa (packages/core). Fixes go there first, then here.
// Regulatory values are data with an effective date, never constants in logic.
// Values below are unverified against the official texts:
// confirm with an expert-comptable before production use.
export interface RulePackage {
  id: string;
  effectiveFrom: string;
  vatRates: string[];
  defaultPaymentTermDays: number;
  maxPaymentTermDays: number;
  stampDutyRate: string;
  // Years kept after the end of the invoice's calendar year. To be confirmed with the accountant.
  retentionYears: number;
}

export const MA_2026: RulePackage = {
  id: "ma-2026",
  effectiveFrom: "2026-01-01",
  vatRates: ["20", "10", "0"],
  defaultPaymentTermDays: 60,
  maxPaymentTermDays: 120,
  stampDutyRate: "0.0025",
  retentionYears: 10,
};

const PACKAGES = [MA_2026];

export function activeRules(date: string): RulePackage {
  const match = PACKAGES.filter((p) => p.effectiveFrom <= date).at(-1);
  return match ?? MA_2026;
}
