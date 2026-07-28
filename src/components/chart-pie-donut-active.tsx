"use client"

import { DollarSign } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
import type { PieSectorShapeProps } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A donut chart with an active sector for spending breakdown of user"

type SpendingSlice = { name: string; value: number; fill: string }

function buildConfigFromData(data: SpendingSlice[]): ChartConfig {
  const cfg: ChartConfig = {
    value: { label: "Spending" },
  }
  for (const d of data) {
    cfg[d.name] = { label: d.name, color: d.fill }
  }
  return cfg
}

export function ChartPieDonutActive({ data }: { data: SpendingSlice[] }) {
  const safeData =
    data?.length > 0
      ? [...data].sort((a, b) => b.value - a.value)
      : [
          { name: "Botox", value: 0, fill: "var(--chart-1)" },
          { name: "PRP", value: 0, fill: "var(--chart-2)" },
          { name: "Microneedling", value: 0, fill: "var(--chart-3)" },
          { name: "Other", value: 0, fill: "var(--chart-4)" },
        ]

  const total = safeData.reduce((sum, d) => sum + d.value, 0)
  const chartConfig = buildConfigFromData(safeData)
  const ACTIVE_INDEX = 0

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Investment Breakdown</CardTitle>
        <CardDescription>By treatment category (completed & scheduled)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[240px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={safeData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              shape={({
                index,
                outerRadius = 0,
                ...props
              }: PieSectorShapeProps) =>
                index === ACTIVE_INDEX ? (
                  <Sector {...props} outerRadius={outerRadius + 10} />
                ) : (
                  <Sector {...props} outerRadius={outerRadius} />
                )
              }
            >
              <Label
                value={`$${total.toLocaleString()}`}
                position="center"
                className="fill-foreground text-base font-semibold text-[#271024] dark:text-[#e3ae72]"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm border-t border-border/40 pt-4">
        <div className="flex items-center gap-2 leading-none font-medium text-[#271024] dark:text-[#e3ae72]">
          Total from completed & scheduled <DollarSign className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground text-xs">
          Hover to see category values
        </div>
      </CardFooter>
    </Card>
  )
}
