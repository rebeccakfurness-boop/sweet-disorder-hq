import type { Product } from "@/lib/types";

export const BASE_UNIT_PRICE = 18;

export const products: Product[] = [
  {
    id: "prod-you-rock",
    name: "You Rock",
    sku: "SD-YR-01",
    description: "A pick-me-up jar for anyone who needs reminding they're doing great.",
    basePrice: BASE_UNIT_PRICE,
  },
  {
    id: "prod-chill-pills",
    name: "Chill Pills",
    sku: "SD-CP-01",
    description: "For the frazzled, the wound-up, and everyone counting down to Friday.",
    basePrice: BASE_UNIT_PRICE,
  },
  {
    id: "prod-bs-blockers",
    name: "Bullshit Blockers",
    sku: "SD-BB-01",
    description: "Protection against nonsense, in lolly form.",
    basePrice: BASE_UNIT_PRICE,
  },
  {
    id: "prod-bear-hugs",
    name: "Bear Hugs",
    sku: "SD-BH-01",
    description: "For when you can't be there in person but still want to squeeze someone.",
    basePrice: BASE_UNIT_PRICE,
  },
  {
    id: "prod-fart-suppressants",
    name: "Fart Suppressants",
    sku: "SD-FS-01",
    description: "The office gift that always gets a laugh out loud.",
    basePrice: BASE_UNIT_PRICE,
  },
  {
    id: "prod-senior-moment",
    name: "Senior Moment Suppressants",
    sku: "SD-SM-01",
    description: "For the forgetful, the retiring, and the young at heart.",
    basePrice: BASE_UNIT_PRICE,
  },
  {
    id: "prod-over-the-hill",
    name: "Over The Hill Pills",
    sku: "SD-OH-01",
    description: "A birthday classic for milestone ages nobody asked to reach.",
    basePrice: BASE_UNIT_PRICE,
  },
  {
    id: "prod-dad-joke",
    name: "Dad Joke Enhancers",
    sku: "SD-DJ-01",
    description: "Guaranteed to make Father's Day groan-worthy.",
    basePrice: BASE_UNIT_PRICE,
  },
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}
