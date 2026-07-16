import type { Integration } from "@/lib/types";

export const integrations: Integration[] = [
  {
    id: "shopify",
    name: "Shopify",
    category: "Ecommerce",
    description:
      "Sync orders, customers, and inventory from the Sweet Disorder storefront straight into Project HQ — so every retail sale shows up alongside your corporate pipeline.",
    status: "not_connected",
    capabilities: [
      "Pull orders in real time as they come through the storefront",
      "Keep stock levels in sync across retail and wholesale",
      "Auto-create production jobs from bulk storefront orders",
    ],
  },
  {
    id: "xero",
    name: "Xero",
    category: "Accounting",
    description:
      "Push accepted quotes straight to Xero as invoices, and pull payment status back so the CRM always reflects who's actually paid.",
    status: "not_connected",
    capabilities: [
      "Turn an accepted quote into a Xero invoice in one click",
      "Reflect paid/overdue status back on the company record",
      "Keep wholesale and corporate revenue reporting in one place",
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Marketing",
    description:
      "Two-way sync between Project HQ's corporate CRM and HubSpot's marketing lists — so nurture campaigns and sales follow-ups never fall out of step.",
    status: "not_connected",
    capabilities: [
      "Sync corporate contacts into marketing email lists",
      "Feed opportunity stage changes into HubSpot workflows",
      "Track email engagement back on the company timeline",
    ],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    category: "Documents",
    description:
      "Power the Knowledge Hub straight from your existing Drive folder — SOPs, policies, and training docs, with no re-uploading.",
    status: "not_connected",
    capabilities: [
      "Sync a chosen Drive folder into the Knowledge Hub, kept up to date automatically",
      "Auto-file generated quotes into a shared Drive folder",
      "Attach supplier compliance docs directly to their record",
    ],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    category: "Documents",
    description:
      "Power Supplier Records straight from the shared Sweet Disorder supplier spreadsheet — items, suppliers, and cost prices, always current.",
    status: "not_connected",
    capabilities: [
      "Sync the Items and Suppliers tabs into Project HQ automatically",
      "Reflect new rows and edits on the next sync — no manual re-entry",
      "Keep cost-price data private behind the same Google sign-in as Drive",
    ],
  },
  {
    id: "oki-printer",
    name: "OKI Printer & Label System",
    category: "Production",
    description:
      "Send batch codes and best-before dates straight to the OKI label printer on the production floor — no more manually retyping label runs.",
    status: "not_connected",
    capabilities: [
      "Queue label print runs directly from a production job",
      "Auto-generate batch codes and best-before dates",
      "Track which labels have been printed per job",
    ],
  },
];

export const integrationStatusLabels: Record<Integration["status"], string> = {
  not_connected: "Not Connected",
  connected: "Connected",
  coming_soon: "Coming Soon",
};
