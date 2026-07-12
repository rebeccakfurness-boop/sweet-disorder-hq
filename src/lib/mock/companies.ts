import type { Company, Contact } from "@/lib/types";

export const companies: Company[] = [
  {
    id: "co-harbour-city",
    name: "Harbour City Insurance",
    type: "corporate",
    region: "Auckland",
    country: "New Zealand",
    website: "harbourcityinsurance.co.nz",
    notes:
      "Corporate gifting for ~140 staff. Ordered client gifts last Christmas, keen to make it an annual thing. Prefers invoicing over card payment.",
    lastActivityAt: "2026-07-10T09:20:00+12:00",
  },
  {
    id: "co-alpine-property",
    name: "Alpine Property Group",
    type: "corporate",
    region: "Queenstown",
    country: "New Zealand",
    website: "alpinepropertygroup.co.nz",
    notes:
      "Boutique real estate agency, gifts settled clients on completion. Small but frequent orders through the year.",
    lastActivityAt: "2026-07-08T14:05:00+12:00",
  },
  {
    id: "co-bondi-tech",
    name: "Bondi Tech Collective",
    type: "corporate",
    region: "Sydney, NSW",
    country: "Australia",
    website: "bonditechcollective.com.au",
    notes:
      "Fast-growing startup, big on wellbeing culture. First-time enquiry via the contact form — Molly met their Head of People at a conference.",
    lastActivityAt: "2026-07-11T11:40:00+10:00",
  },
  {
    id: "co-kiwi-gift-co",
    name: "Kiwi Gift Co. Distribution",
    type: "wholesale",
    region: "Hamilton",
    country: "New Zealand",
    website: "kiwigiftco.co.nz",
    notes:
      "Distributes to ~40 gift shops across the North Island. Reorders quarterly, always asks about new flavours first.",
    lastActivityAt: "2026-07-09T16:15:00+12:00",
  },
  {
    id: "co-great-southern",
    name: "Great Southern Wholesale",
    type: "wholesale",
    region: "Melbourne, VIC",
    country: "Australia",
    website: "greatsouthernwholesale.com.au",
    notes:
      "Our biggest AU wholesale account. Handles customs/import themselves. Very responsive, pays on time.",
    lastActivityAt: "2026-07-11T08:30:00+10:00",
  },
  {
    id: "co-paper-twine",
    name: "Paper & Twine",
    type: "retail_stockist",
    region: "Devonport, Auckland",
    country: "New Zealand",
    website: "paperandtwine.co.nz",
    notes: "Lovely little gift boutique on the wharf. Loyal stockist since we launched.",
    lastActivityAt: "2026-07-05T10:00:00+12:00",
  },
  {
    id: "co-quirky-nook",
    name: "The Quirky Nook",
    type: "retail_stockist",
    region: "Ponsonby, Auckland",
    country: "New Zealand",
    website: "thequirkynook.co.nz",
    notes: "Quick to sell through, especially Chill Pills and Bear Hugs. Good Instagram tagging habits.",
    lastActivityAt: "2026-07-11T13:50:00+12:00",
  },
  {
    id: "co-salt-sea",
    name: "Salt & Sea Gifts",
    type: "retail_stockist",
    region: "Mount Maunganui",
    country: "New Zealand",
    website: "saltandseagifts.co.nz",
    notes: "Seasonal foot traffic — restocks hard before summer and Christmas.",
    lastActivityAt: "2026-07-06T15:30:00+12:00",
  },
];

export const contacts: Contact[] = [
  {
    id: "ct-harbour-city-1",
    companyId: "co-harbour-city",
    name: "Aroha Ngata",
    title: "People & Culture Lead",
    email: "aroha.ngata@harbourcityinsurance.co.nz",
    phone: "09 555 0148",
    isPrimary: true,
  },
  {
    id: "ct-alpine-1",
    companyId: "co-alpine-property",
    name: "Jack Sinclair",
    title: "Office Manager",
    email: "jack@alpinepropertygroup.co.nz",
    phone: "03 442 0119",
    isPrimary: true,
  },
  {
    id: "ct-bondi-1",
    companyId: "co-bondi-tech",
    name: "Chloe Bennett",
    title: "Head of People",
    email: "chloe.bennett@bonditechcollective.com.au",
    phone: "+61 2 8022 4471",
    isPrimary: true,
  },
  {
    id: "ct-kiwigift-1",
    companyId: "co-kiwi-gift-co",
    name: "Mereana Wilson",
    title: "Purchasing Manager",
    email: "mereana@kiwigiftco.co.nz",
    phone: "07 838 4420",
    isPrimary: true,
  },
  {
    id: "ct-greatsouthern-1",
    companyId: "co-great-southern",
    name: "Daniel Kovac",
    title: "Senior Buyer",
    email: "daniel.kovac@greatsouthernwholesale.com.au",
    phone: "+61 3 9021 5588",
    isPrimary: true,
  },
  {
    id: "ct-paperandtwine-1",
    companyId: "co-paper-twine",
    name: "Isla Thompson",
    title: "Owner",
    email: "isla@paperandtwine.co.nz",
    phone: "09 445 2210",
    isPrimary: true,
  },
  {
    id: "ct-quirkynook-1",
    companyId: "co-quirky-nook",
    name: "Ben Ahern",
    title: "Owner",
    email: "ben@thequirkynook.co.nz",
    phone: "09 378 6641",
    isPrimary: true,
  },
  {
    id: "ct-saltandsea-1",
    companyId: "co-salt-sea",
    name: "Grace Huang",
    title: "Owner",
    email: "grace@saltandseagifts.co.nz",
    phone: "07 574 9903",
    isPrimary: true,
  },
];

export function getCompanyById(id: string) {
  return companies.find((company) => company.id === id);
}

export function getContactsByCompanyId(companyId: string) {
  return contacts.filter((contact) => contact.companyId === companyId);
}

export const companyTypeLabels: Record<Company["type"], string> = {
  corporate: "Corporate",
  wholesale: "Wholesale",
  retail_stockist: "Retail Stockist",
};
