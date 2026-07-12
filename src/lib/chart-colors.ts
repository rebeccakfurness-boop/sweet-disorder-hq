import type { OpportunityStage, OpsTaskHorizon } from "@/lib/types";

// Validated with the dataviz palette validator (light mode, categorical, all checks pass).
export const stageChartColors: Record<OpportunityStage, string> = {
  new: "#ab602b",
  contacted: "#b87c14",
  quoted: "#d32240",
  won: "#138669",
  lost: "#c53326",
};

export const revenueChartColor = "#d32240";

// Decorative column-identity dots for the Business Operations board — reuses
// the same validated hues above rather than introducing a new palette.
export const opsHorizonColors: Record<OpsTaskHorizon, string> = {
  today: stageChartColors.quoted,
  this_week: stageChartColors.contacted,
  coming_up: stageChartColors.won,
  someday: stageChartColors.new,
};
