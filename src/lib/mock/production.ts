import type { ProductionJob } from "@/lib/types";

export const productionJobs: ProductionJob[] = [
  {
    id: "job-greatsouthern-chill",
    opportunityId: "opp-greatsouthern-winterlaunch",
    companyName: "Great Southern Wholesale",
    productName: "Chill Pills",
    quantity: 300,
    status: "in_progress",
    batchCode: "SD-2607-A",
    bestBeforeDate: "2027-07-12",
  },
  {
    id: "job-quirkynook-yourock",
    opportunityId: "opp-quirkynook-autumn",
    companyName: "The Quirky Nook",
    productName: "You Rock",
    quantity: 48,
    status: "qc_check",
    batchCode: "SD-2607-B",
    bestBeforeDate: "2027-07-10",
  },
  {
    id: "job-harbourcity-bearhugs",
    opportunityId: null,
    companyName: "Harbour City Insurance",
    productName: "Bear Hugs",
    quantity: 120,
    status: "ready_to_dispatch",
    batchCode: "SD-2606-C",
    bestBeforeDate: "2027-06-30",
  },
  {
    id: "job-kiwigift-dadjoke",
    opportunityId: "opp-kiwigift-q3",
    companyName: "Kiwi Gift Co. Distribution",
    productName: "Dad Joke Enhancers",
    quantity: 200,
    status: "not_started",
    batchCode: "SD-2607-D",
    bestBeforeDate: "2027-07-20",
  },
  {
    id: "job-saltsea-chill",
    opportunityId: "opp-saltsea-winter",
    companyName: "Salt & Sea Gifts",
    productName: "Chill Pills",
    quantity: 36,
    status: "not_started",
    batchCode: "SD-2607-E",
    bestBeforeDate: "2027-07-22",
  },
];

export const productionStatusLabels: Record<ProductionJob["status"], string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  qc_check: "QC Check",
  ready_to_dispatch: "Ready to Dispatch",
};
