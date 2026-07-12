import type { ScheduleEntry, Weekday } from "@/lib/types";

export const weekdays: Weekday[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const scheduleEntries: ScheduleEntry[] = [
  // Monday
  { id: "sch-1", staff: "Ange", day: "Monday", label: "Pack Christmas Corporate Order", productionJobId: "job-harbourcity-xmas" },
  { id: "sch-2", staff: "Ange", day: "Monday", label: "QC Bear Hugs restock", productionJobId: "job-harbourcity-bearhugs" },
  { id: "sch-3", staff: "Charlie", day: "Monday", label: "Dispatch Corporate Gifting Restock", productionJobId: "job-harbourcity-bearhugs" },
  { id: "sch-4", staff: "Charlie", day: "Monday", label: "Label Chill Pills wholesale run", productionJobId: "job-greatsouthern-refill" },

  // Tuesday
  { id: "sch-5", staff: "Ange", day: "Tuesday", label: "Fill You Rock jars — Quirky Nook", productionJobId: "job-quirkynook-yourock" },
  { id: "sch-6", staff: "Ange", day: "Tuesday", label: "QC check — Quirky Nook order", productionJobId: "job-quirkynook-yourock" },
  { id: "sch-7", staff: "Charlie", day: "Tuesday", label: "Bulk Bullshit Blockers production", productionJobId: "job-greatsouthern-bsblockers" },

  // Wednesday
  { id: "sch-8", staff: "Ange", day: "Wednesday", label: "Christmas Order — final assembly", productionJobId: "job-harbourcity-xmas" },
  { id: "sch-9", staff: "Charlie", day: "Wednesday", label: "Bullshit Blockers — QC & pack", productionJobId: "job-greatsouthern-bsblockers" },
  { id: "sch-10", staff: "Charlie", day: "Wednesday", label: "Print labels for wholesale refill", productionJobId: "job-greatsouthern-refill" },

  // Thursday
  { id: "sch-11", staff: "Ange", day: "Thursday", label: "Dispatch Christmas Corporate Order", productionJobId: "job-harbourcity-xmas" },
  { id: "sch-12", staff: "Charlie", day: "Thursday", label: "Dispatch bulk Bullshit Blockers", productionJobId: "job-greatsouthern-bsblockers" },
  { id: "sch-13", staff: "Charlie", day: "Thursday", label: "Start Dad Joke Enhancers batch", productionJobId: "job-kiwigift-dadjoke" },

  // Friday
  { id: "sch-14", staff: "Ange", day: "Friday", label: "Fill Chill Pills — Salt & Sea Gifts", productionJobId: "job-saltsea-chill" },
  { id: "sch-15", staff: "Charlie", day: "Friday", label: "Continue Dad Joke Enhancers batch", productionJobId: "job-kiwigift-dadjoke" },
];
