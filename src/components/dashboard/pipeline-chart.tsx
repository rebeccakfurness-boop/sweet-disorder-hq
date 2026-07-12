"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { opportunitiesByStageChartData } from "@/lib/mock";
import { stageChartColors } from "@/lib/chart-colors";

interface ChartTooltipProps {
  active?: boolean;
  payload?: { payload: (typeof opportunitiesByStageChartData)[number] }[];
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-popover">
      <div className="flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: stageChartColors[item.stage as keyof typeof stageChartColors] }}
        />
        <span className="font-semibold text-foreground">{item.count}</span>
        <span className="text-muted-foreground">{item.label}</span>
      </div>
    </div>
  );
}

export function PipelineChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={opportunitiesByStageChartData}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        barCategoryGap="28%"
      >
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          allowDecimals={false}
          width={24}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {opportunitiesByStageChartData.map((entry) => (
            <Cell key={entry.stage} fill={stageChartColors[entry.stage]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
