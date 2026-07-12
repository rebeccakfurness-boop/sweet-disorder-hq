import type { ProductionStaffMember } from "@/lib/types";

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

// "Today" in the production narrative — Wednesday, so there's a completed
// day either side of it to demonstrate both the done state and the
// look-ahead preview in the same week.
export const TODAY_LABEL = "Wed 15 Jul";

export interface WeeklyScheduleDay {
  id: string;
  staff: ProductionStaffMember;
  day: Weekday;
  date: string;
  tasks: string[];
  completed: boolean;
}

// Deliberately excludes "today" (Wed) — that day is rendered straight from
// the live checklist data in employee-checklist.tsx so the two views can
// never drift out of sync with each other.
export const weeklySchedule: WeeklyScheduleDay[] = [
  // Ange
  {
    id: "wk-ange-mon",
    staff: "Ange",
    day: "Mon",
    date: "13 Jul",
    completed: true,
    tasks: ["Corporate Gifting Restock — Bear Hugs dispatch", "Cleaning roster — filling room", "Restock jars & lids"],
  },
  {
    id: "wk-ange-tue",
    staff: "Ange",
    day: "Tue",
    date: "14 Jul",
    completed: true,
    tasks: ["Retail Stockist Top-up — QC & pack", "Calibration check — filling line", "Label printer maintenance"],
  },
  {
    id: "wk-ange-thu",
    staff: "Ange",
    day: "Thu",
    date: "16 Jul",
    completed: false,
    tasks: ["Dispatch — Christmas Corporate Order", "Print run — Kiwi Gift Co. relabel request", "Batch check — You Rock"],
  },
  {
    id: "wk-ange-fri",
    staff: "Ange",
    day: "Fri",
    date: "17 Jul",
    completed: false,
    tasks: ["Weekly stocktake — jars & lids", "Cleaning roster — filling room", "Restock label stock for Monday"],
  },

  // Charlie
  {
    id: "wk-charlie-mon",
    staff: "Charlie",
    day: "Mon",
    date: "13 Jul",
    completed: true,
    tasks: ["Corporate Gifting Restock — final QC", "Calibration check — capping machine", "Restock cartons & tape"],
  },
  {
    id: "wk-charlie-tue",
    staff: "Charlie",
    day: "Tue",
    date: "14 Jul",
    completed: true,
    tasks: ["Batch check — Dad Joke Enhancers", "Print run — wholesale refill labels", "Cleaning roster — packing bench"],
  },
  {
    id: "wk-charlie-thu",
    staff: "Charlie",
    day: "Thu",
    date: "16 Jul",
    completed: false,
    tasks: ["Dispatch — bulk Bullshit Blockers run", "Start Distribution Refresh batch", "Restock consumables"],
  },
  {
    id: "wk-charlie-fri",
    staff: "Charlie",
    day: "Fri",
    date: "17 Jul",
    completed: false,
    tasks: ["Wholesale Refill Batch — fill & pack", "Weekly stocktake — labels & lids", "Book courier pickup"],
  },
];

export function getWeeklyScheduleForStaff(staff: ProductionStaffMember): WeeklyScheduleDay[] {
  return weeklySchedule.filter((entry) => entry.staff === staff);
}
