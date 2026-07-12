import type { StaffTask } from "@/lib/types";

export const tasks: StaffTask[] = [
  {
    id: "task-1",
    title: "Follow up with Harbour City Insurance re: Christmas order",
    assignedTo: "Molly",
    companyId: "co-harbour-city",
    dueDate: "2026-07-12",
    completed: false,
  },
  {
    id: "task-2",
    title: "Call Great Southern Wholesale about new range pricing",
    assignedTo: "Ana",
    companyId: "co-great-southern",
    dueDate: "2026-07-12",
    completed: false,
  },
  {
    id: "task-3",
    title: "Review Bondi Tech Collective proposal before sending",
    assignedTo: "Molly",
    companyId: "co-bondi-tech",
    dueDate: "2026-07-13",
    completed: false,
  },
  {
    id: "task-4",
    title: "Print Chill Pills labels for the wholesale refill run",
    assignedTo: "Ange",
    companyId: "co-great-southern",
    dueDate: "2026-07-12",
    completed: false,
  },
  {
    id: "task-5",
    title: "Pack Corporate Order #2419",
    assignedTo: "Charlie",
    companyId: "co-harbour-city",
    dueDate: "2026-07-12",
    completed: false,
  },
  {
    id: "task-6",
    title: "Pack and dispatch The Quirky Nook restock",
    assignedTo: "Charlie",
    companyId: "co-quirky-nook",
    dueDate: "2026-07-12",
    completed: true,
  },
];
