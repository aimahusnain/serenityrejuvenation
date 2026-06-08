"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  DollarSign,
  Download,
  Receipt,
  Search,
  Filter,
  CreditCard,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface PaymentHistoryProps {
  bookings: BookingLite[];
  products: ProductLite[];
}

type TimeFilter = "all" | "this_month" | "last_3_months" | "last_6_months" | "this_year" | "custom";
type SortOption = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

export function PaymentHistory({ bookings, products }: PaymentHistoryProps) {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("date_desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<ReturnType<typeof enrichBookings>[0] | null>(null);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const enriched = useMemo(() => enrichBookings(bookings, products), [bookings, products]);

  // Calculate statistics - all non-cancelled bookings
  const allPayments = useMemo(
    () => enriched.filter((b) => b.status !== "CANCELLED"),
    [enriched]
  );

  const totalPaid = useMemo(
    () => allPayments.filter((b) => b.status === "COMPLETED").reduce((sum, b) => sum + b.servicePrice, 0),
    [allPayments]
  );

  const pendingPayments = useMemo(
    () => allPayments.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED")
      .reduce((sum, b) => sum + b.servicePrice, 0),
    [allPayments]
  );

  const avgPayment = useMemo(() => {
    const paidCount = allPayments.filter((b) => b.status === "COMPLETED").length;
    if (paidCount === 0) return 0;
    return Math.round(totalPaid / paidCount);
  }, [allPayments, totalPaid]);

  // Payment by treatment type
  const paymentsByTreatment = useMemo(() => {
    const groups: Record<string, { count: number; total: number }> = {};
    allPayments.forEach((b) => {
      const cat = categorizeTreatment(b.serviceName);
      if (!groups[cat]) groups[cat] = { count: 0, total: 0 };
      groups[cat].count += 1;
      groups[cat].total += b.servicePrice;
    });
    return Object.entries(groups).map(([treatment, data]) => ({
      treatment,
      ...data,
    }));
  }, [allPayments]);

  // Recent payments
  const recentPayments = useMemo(() => {
    return [...allPayments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [allPayments]);

  // Filter and sort
  const filteredPayments = useMemo(() => {
    let filtered = [...allPayments];

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
    } else if (timeFilter === "custom" && (dateFrom || dateTo)) {
      // Custom date range filter
      filtered = filtered.filter((b) => {
        const d = new Date(b.date);
        if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          if (d < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          if (d > to) return false;
        }
        return true;
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((b) =>
        b.serviceName.toLowerCase().includes(query) ||
        b.id.toLowerCase().includes(query) ||
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
        case "amount_asc":
          return a.servicePrice - b.servicePrice;
        case "amount_desc":
          return b.servicePrice - a.servicePrice;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allPayments, timeFilter, sortOption, searchQuery, dateFrom, dateTo]);

  const handleExport = (format: "csv") => {
    if (format === "csv") {
      const headers = ["Invoice ID", "Date", "Treatment", "Status", "Amount", "Notes"];
      const rows = filteredPayments.map((b) => [
        b.id.slice(0, 12).toUpperCase(),
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
      link.setAttribute("download", `payment-history-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setExportDialogOpen(false);
  };

  const generateInvoice = (payment: ReturnType<typeof enrichBookings>[0]) => {
    const invoiceNumber = `INV-${payment.id.slice(0, 8).toUpperCase()}`;
    const invoiceDate = new Date(payment.date);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() - 7); // Due 7 days before appointment

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 700px; margin: 0 auto; background: #f9f9f9; }
          .invoice { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: bold; color: #271024; }
          .logo span { color: #e3ae72; }
          .invoice-info { text-align: right; }
          .invoice-number { font-size: 18px; font-weight: bold; color: #271024; }
          .invoice-date { color: #666; margin-top: 5px; }

          .section { margin-bottom: 30px; }
          .section-title { font-size: 12px; font-weight: bold; color: #999; text-transform: uppercase; margin-bottom: 10px; }

          .bill-to { color: #333; }
          .bill-to p { margin: 5px 0; }

          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { text-align: left; padding: 12px; background: #f9f9f9; font-weight: 600; color: #271024; border-bottom: 2px solid #e3ae72; }
          td { padding: 12px; border-bottom: 1px solid #eee; }
          .text-right { text-align: right; }

          .totals { margin-top: 30px; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; }
          .total-row.final { font-size: 20px; font-weight: bold; color: #271024; border-top: 2px solid #271024; padding-top: 20px; margin-top: 10px; }

          .status { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .status-PAID { background: #d4edda; color: #155724; }
          .status-PENDING { background: #fff3cd; color: #856404; }

          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="logo">
              Serenity<span>Rejuvenation</span>
            </div>
            <div class="invoice-info">
              <div class="invoice-number">${invoiceNumber}</div>
              <div class="invoice-date">
                Invoice Date: ${invoiceDate.toLocaleDateString()}<br>
                Due Date: ${dueDate.toLocaleDateString()}
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Bill To</div>
            <div class="bill-to">
              <p><strong>Guest Patient</strong></p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Service Details</div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Date</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${payment.serviceName}</td>
                  <td>${invoiceDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${invoiceDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td class="text-right">$${payment.servicePrice.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>$${payment.servicePrice.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div class="total-row final">
              <span>Total</span>
              <span>$${payment.servicePrice.toFixed(2)}</span>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <span class="status status-${payment.status === "COMPLETED" ? "PAID" : "PENDING"}">
              ${payment.status === "COMPLETED" ? "✓ PAID IN FULL" : "○ PAYMENT PENDING"}
            </span>
          </div>

          ${payment.notes ? `
          <div class="section" style="margin-top: 30px;">
            <div class="section-title">Notes</div>
            <p style="color: #666;">${payment.notes}</p>
          </div>
          ` : ""}

          <div class="footer">
            <p>Thank you for choosing Serenity Rejuvenation Med Spa</p>
            <p>This invoice was generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#271024] dark:text-[#e3ae72] font-serif">
            Payment History
          </h1>
          <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/65 mt-1">
            Track your payments, invoices, and transaction history
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-[#271024]/20 dark:border-[#e3ae72]/30"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[#271024] dark:text-[#e3ae72]">
                  Export Payment History
                </DialogTitle>
                <DialogDescription>
                  Download your complete payment history
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#271024]/20 dark:border-[#e3ae72]/30"
                  onClick={() => handleExport("csv")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                  <span className="ml-auto text-xs text-muted-foreground">Spreadsheet format</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            className="bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
            onClick={() => router.push("/user-dashboard/book")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book New Treatment
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#271024]/40 dark:text-[#e3ae72]/40" />
              <Input
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#271024]/20 dark:border-[#e3ae72]/30"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Time Filter */}
              <Select value={timeFilter} onValueChange={(v: TimeFilter) => setTimeFilter(v)}>
                <SelectTrigger className="w-[160px] border-[#271024]/20 dark:border-[#e3ae72]/30">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                  <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {/* Custom Date Range */}
              {timeFilter === "custom" && (
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-35 border-[#271024]/20 dark:border-[#e3ae72]/30"
                  />
                  <span className="text-[#271024]/60 dark:text-[#e3ae72]/60">to</span>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-35 border-[#271024]/20 dark:border-[#e3ae72]/30"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="border-[#271024]/20 dark:border-[#e3ae72]/30"
                  >
                    Clear
                  </Button>
                </div>
              )}

              {/* Sort */}
              <Select value={sortOption} onValueChange={(v: SortOption) => setSortOption(v)}>
                <SelectTrigger className="w-35 border-[#271024]/20 dark:border-[#e3ae72]/30">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Newest First</SelectItem>
                  <SelectItem value="date_asc">Oldest First</SelectItem>
                  <SelectItem value="amount_desc">Highest Amount</SelectItem>
                  <SelectItem value="amount_asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Paid */}
        <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm bg-linear-to-br from-[#271024]/5 to-[#e3ae72]/5 dark:from-[#e3ae72]/10 dark:to-[#271024]/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#271024]/10 dark:bg-[#e3ae72]/20">
                <DollarSign className="h-5 w-5 text-[#271024] dark:text-[#e3ae72]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#271024] dark:text-[#e3ae72]">
                  ${totalPaid.toLocaleString()}
                </p>
                <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">Total Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#271024] dark:text-[#e3ae72]">
                  ${pendingPayments.toLocaleString()}
                </p>
                <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Payment */}
        <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#271024] dark:text-[#e3ae72]">
                  ${avgPayment.toLocaleString()}
                </p>
                <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">Avg. Payment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Payments */}
        <Card className="lg:col-span-2 border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Recent Payments</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No payment history yet
              </div>
            ) : (
              <div className="space-y-3">
                {recentPayments.map((payment) => (
                  <RecentPaymentCard
                    key={payment.id}
                    payment={payment}
                    onViewInvoice={() => {
                      setSelectedPayment(payment);
                      setInvoiceDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spending by Treatment */}
        <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Spending by Treatment</CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentsByTreatment.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data yet
              </div>
            ) : (
              paymentsByTreatment.map((item) => {
                const maxTotal = Math.max(...paymentsByTreatment.map((p) => p.total));
                const percentage = Math.round((item.total / maxTotal) * 100);

                return (
                  <div key={item.treatment} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#271024] dark:text-[#e3ae72]">
                        {item.treatment}
                      </span>
                      <div className="flex items-center gap-2 text-[#271024]/60 dark:text-[#e3ae72]/60">
                        <span>${item.total.toLocaleString()}</span>
                        <span className="text-xs">({item.count}x)</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-[#271024]/10 dark:bg-[#e3ae72]/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-[#271024] to-[#e3ae72]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Complete Payment History */}
      <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#271024] dark:text-[#e3ae72]">All Transactions</CardTitle>
          <CardDescription>
            {filteredPayments.length} payment{filteredPayments.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CreditCard className="h-16 w-16 text-[#271024]/20 dark:text-[#e3ae72]/20 mb-4" />
              <h3 className="text-xl font-semibold text-[#271024] dark:text-[#e3ae72] mb-2">
                No payment history yet
              </h3>
              <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/65 max-w-sm mb-6">
                Your payment history will appear here after booking treatments.
              </p>
              <Button
                className="bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
                onClick={() => router.push("/user-dashboard/book")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Your First Treatment
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[#271024]/10 dark:divide-[#e3ae72]/20">
              {filteredPayments.map((payment) => (
                <PaymentRecordCard
                  key={payment.id}
                  payment={payment}
                  onViewInvoice={() => {
                    setSelectedPayment(payment);
                    setInvoiceDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Dialog */}
      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-[#271024] dark:text-[#e3ae72]">Invoice</DialogTitle>
            <DialogDescription>
              {selectedPayment?.serviceName} - Invoice #{selectedPayment?.id.slice(0, 8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto border border-[#271024]/10 dark:border-[#e3ae72]/20 rounded-lg">
            {selectedPayment && (
              <iframe
                srcDoc={generateInvoice(selectedPayment)}
                className="w-full h-125 border-0"
                title="Invoice"
              />
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-[#271024]/20 dark:border-[#e3ae72]/30">
                Close
              </Button>
            </DialogClose>
            <Button
              className="bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
              onClick={() => {
                if (selectedPayment) {
                  const printWindow = window.open("", "_blank");
                  if (printWindow) {
                    printWindow.document.write(generateInvoice(selectedPayment));
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => printWindow.print(), 250);
                  }
                }
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download / Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Recent Payment Card
function RecentPaymentCard({
  payment,
  onViewInvoice,
}: {
  payment: ReturnType<typeof enrichBookings>[0];
  onViewInvoice: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-[#271024]/10 dark:border-[#e3ae72]/20 hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          payment.status === "COMPLETED" ? "bg-emerald-500/10" : "bg-amber-500/10"
        )}>
          {payment.status === "COMPLETED" ? (
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-[#271024] dark:text-[#e3ae72]">
            {payment.serviceName}
          </p>
          <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">
            {new Date(payment.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#271024] dark:text-[#e3ae72]">
          ${payment.servicePrice.toFixed(2)}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onViewInvoice}
          className="text-[#271024]/60 dark:text-[#e3ae72]/60 hover:text-[#271024] dark:hover:text-[#e3ae72]"
        >
          <Receipt className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Payment Record Card
function PaymentRecordCard({
  payment,
  onViewInvoice,
}: {
  payment: ReturnType<typeof enrichBookings>[0];
  onViewInvoice: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "p-4 sm:p-6 transition-all hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/5 max-w-2xl",
        isExpanded && "bg-[#271024]/5 dark:bg-[#e3ae72]/5"
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 max-w-2xl">
        <div className="space-y-3 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-[#271024] dark:text-[#e3ae72]">
                  {payment.serviceName}
                </h3>
                <Badge className={cn(
                  "border-0",
                  payment.status === "COMPLETED"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                )}>
                  {payment.status === "COMPLETED" ? "✓ Paid" : "⏳ Pending"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#271024]/60 dark:text-[#e3ae72]/60">
                <span>Invoice: #{payment.id.slice(0, 8).toUpperCase()}</span>
                <span>•</span>
                <span>{new Date(payment.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#271024] dark:text-[#e3ae72]">
                ${payment.servicePrice.toFixed(2)}
              </p>
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-2 pt-3 border-t border-[#271024]/10 dark:border-[#e3ae72]/20 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#271024]/60 dark:text-[#e3ae72]/60">Treatment Date: </span>
                  <span className="text-[#271024] dark:text-[#e3ae72]">
                    {new Date(payment.date).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[#271024]/60 dark:text-[#e3ae72]/60">Payment Method: </span>
                  <span className="text-[#271024] dark:text-[#e3ae72]">
                    Credit Card
                  </span>
                </div>
                {payment.notes && (
                  <div className="col-span-2 pt-2">
                    <span className="text-[#271024]/60 dark:text-[#e3ae72]/60">Notes: </span>
                    <span className="text-[#271024] dark:text-[#e3ae72]">{payment.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex sm:flex-col gap-2 lg:items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewInvoice}
            className="border-[#271024]/20 dark:border-[#e3ae72]/30"
          >
            <Receipt className="mr-2 h-4 w-4" />
            Invoice
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#271024]/60 dark:text-[#e3ae72]/60 hover:text-[#271024] dark:hover:text-[#e3ae72]"
          >
            {isExpanded ? "Show Less" : "Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
