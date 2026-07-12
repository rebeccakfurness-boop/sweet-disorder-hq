import { Target, FileClock, Trophy, CalendarClock } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { TodaysTasks } from "@/components/dashboard/todays-tasks";
import { dashboardStats } from "@/lib/mock";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Good morning, Molly"
        description="Here's what's moving across Sweet Disorder today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open Opportunities"
          value={String(dashboardStats.openOpportunities)}
          icon={Target}
          hint="Across new, contacted & quoted"
          accent="primary"
        />
        <StatCard
          label="Quotes Awaiting Response"
          value={String(dashboardStats.quotesAwaitingResponse)}
          icon={FileClock}
          hint="Sent, not yet accepted or declined"
          accent="mustard"
        />
        <StatCard
          label="Win Rate this Quarter"
          value={`${dashboardStats.winRateQuarter}%`}
          icon={Trophy}
          hint="Won vs. closed opportunities"
          accent="mint"
        />
        <StatCard
          label="Upcoming Follow-ups"
          value={String(dashboardStats.upcomingFollowUps)}
          icon={CalendarClock}
          hint="Opportunities with a date on the books"
          accent="primary"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Revenue quoted by month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Opportunities by stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineChart />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TodaysTasks />
        </div>
      </div>
    </div>
  );
}
