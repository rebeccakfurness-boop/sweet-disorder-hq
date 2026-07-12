"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { revenueQuotedByMonthChartData } from "@/lib/mock";
import { revenueChartColor } from "@/lib/chart-colors";
import { formatCurrencyNZD } from "@/lib/utils";

interface ChartTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-popover">
      <p className="mb-1 font-medium text-muted-foreground">{label} 2026</p>
      <div className="flex items-center gap-1.5">
        <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: revenueChartColor }} />
        <span className="font-semibold text-foreground">
          {formatCurrencyNZD(Number(payload[0].value))}
        </span>
        <span className="text-muted-foreground">quoted</span>
      </div>
    </div>
  );
}

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={revenueQuotedByMonthChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={revenueChartColor} stopOpacity={0.18} />
            <stop offset="100%" stopColor={revenueChartColor} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="0" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          tickFormatter={(value) => `$${value / 1000}k`}
          width={48}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={revenueChartColor}
          strokeWidth={2}
          fill="url(#revenueFill)"
          activeDot={{ r: 4, stroke: "hsl(var(--card))", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
