"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Clock, DollarSign, MessageSquare, X, MoreVertical, Filter, Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Inquiry {
  id: string;
  serviceId: string;
  service: {
    id: string;
    title: string;
    description: string;
    image?: string;
  };
  status: "PENDING" | "QUOTED" | "ACCEPTED" | "DECLINED" | "COUNTERED" | "CANCELLED";
  proposedPrice: number | null;
  proposedDate: string | null;
  proposedTime: string | null;
  counterOffer: number | null;
  counterNote: string | null;
  adminResponse: string | null;
  bookingId: string | null;
  createdAt: string;
  notes: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
}

interface Props {
  inquiries: Inquiry[];
}

const statusConfig = {
  PENDING: {
    label: "Pending Review",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    description: "We're reviewing your inquiry and will send you a quote soon.",
    icon: "⏳",
  },
  QUOTED: {
    label: "Price Quote Received",
    className: "bg-[#efcafe]/15 text-[#7a219f] dark:text-[#efcafe] border-[#efcafe]/30",
    description: "You've received a price quote. Review and respond below.",
    icon: "💰",
  },
  ACCEPTED: {
    label: "Accepted - Booked",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    description: "Great! Your booking has been confirmed.",
    icon: "✅",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
    description: "You declined this quote.",
    icon: "❌",
  },
  COUNTERED: {
    label: "Counter-offer Sent",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    description: "Your counter-offer is under review.",
    icon: "🤝",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20",
    description: "This inquiry has been cancelled.",
    icon: "🚫",
  },
};

