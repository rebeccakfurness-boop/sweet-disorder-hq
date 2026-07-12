import type { Opportunity } from "@/lib/types";

export const opportunities: Opportunity[] = [
  // New
  {
    id: "opp-bondi-wellness",
    companyId: "co-bondi-tech",
    title: "EOFY Staff Wellness Gifts",
    stage: "new",
    estimatedValue: 3200,
    nextFollowUpDate: "2026-07-15",
    ownerName: "Molly",
    createdAt: "2026-07-11T11:40:00+10:00",
  },
  {
    id: "opp-saltsea-winter",
    companyId: "co-salt-sea",
    title: "Winter Stockist Restock",
    stage: "new",
    estimatedValue: 650,
    nextFollowUpDate: "2026-07-14",
    ownerName: "Molly",
    createdAt: "2026-07-06T15:30:00+12:00",
  },
  {
    id: "opp-greatsouthern-newrange",
    companyId: "co-great-southern",
    title: "New Range Wholesale Order",
    stage: "new",
    estimatedValue: 5400,
    nextFollowUpDate: "2026-07-18",
    ownerName: "Molly",
    createdAt: "2026-07-11T08:30:00+10:00",
  },
  // Contacted
  {
    id: "opp-alpine-settlement",
    companyId: "co-alpine-property",
    title: "Client Settlement Gifts",
    stage: "contacted",
    estimatedValue: 2100,
    nextFollowUpDate: "2026-07-16",
    ownerName: "Molly",
    createdAt: "2026-07-08T14:05:00+12:00",
  },
  {
    id: "opp-quirkynook-spring",
    companyId: "co-quirky-nook",
    title: "Spring Stockist Top-up",
    stage: "contacted",
    estimatedValue: 480,
    nextFollowUpDate: "2026-07-20",
    ownerName: "Molly",
    createdAt: "2026-07-11T13:50:00+12:00",
  },
  {
    id: "opp-kiwigift-q3",
    companyId: "co-kiwi-gift-co",
    title: "Q3 Distribution Refresh",
    stage: "contacted",
    estimatedValue: 6800,
    nextFollowUpDate: "2026-07-22",
    ownerName: "Molly",
    createdAt: "2026-07-09T16:15:00+12:00",
  },
  // Quoted
  {
    id: "opp-harbourcity-xmas",
    companyId: "co-harbour-city",
    title: "Christmas Client Gifting 2026",
    stage: "quoted",
    estimatedValue: 8400,
    nextFollowUpDate: "2026-07-17",
    ownerName: "Molly",
    createdAt: "2026-07-10T09:20:00+12:00",
  },
  {
    id: "opp-paperandtwine-mothers",
    companyId: "co-paper-twine",
    title: "Mother's Day Pre-Order",
    stage: "quoted",
    estimatedValue: 920,
    nextFollowUpDate: "2026-07-19",
    ownerName: "Molly",
    createdAt: "2026-07-05T10:00:00+12:00",
  },
  {
    id: "opp-bondi-welcome",
    companyId: "co-bondi-tech",
    title: "Client Onboarding Welcome Jars",
    stage: "quoted",
    estimatedValue: 1750,
    nextFollowUpDate: "2026-07-25",
    ownerName: "Molly",
    createdAt: "2026-07-11T12:10:00+10:00",
  },
  // Won
  {
    id: "opp-greatsouthern-winterlaunch",
    companyId: "co-great-southern",
    title: "Winter Launch Order",
    stage: "won",
    estimatedValue: 4950,
    nextFollowUpDate: null,
    ownerName: "Molly",
    createdAt: "2026-06-18T08:30:00+10:00",
  },
  {
    id: "opp-quirkynook-autumn",
    companyId: "co-quirky-nook",
    title: "Autumn Restock",
    stage: "won",
    estimatedValue: 610,
    nextFollowUpDate: null,
    ownerName: "Molly",
    createdAt: "2026-06-02T13:50:00+12:00",
  },
  // Lost
  {
    id: "opp-alpine-anniversary",
    companyId: "co-alpine-property",
    title: "Staff Anniversary Gifts",
    stage: "lost",
    estimatedValue: 1300,
    nextFollowUpDate: null,
    ownerName: "Molly",
    createdAt: "2026-06-25T14:05:00+12:00",
  },
];

export function getOpportunityById(id: string) {
  return opportunities.find((opportunity) => opportunity.id === id);
}

export function getOpportunitiesByCompanyId(companyId: string) {
  return opportunities.filter((opportunity) => opportunity.companyId === companyId);
}

export const stageLabels: Record<Opportunity["stage"], string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export const stageOrder: Opportunity["stage"][] = ["new", "contacted", "quoted", "won", "lost"];
