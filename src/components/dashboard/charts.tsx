"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const lineConfig = {
  treatments: { label: "Treatments", color: "var(--chart-1)" },
  revenue: { label: "Revenue", color: "var(--chart-2)" },
  newClients: { label: "New", color: "var(--chart-3)" },
  returning: { label: "Returning", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function TreatmentTimelineChart({
  data,
}: {
  data: { month: string; treatments: number }[];
}) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Treatment History</CardTitle>
        <CardDescription>How often you book treatments over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={lineConfig} className="h-[240px] w-full">
          <LineChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="treatments"
              stroke="var(--color-treatments)"
              strokeWidth={2}
              dot={{ fill: "var(--color-treatments)" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function SpendingPieChart({
  data,
}: {
  data: { name: string; value: number; fill: string }[];
}) {
  const pieConfig = Object.fromEntries(
    data.map((d) => [d.name, { label: d.name, color: d.fill }])
  ) satisfies ChartConfig;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Spending Breakdown</CardTitle>
        <CardDescription>By treatment category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={pieConfig} className="mx-auto h-[240px] w-full max-w-sm">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={2}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function RevenueTrendChart({
  data,
}: {
  data: { week: string; revenue: number }[];
}) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Revenue Trend</CardTitle>
        <CardDescription>Weekly income from completed visits</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={lineConfig} className="h-[240px] w-full">
          <LineChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{ fill: "var(--color-revenue)" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function BookingsBarChart({
  data,
}: {
  data: { treatment: string; count: number }[];
}) {
  const barConfig = {
    count: { label: "Bookings", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Bookings by Treatment</CardTitle>
        <CardDescription>Distribution across services</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={barConfig} className="h-[240px] w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="treatment"
              type="category"
              width={100}
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ClientGrowthChart({
  data,
}: {
  data: { month: string; newClients: number; returning: number }[];
}) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Client Growth</CardTitle>
        <CardDescription>New registrations by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={lineConfig} className="h-[240px] w-full">
          <LineChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="newClients"
              stroke="var(--color-newClients)"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function OccupancyHeatmap({
  days,
}: {
  days: { date: string; count: number; label: string }[];
}) {
  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Occupancy Heatmap</CardTitle>
        <CardDescription>Busier days appear darker (last 5 weeks)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const intensity = d.count / max;
            return (
              <div
                key={d.date}
                title={`${d.label}: ${d.count} booking(s)`}
                className="aspect-square rounded-md border border-border/40 transition-transform hover:scale-105"
                style={{
                  backgroundColor: `color-mix(in oklch, var(--primary) ${Math.round(intensity * 85 + 10)}%, transparent)`,
                }}
              />
            );
          })}
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Quiet</span>
          <span>Busy</span>
        </div>
      </CardContent>
    </Card>
  );
}
