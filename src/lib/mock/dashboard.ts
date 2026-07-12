import { opportunities, stageLabels, stageOrder } from "./opportunities";
import { quotes } from "./quotes";

export const dashboardStats = {
  openOpportunities: opportunities.filter((o) =>
    ["new", "contacted", "quoted"].includes(o.stage)
  ).length,
  quotesAwaitingResponse: quotes.filter((q) => q.status === "sent").length,
  winRateQuarter: (() => {
    const closed = opportunities.filter((o) => o.stage === "won" || o.stage === "lost");
    const won = closed.filter((o) => o.stage === "won").length;
    return closed.length === 0 ? 0 : Math.round((won / closed.length) * 100);
  })(),
  upcomingFollowUps: opportunities.filter((o) => o.nextFollowUpDate !== null).length,
};

export const opportunitiesByStageChartData = stageOrder.map((stage) => ({
  stage,
  label: stageLabels[stage],
  count: opportunities.filter((o) => o.stage === stage).length,
}));

export const revenueQuotedByMonthChartData = [
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 15600 },
  { month: "Mar", revenue: 13900 },
  { month: "Apr", revenue: 18200 },
  { month: "May", revenue: 21500 },
  { month: "Jun", revenue: 19800 },
  { month: "Jul", revenue: 23100 },
];
