import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  className,
}: KpiCardProps) {
  return (
    <Card
      className={cn(
        "border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-[#271024] dark:text-[#e3ae72]">
          {value}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <p
            className={cn(
              "mt-2 text-xs font-medium",
              trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"
            )}
          >
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
