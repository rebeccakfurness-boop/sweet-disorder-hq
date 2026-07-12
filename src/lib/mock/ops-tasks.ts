import type { OpsTask, OpsTaskHorizon } from "@/lib/types";

export const horizonOrder: OpsTaskHorizon[] = ["today", "this_week", "coming_up", "someday"];

export const horizonLabels: Record<OpsTaskHorizon, string> = {
  today: "Today",
  this_week: "This Week",
  coming_up: "Coming Up",
  someday: "Someday",
};

export const opsTasks: OpsTask[] = [
  // Today
  {
    id: "ops-1",
    title: "Finish OKI printer SOP documentation",
    tag: "Systems",
    dueDate: "2026-07-15",
    horizon: "today",
    completed: false,
  },
  {
    id: "ops-2",
    title: "Prep food verification paperwork for MPI audit",
    tag: "Compliance",
    dueDate: "2026-07-15",
    horizon: "today",
    completed: false,
  },
  {
    id: "ops-3",
    title: "Confirm Harbour City Insurance Christmas order sign-off",
    tag: "Wholesale",
    dueDate: "2026-07-15",
    horizon: "today",
    completed: false,
  },

  // This Week
  {
    id: "ops-4",
    title: "Set up Google Drive folder structure for Knowledge Hub",
    tag: "Systems",
    dueDate: "2026-07-17",
    horizon: "this_week",
    completed: false,
  },
  {
    id: "ops-5",
    title: "Configure HubSpot lists for corporate gifting campaign",
    tag: "Marketing",
    dueDate: "2026-07-18",
    horizon: "this_week",
    completed: false,
  },
  {
    id: "ops-6",
    title: "Update supplier compliance records — PackRight NZ",
    tag: "Compliance",
    dueDate: "2026-07-18",
    horizon: "this_week",
    completed: false,
  },
  {
    id: "ops-7",
    title: "Draft cleaning roster for August",
    tag: "Admin",
    dueDate: "2026-07-19",
    horizon: "this_week",
    completed: false,
  },

  // Coming Up
  {
    id: "ops-8",
    title: "Plan Christmas-in-July wholesale campaign",
    tag: "Marketing",
    dueDate: null,
    horizon: "coming_up",
    completed: false,
  },
  {
    id: "ops-9",
    title: "Corporate outreach — follow up with 5 dormant leads",
    tag: "Wholesale",
    dueDate: null,
    horizon: "coming_up",
    completed: false,
  },
  {
    id: "ops-10",
    title: "Review Xero integration requirements",
    tag: "Systems",
    dueDate: null,
    horizon: "coming_up",
    completed: false,
  },

  // Someday
  {
    id: "ops-11",
    title: "Explore co-packing partnership for overflow production",
    tag: "Wholesale",
    dueDate: null,
    horizon: "someday",
    completed: false,
  },
  {
    id: "ops-12",
    title: "Redesign product photography for website refresh",
    tag: "Marketing",
    dueDate: null,
    horizon: "someday",
    completed: false,
  },
];