const filterOptions = [
  { value: "all", label: "All Inquiries" },
  { value: "PENDING", label: "Pending" },
  { value: "QUOTED", label: "Awaiting Response" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "DECLINED", label: "Declined" },
  { value: "COUNTERED", label: "Countered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function UserInquiriesPage({ inquiries }: Props) {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [counterDialogOpen, setCounterDialogOpen] = useState(false);
  const [counterOffer, setCounterOffer] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter inquiries based on status
  const filteredInquiries =
    selectedStatus === "all"
      ? inquiries
      : inquiries.filter((inquiry) => inquiry.status === selectedStatus);

  const handleAcceptQuote = async (inquiry: Inquiry) => {
    setActionLoading(inquiry.id);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: inquiry.id,
          action: "acceptQuote",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Quote accepted! Booking confirmed.", {
          description: "Check your appointments for details.",
        });
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to accept quote");
      }
    } catch (error) {
      toast.error("Failed to accept quote. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineQuote = async (inquiry: Inquiry) => {
    setActionLoading(inquiry.id);
    if (!confirm("Are you sure you want to decline this quote?")) {
      setActionLoading(null);
      return;
    }

    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: inquiry.id,
          action: "declineQuote",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Quote declined", {
          description: "Let us know if you have any other questions.",
        });
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to decline quote");
      }
    } catch (error) {
      toast.error("Failed to decline quote. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitCounterOffer = async () => {
    if (!selectedInquiry || !counterOffer) {
      toast.error("Please enter a counter offer amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: selectedInquiry.id,
          action: "sendCounterOffer",
          counterOffer: parseFloat(counterOffer),
          counterNote,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Counter-offer sent!", {
          description: "We'll review your offer and get back to you.",
        });
        setCounterDialogOpen(false);
        setCounterOffer("");
        setCounterNote("");
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to send counter-offer");
      }
    } catch (error) {
      toast.error("Failed to send counter-offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelInquiry = async (inquiry: Inquiry) => {
    setActionLoading(inquiry.id);
    if (!confirm("Are you sure you want to cancel this inquiry?")) {
      setActionLoading(null);
      return;
    }

    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: inquiry.id,
          action: "cancelInquiry",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Inquiry cancelled");
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to cancel inquiry");
      }
    } catch (error) {
      toast.error("Failed to cancel inquiry. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (inquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-[#7a219f] dark:text-[#efcafe] mb-2">
            No inquiries yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Your service inquiries will appear here
          </p>
          <Button
            onClick={() => (window.location.href = "/user-dashboard/book")}
            className="bg-[#7a219f] hover:bg-[#7a219f]/90 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
          >
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7a219f] dark:text-[#efcafe]">
            My Inquiries
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your service inquiries and quotes
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-[#7a219f]/20 dark:border-[#efcafe]/30 rounded-lg bg-white dark:bg-[#7a219f] text-[#7a219f] dark:text-[#efcafe]"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = inquiries.filter((i) => i.status === status).length;
          return (
            <Card key={status} className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <p className="text-2xl font-bold text-[#7a219f] dark:text-[#efcafe]">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => {
          const config = statusConfig[inquiry.status];
          const showActions = inquiry.status === "QUOTED";
          const showBookingLink = inquiry.status === "ACCEPTED" && inquiry.bookingId;

          return (
            <Card
              key={inquiry.id}
              className="border-[#7a219f]/10 dark:border-[#efcafe]/20 bg-white dark:bg-[#7a219f]/50"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-[#7a219f] dark:text-[#efcafe] mb-1">
                      {inquiry.service.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Submitted on {formatDate(inquiry.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge className={cn("border-0", config.className)}>
                    {config.icon} {config.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Status Description */}
                <p className="text-sm text-muted-foreground">{config.description}</p>

                {/* Original Inquiry Details */}
                <div className="bg-[#7a219f]/5 dark:bg-[#efcafe]/5 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-[#7a219f] dark:text-[#efcafe]">
                    Your Request
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {inquiry.preferredDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Preferred:</span>
                        <span className="text-[#7a219f] dark:text-[#efcafe]/90">
                          {formatDate(inquiry.preferredDate)}
                        </span>
                      </div>
                    )}
                    {inquiry.preferredTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Time:</span>
                        <span className="text-[#7a219f] dark:text-[#efcafe]/90">
                          {inquiry.preferredTime}
                        </span>
                      </div>
                    )}
                  </div>
                  {inquiry.notes && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Notes:</span> {inquiry.notes}
                    </p>
                  )}
                </div>

                {/* Price Quote Section */}
                {inquiry.proposedPrice && (
                  <div className="bg-[#efcafe]/10 dark:bg-[#efcafe]/20 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#7a219f] dark:text-[#efcafe]">
                        Admin's Quote
                      </h4>
                      <Badge className="bg-[#efcafe] text-[#7a219f]">Quoted</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                      <span className="font-bold text-[#7a219f] dark:text-[#efcafe]">
                        ${inquiry.proposedPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {inquiry.proposedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(inquiry.proposedDate)}
                        </div>
                      )}
                      {inquiry.proposedTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {inquiry.proposedTime}
                        </div>
                      )}
                    </div>
                    {inquiry.adminResponse && (
                      <p className="text-sm italic text-muted-foreground border-t border-[#7a219f]/10 dark:border-[#efcafe]/20 pt-3">
                        "{inquiry.adminResponse}"
                      </p>
                    )}
                  </div>
                )}

                {/* Counter-offer Section */}
                {inquiry.status === "COUNTERED" && inquiry.counterOffer && (
                  <div className="bg-amber-500/10 dark:bg-amber-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                        Your Counter-Offer
                      </h4>
                      <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30">
                        Pending Review
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <span className="font-bold text-amber-700 dark:text-amber-400">
                        ${inquiry.counterOffer.toFixed(2)}
                      </span>
                    </div>
                    {inquiry.counterNote && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Note: {inquiry.counterNote}
                      </p>
                    )}
                  </div>
                )}

                {/* Booking Success */}
                {showBookingLink && (
                  <div className="bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          Booking Confirmed!
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Your appointment has been scheduled
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => (window.location.href = "/user-dashboard")}
                    >
                      View in Appointments
                    </Button>
                  </div>
                )}

                {/* Actions */}
                {showActions && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#7a219f]/10 dark:border-[#efcafe]/20">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptQuote(inquiry)}
                      disabled={actionLoading === inquiry.id}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {actionLoading === inquiry.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Accept Quote
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setCounterDialogOpen(true);
                      }}
                      className="flex-1"
                    >
                      Counter Offer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeclineQuote(inquiry)}
                      disabled={actionLoading === inquiry.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 flex-1"
                    >
                      {actionLoading === inquiry.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Decline"
                      )}
                    </Button>
                  </div>
                )}

                {/* More Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-[#7a219f]/10 dark:border-[#efcafe]/20 bg-white dark:bg-[#7a219f]">
                    {inquiry.status === "PENDING" && (
                      <DropdownMenuItem
                        onClick={() => handleCancelInquiry(inquiry)}
                        className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                      >
                        Cancel Inquiry
                      </DropdownMenuItem>
                    )}
                    {inquiry.bookingId && (
                      <DropdownMenuItem
                        onClick={() => (window.location.href = `/user-dashboard?view=appointments`)}
                      >
                        View Appointment
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => (window.location.href = "/user-dashboard/book")}
                    >
                      Book Another Service
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          );
        })}

        {filteredInquiries.length === 0 && (
          <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
            <CardContent className="py-12 text-center">
              <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                No inquiries found with status: {statusConfig[selectedStatus as keyof typeof statusConfig]?.label}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setSelectedStatus("all")}
              >
                View All Inquiries
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Counter Offer Dialog */}
      <Dialog open={counterDialogOpen} onOpenChange={setCounterDialogOpen}>
        <DialogContent className="border-[#7a219f]/10 dark:border-[#efcafe]/20 bg-white dark:bg-[#7a219f]">
          <DialogHeader>
            <DialogTitle className="text-[#7a219f] dark:text-[#efcafe]">
              Send Counter-Offer
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Propose your preferred price for {selectedInquiry?.service.title}. We'll review your
              offer and get back to you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-[#7a219f]/5 dark:bg-[#efcafe]/5 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Admin's quote:</p>
              <p className="text-2xl font-bold text-[#7a219f] dark:text-[#efcafe]">
                ${selectedInquiry?.proposedPrice?.toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="counterOffer" className="text-[#7a219f] dark:text-[#efcafe]">
                Your Offer ($)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="counterOffer"
                  type="number"
                  placeholder="150"
                  value={counterOffer}
                  onChange={(e) => setCounterOffer(e.target.value)}
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="counterNote" className="text-[#7a219f] dark:text-[#efcafe]">
                Note (Optional)
              </Label>
              <Textarea
                id="counterNote"
                placeholder="Let us know why this price works better for you..."
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCounterDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCounterOffer}
              disabled={!counterOffer || isSubmitting}
              className="bg-[#7a219f] text-white hover:bg-[#7a219f]/90 dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Offer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
