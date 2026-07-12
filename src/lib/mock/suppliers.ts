import type { Supplier } from "@/lib/types";

export const suppliers: Supplier[] = [
  {
    id: "sup-clearview",
    name: "Clearview Glass Co.",
    category: "Glass Jars",
    contactName: "Steve Lombardi",
    contactEmail: "steve@clearviewglass.co.nz",
    lastOrderDate: "2026-06-28",
    complianceStatus: "compliant",
  },
  {
    id: "sup-silverdale-print",
    name: "Silverdale Print & Label",
    category: "Labels",
    contactName: "Nadia Osei",
    contactEmail: "nadia@silverdaleprint.co.nz",
    lastOrderDate: "2026-07-05",
    complianceStatus: "compliant",
  },
  {
    id: "sup-packright",
    name: "PackRight NZ",
    category: "Packaging & Boxes",
    contactName: "Tom Baker",
    contactEmail: "tom@packright.co.nz",
    lastOrderDate: "2026-06-15",
    complianceStatus: "needs_update",
  },
  {
    id: "sup-sweetfillings",
    name: "Sweet Fillings Ltd",
    category: "Confectionery & Ingredients",
    contactName: "Rachel Yun",
    contactEmail: "rachel@sweetfillings.co.nz",
    lastOrderDate: "2026-07-01",
    complianceStatus: "compliant",
  },
  {
    id: "sup-oki",
    name: "OKI Data NZ",
    category: "Printer & Label Hardware",
    contactName: "Support Team",
    contactEmail: "support@okidata.co.nz",
    lastOrderDate: "2026-05-20",
    complianceStatus: "compliant",
  },
];

export const supplierComplianceLabels: Record<Supplier["complianceStatus"], string> = {
  compliant: "Compliant",
  needs_update: "Needs Update",
};
