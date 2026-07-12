export interface DiscountTier {
  label: string;
  minQuantity: number;
  discountPercent: number;
}

export const discountTiers: DiscountTier[] = [
  { label: "1–9 units", minQuantity: 1, discountPercent: 0 },
  { label: "10–49 units", minQuantity: 10, discountPercent: 10 },
  { label: "50–149 units", minQuantity: 50, discountPercent: 15 },
  { label: "150+ units", minQuantity: 150, discountPercent: 20 },
];

export function getDiscountTierForQuantity(totalQuantity: number): DiscountTier {
  return [...discountTiers].reverse().find((tier) => totalQuantity >= tier.minQuantity) ?? discountTiers[0];
}
