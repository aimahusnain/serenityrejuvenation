"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  Receipt,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  Award,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { BookingLite, ProductLite, BookingStatus } from "@/lib/dashboard";
import { enrichBookings, parsePrice, categorizeTreatment } from "@/lib/dashboard";

interface TreatmentsHistoryProps {
  bookings: BookingLite[];
  products: ProductLite[];
}

type TimeFilter = "all" | "this_month" | "last_3_months" | "last_6_months" | "this_year" | "custom";
type SortOption = "date_desc" | "date_asc" | "price_desc" | "price_asc" | "name_asc";

export function TreatmentsHistory({ bookings, products }: TreatmentsHistoryProps) {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("date_desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Debug: Log incoming data
  console.log("TreatmentsHistory - bookings:", bookings);
  console.log("TreatmentsHistory - products:", products);

  const enriched = useMemo(() => {
    const result = enrichBookings(bookings, products);
    console.log("TreatmentsHistory - enriched bookings:", result);
    return result;
  }, [bookings, products]);

  // Calculate statistics - include ALL bookings for comprehensive history
  const completedBookings = useMemo(() => {
    // For treatment history, show all bookings except cancelled ones
    return enriched.filter((b) => b.status !== "CANCELLED");
  }, [enriched]);

  const totalSpent = useMemo(
    () => completedBookings.reduce((sum, b) => sum + b.servicePrice, 0),
    [completedBookings]
  );

  const averageCost = useMemo(() => {
    if (completedBookings.length === 0) return 0;
    return Math.round(totalSpent / completedBookings.length);
  }, [completedBookings, totalSpent]);

  const treatmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    completedBookings.forEach((b) => {
      const cat = categorizeTreatment(b.serviceName);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [completedBookings]);

  const mostFrequentTreatment = useMemo(() => {
    const entries = Object.entries(treatmentCounts);
    if (entries.length === 0) return null;
    return entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }, [treatmentCounts]);

  // Spending by month
  const spendingByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    completedBookings.forEach((b) => {
      const d = new Date(b.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = (months[key] || 0) + b.servicePrice;
    });
    return Object.entries(months)
      .map(([month, amount]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        amount,
      }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6);
  }, [completedBookings]);

  // Filter and sort bookings - show all non-cancelled bookings
  const filteredBookings = useMemo(() => {
    // Start with all non-cancelled bookings
    let filtered = [...enriched].filter((b) => b.status !== "CANCELLED");

    // Time filter
    const now = new Date();
    if (timeFilter === "this_month") {
      filtered = filtered.filter((b) => {
        const d = new Date(b.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (timeFilter === "last_3_months") {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      filtered = filtered.filter((b) => new Date(b.date) >= threeMonthsAgo);
    } else if (timeFilter === "last_6_months") {
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      filtered = filtered.filter((b) => new Date(b.date) >= sixMonthsAgo);
    } else if (timeFilter === "this_year") {
      filtered = filtered.filter((b) => new Date(b.date).getFullYear() === now.getFullYear());
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((b) =>
        b.serviceName.toLowerCase().includes(query) ||
        b.notes?.toLowerCase().includes(query) ||
        new Date(b.date).toLocaleDateString().toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "date_asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date_desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "price_asc":
          return a.servicePrice - b.servicePrice;
        case "price_desc":
          return b.servicePrice - a.servicePrice;
        case "name_asc":
          return a.serviceName.localeCompare(b.serviceName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [enriched, timeFilter, sortOption, searchQuery]);

  const handleExport = (format: "pdf" | "csv") => {
    if (format === "csv") {
      // Generate CSV
      const headers = ["Date", "Treatment", "Status", "Amount Paid", "Notes"];
      const rows = filteredBookings.map((b) => [
        new Date(b.date).toLocaleDateString(),
        b.serviceName,
        b.status,
        `$${b.servicePrice.toFixed(2)}`,
        b.notes || "",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `treatment-history-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === "pdf") {
      // Generate PDF by opening print dialog with formatted content
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Treatment History - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #7a219f; border-bottom: 2px solid #efcafe; padding-bottom: 10px; }
            .stats { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
            .stat { text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #7a219f; }
            .stat-label { font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f9f9f9; font-weight: 600; color: #7a219f; }
            .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .status-COMPLETED { background: #d4edda; color: #155724; }
            .status-CONFIRMED { background: #d1ecf1; color: #0c5460; }
            .status-PENDING { background: #fff3cd; color: #856404; }
            .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Treatment History Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>

          <div class="stats">
            <div class="stat">
              <div class="stat-value">$${totalSpent.toLocaleString()}</div>
              <div class="stat-label">Total Invested</div>
            </div>
            <div class="stat">
              <div class="stat-value">${averageCost > 0 ? "$" + averageCost.toLocaleString() : "$0"}</div>
              <div class="stat-label">Average Cost</div>
            </div>
            <div class="stat">
              <div class="stat-value">${completedBookings.length}</div>
              <div class="stat-label">Total Treatments</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Treatment</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredBookings.map((b) => `
                <tr>
                  <td>${new Date(b.date).toLocaleDateString()}</td>
                  <td>${b.serviceName}</td>
                  <td><span class="status status-${b.status}">${b.status}</span></td>
                  <td>$${b.servicePrice.toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Serenity Rejuvenation Med Spa</p>
            <p>This is an official record of your treatment history.</p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
      }
    }
    setExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#7a219f] dark:text-[#efcafe] font-serif">
            Treatment History
          </h1>
          <p className="text-sm text-[#7a219f]/60 dark:text-[#efcafe]/65 mt-1">
            Your complete wellness journey and investment
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-[#7a219f]/20 dark:border-[#efcafe]/30"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[#7a219f] dark:text-[#efcafe]">
                  Export Treatment History
                </DialogTitle>
                <DialogDescription>
                  Choose a format to export your complete treatment history
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#7a219f]/20 dark:border-[#efcafe]/30"
                  onClick={() => handleExport("pdf")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                  <span className="ml-auto text-xs text-muted-foreground">Detailed report</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#7a219f]/20 dark:border-[#efcafe]/30"
                  onClick={() => handleExport("csv")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                  <span className="ml-auto text-xs text-muted-foreground">For spreadsheets</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            className="bg-[#7a219f] hover:bg-[#7a219f]/90 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
            onClick={() => router.push("/user-dashboard/book")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book New Treatment
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a219f]/40 dark:text-[#efcafe]/40" />
              <Input
                placeholder="Search treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#7a219f]/20 dark:border-[#efcafe]/30"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Time Filter */}
              <Select value={timeFilter} onValueChange={(v: TimeFilter) => setTimeFilter(v)}>
                <SelectTrigger className="w-[160px] border-[#7a219f]/20 dark:border-[#efcafe]/30">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                  <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortOption} onValueChange={(v: SortOption) => setSortOption(v)}>
                <SelectTrigger className="w-[140px] border-[#7a219f]/20 dark:border-[#efcafe]/30">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Newest First</SelectItem>
                  <SelectItem value="date_asc">Oldest First</SelectItem>
                  <SelectItem value="price_desc">Highest Price</SelectItem>
                  <SelectItem value="price_asc">Lowest Price</SelectItem>
                  <SelectItem value="name_asc">A-Z Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Spent */}
        <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20 shadow-sm bg-gradient-to-br from-[#7a219f]/5 to-[#efcafe]/5 dark:from-[#efcafe]/10 dark:to-[#7a219f]/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#7a219f]/10 dark:bg-[#efcafe]/20">
                <DollarSign className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#7a219f] dark:text-[#efcafe]">
                  ${totalSpent.toLocaleString()}
                </p>
                <p className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">Total Invested</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Cost */}
        <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#7a219f] dark:text-[#efcafe]">
                  ${averageCost.toLocaleString()}
                </p>
                <p className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">Avg. per Treatment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Treatments */}
        <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#7a219f] dark:text-[#efcafe]">
                  {completedBookings.length}
                </p>
                <p className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">Total Treatments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Frequent */}
        <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-[#7a219f] dark:text-[#efcafe] truncate max-w-[120px]">
                  {mostFrequentTreatment || "—"}
                </p>
                <p className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">Most Popular</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Treatment Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spending by Treatment Type */}
        <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">Treatment Breakdown</CardTitle>
            <CardDescription>Your favorite treatments and their costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(treatmentCounts).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No treatment data yet
              </div>
            ) : (
              Object.entries(treatmentCounts).map(([treatment, count]) => {
                const treatmentBookings = completedBookings.filter((b) =>
                  categorizeTreatment(b.serviceName) === treatment
                );
                const totalForTreatment = treatmentBookings.reduce(
                  (sum, b) => sum + b.servicePrice,
                  0
                );
                const percentage = Math.round((totalForTreatment / totalSpent) * 100);

                return (
                  <div key={treatment} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#7a219f] dark:text-[#efcafe]">
                        {treatment}
                      </span>
                      <div className="flex items-center gap-3 text-[#7a219f]/60 dark:text-[#efcafe]/60">
                        <span>{count} treatments</span>
                        <span className="font-semibold text-[#7a219f] dark:text-[#efcafe]">
                          ${totalForTreatment.toLocaleString()}
                        </span>
                        <span className="text-xs">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-[#7a219f]/10 dark:bg-[#efcafe]/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7a219f] to-[#efcafe]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Monthly Spending Trend */}
        <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">Monthly Spending</CardTitle>
            <CardDescription>Your investment over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {spendingByMonth.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No spending data yet
              </div>
            ) : (
              <div className="space-y-3">
                {spendingByMonth.map((item) => {
                  const maxAmount = Math.max(...spendingByMonth.map((s) => s.amount));
                  const percentage = Math.round((item.amount / maxAmount) * 100);

                  return (
                    <div key={item.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#7a219f]/70 dark:text-[#efcafe]/70">
                          {item.month}
                        </span>
                        <span className="font-semibold text-[#7a219f] dark:text-[#efcafe]">
                          ${item.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[#7a219f]/10 dark:bg-[#efcafe]/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#7a219f] dark:bg-[#efcafe]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Treatment History List */}
      <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">Complete History</CardTitle>
          <CardDescription>
            {filteredBookings.length} treatment{filteredBookings.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="h-16 w-16 text-[#7a219f]/20 dark:text-[#efcafe]/20 mb-4" />
              <h3 className="text-xl font-semibold text-[#7a219f] dark:text-[#efcafe] mb-2">
                No treatments yet
              </h3>
              <p className="text-sm text-[#7a219f]/60 dark:text-[#efcafe]/65 max-w-sm mb-6">
                Your treatments will appear here. Book your first treatment to start tracking!
              </p>
              <Button
                className="bg-[#7a219f] hover:bg-[#7a219f]/90 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
                onClick={() => router.push("/user-dashboard/book")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Your First Treatment
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[#7a219f]/10 dark:divide-[#efcafe]/20">
              {filteredBookings.map((booking) => (
                <TreatmentRecordCard
                  key={booking.id}
                  booking={booking}
                  onViewReceipt={() => {
                    setSelectedTreatment(booking.id);
                    setReceiptDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#7a219f] dark:text-[#efcafe]">Treatment Receipt</DialogTitle>
            <DialogDescription>
              {selectedTreatment &&
                enriched.find((b) => b.id === selectedTreatment)?.serviceName}
            </DialogDescription>
          </DialogHeader>
          {selectedTreatment && (
            <div className="space-y-4 py-4">
              {(() => {
                const booking = enriched.find((b) => b.id === selectedTreatment);
                if (!booking) return null;

                return (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#7a219f]/60 dark:text-[#efcafe]/60">Date</span>
                      <span className="font-medium text-[#7a219f] dark:text-[#efcafe]">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7a219f]/60 dark:text-[#efcafe]/60">Treatment</span>
                      <span className="font-medium text-[#7a219f] dark:text-[#efcafe]">
                        {booking.serviceName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7a219f]/60 dark:text-[#efcafe]/60">Amount Paid</span>
                      <span className="font-semibold text-[#7a219f] dark:text-[#efcafe]">
                        ${booking.servicePrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-[#7a219f]/10 dark:border-[#efcafe]/20">
                      <div className="flex justify-between text-base">
                        <span className="font-semibold text-[#7a219f] dark:text-[#efcafe]">Total</span>
                        <span className="font-bold text-[#7a219f] dark:text-[#efcafe]">
                          ${booking.servicePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-[#7a219f]/20 dark:border-[#efcafe]/30">
                Close
              </Button>
            </DialogClose>
            <Button
              className="bg-[#7a219f] hover:bg-[#7a219f]/90 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
              onClick={() => {
                const booking = enriched.find((b) => b.id === selectedTreatment);
                if (!booking) return;

                const receiptContent = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Receipt - ${booking.serviceName}</title>
                    <style>
                      body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
                      .header { text-align: center; margin-bottom: 30px; }
                      .header h1 { color: #7a219f; margin: 0; }
                      .header p { color: #666; margin: 5px 0 0; }
                      .receipt-box { border: 2px dashed #efcafe; padding: 30px; border-radius: 8px; }
                      .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                      .row:last-child { border-bottom: none; }
                      .label { color: #666; }
                      .value { font-weight: 600; color: #7a219f; }
                      .total { font-size: 24px; color: #7a219f; }
                      .footer { margin-top: 30px; text-align: center; color: #999; font-size: 12px; }
                      .badge { display: inline-block; padding: 5px 10px; background: #d4edda; color: #155724; border-radius: 4px; font-size: 12px; }
                    </style>
                  </head>
                  <body>
                    <div class="header">
                      <h1>🧾 Treatment Receipt</h1>
                      <p>Serenity Rejuvenation Med Spa</p>
                    </div>

                    <div class="receipt-box">
                      <div class="row">
                        <span class="label">Date</span>
                        <span class="value">${new Date(booking.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <div class="row">
                        <span class="label">Time</span>
                        <span class="value">${new Date(booking.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <div class="row">
                        <span class="label">Treatment</span>
                        <span class="value">${booking.serviceName}</span>
                      </div>
                      <div class="row">
                        <span class="label">Status</span>
                        <span class="badge">${booking.status}</span>
                      </div>
                      ${booking.notes ? `
                      <div class="row">
                        <span class="label">Notes</span>
                        <span class="value">${booking.notes}</span>
                      </div>
                      ` : ""}
                      <div class="row" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #7a219f;">
                        <span class="label">Total Paid</span>
                        <span class="value total">$${booking.servicePrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div class="footer">
                      <p>Receipt ID: ${booking.id.slice(0, 12).toUpperCase()}</p>
                      <p>Generated on ${new Date().toLocaleDateString()}</p>
                      <p>Thank you for choosing Serenity Rejuvenation!</p>
                    </div>
                  </body>
                  </html>
                `;

                const printWindow = window.open("", "_blank");
                if (printWindow) {
                  printWindow.document.write(receiptContent);
                  printWindow.document.close();
                  printWindow.focus();
                  setTimeout(() => printWindow.print(), 250);
                }
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Treatment Record Card Component
function TreatmentRecordCard({
  booking,
  onViewReceipt,
}: {
  booking: ReturnType<typeof enrichBookings>[0];
  onViewReceipt: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const appointmentDate = new Date(booking.date);

  return (
    <div
      className={cn(
        "p-4 sm:p-6 transition-all hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/5",
        isExpanded && "bg-[#7a219f]/5 dark:bg-[#efcafe]/5"
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Main Info */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-[#7a219f] dark:text-[#efcafe]">
                {booking.serviceName}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-[#7a219f]/60 dark:text-[#efcafe]/60">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {appointmentDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {appointmentDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#7a219f] dark:text-[#efcafe]">
                ${booking.servicePrice.toLocaleString()}
              </p>
              <p className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">Paid</p>
            </div>
          </div>

          {/* Expandable Details */}
          {isExpanded && (
            <div className="space-y-2 pt-3 border-t border-[#7a219f]/10 dark:border-[#efcafe]/20">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#7a219f]/60 dark:text-[#efcafe]/60">Treatment ID</span>
                  <span className="text-[#7a219f] dark:text-[#efcafe] font-mono text-xs">
                    {booking.id.slice(0, 12)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a219f]/60 dark:text-[#efcafe]/60">Booking Date</span>
                  <span className="text-[#7a219f] dark:text-[#efcafe]">
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a219f]/60 dark:text-[#efcafe]/60">Status</span>
                  <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20">
                    ✓ Completed
                  </Badge>
                </div>
                {booking.notes && (
                  <div className="pt-2">
                    <span className="text-[#7a219f]/60 dark:text-[#efcafe]/60">Notes: </span>
                    <span className="text-[#7a219f] dark:text-[#efcafe]">{booking.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 lg:items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewReceipt}
            className="border-[#7a219f]/20 dark:border-[#efcafe]/30"
          >
            <Receipt className="mr-2 h-4 w-4" />
            Receipt
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#7a219f]/60 dark:text-[#efcafe]/60 hover:text-[#7a219f] dark:hover:text-[#efcafe]"
          >
            {isExpanded ? "Show Less" : "Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
