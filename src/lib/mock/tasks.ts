import type { StaffTask } from "@/lib/types";

export const tasks: StaffTask[] = [
  {
    id: "task-1",
    title: "Follow up with Harbour City Insurance re: Christmas order",
    companyId: "co-harbour-city",
    dueDate: "2026-07-12",
    completed: false,
  },
  {
    id: "task-2",
    title: "Confirm label stock for this week's printer run",
    companyId: null,
    dueDate: "2026-07-12",
    completed: false,
  },
  {
    id: "task-3",
    title: "Call Great Southern Wholesale about new range pricing",
    companyId: "co-great-southern",
    dueDate: "2026-07-12",
    completed: false,
  },
  {
    id: "task-4",
    title: "Pack and dispatch The Quirky Nook restock",
    companyId: "co-quirky-nook",
    dueDate: "2026-07-12",
    completed: true,
  },
  {
    id: "task-5",
    title: "Review Bondi Tech Collective proposal before sending",
    companyId: "co-bondi-tech",
    dueDate: "2026-07-13",
    completed: false,
  },
];
