import type { OpportunityStage } from "@/lib/types";

// Validated with the dataviz palette validator (light mode, categorical, all checks pass).
export const stageChartColors: Record<OpportunityStage, string> = {
  new: "#ab602b",
  contacted: "#b87c14",
  quoted: "#d32240",
  won: "#138669",
  lost: "#c53326",
};

export const revenueChartColor = "#d32240";
