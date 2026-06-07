"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, DollarSign, MessageSquare, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Inquiry {
  id: string;
  serviceId: string;
  service: {
    id: string;
    title: string;
    description: string;
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
}

interface Props {
  inquiries: Inquiry[];
  onUpdate: (inquiries: Inquiry[]) => void;
}

const statusConfig = {
  PENDING: {
    label: "Pending Review",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    description: "We're reviewing your inquiry and will send you a quote soon.",
  },
  QUOTED: {
    label: "Price Quote Received",
    className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
    description: "You've received a price quote. Review and respond below.",
  },
  ACCEPTED: {
    label: "Accepted - Booked",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    description: "Great! Your booking has been confirmed.",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
    description: "You declined this quote.",
  },
  COUNTERED: {
    label: "Counter-offer Sent",
    className: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
    description: "Your counter-offer is under review.",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20",
    description: "This inquiry has been cancelled.",
  },
};

export function UserInquiriesSection({ inquiries, onUpdate }: Props) {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [counterDialogOpen, setCounterDialogOpen] = useState(false);
  const [counterOffer, setCounterOffer] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcceptQuote = async (inquiry: Inquiry) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: inquiry.id,
          action: "acceptQuote",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Refresh inquiries
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to accept quote:", error);
    }
  };

  const handleDeclineQuote = async (inquiry: Inquiry) => {
    if (!confirm("Are you sure you want to decline this quote?")) return;

    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: inquiry.id,
          action: "declineQuote",
        }),
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to decline quote:", error);
    }
  };

  const handleSubmitCounterOffer = async () => {
    if (!selectedInquiry || !counterOffer) return;

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

      if (res.ok) {
        setCounterDialogOpen(false);
        setCounterOffer("");
        setCounterNote("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to send counter-offer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (inquiries.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-[#271024] dark:text-[#e3ae72] flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            My Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No inquiries yet</p>
            <p className="text-sm mt-1">Your service inquiries will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-[#271024] dark:text-[#e3ae72] flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            My Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {inquiries.map((inquiry) => {
            const config = statusConfig[inquiry.status];
            const showActions = inquiry.status === "QUOTED";

            return (
              <div
                key={inquiry.id}
                className="p-4 rounded-lg border border-border/60 bg-card hover:shadow-sm transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#271024] dark:text-[#e3ae72]">
                      {inquiry.service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Submitted {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={cn("border-0", config.className)}>
                    {config.label}
                  </Badge>
                </div>

                {/* Status Description */}
                <p className="text-sm text-muted-foreground mb-3">
                  {config.description}
                </p>

                {/* Price Quote Section */}
                {inquiry.proposedPrice && (
                  <div className="bg-[#271024]/5 dark:bg-[#e3ae72]/10 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-[#271024] dark:text-[#e3ae72]" />
                      <span className="font-medium text-[#271024] dark:text-[#e3ae72]">
                        ${inquiry.proposedPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(inquiry.proposedDate)}
                      {inquiry.proposedTime && (
                        <>
                          <span>•</span>
                          <Clock className="h-3.5 w-3.5" />
                          {inquiry.proposedTime}
                        </>
                      )}
                    </div>
                    {inquiry.adminResponse && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        "{inquiry.adminResponse}"
                      </p>
                    )}
                  </div>
                )}

                {/* Counter-offer Section */}
                {inquiry.status === "COUNTERED" && inquiry.counterOffer && (
                  <div className="bg-purple-500/10 dark:bg-purple-500/20 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                      Your counter-offer: ${inquiry.counterOffer.toFixed(2)}
                    </p>
                    {inquiry.counterNote && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Note: {inquiry.counterNote}
                      </p>
                    )}
                  </div>
                )}

                {/* Booking Link */}
                {inquiry.bookingId && (
                  <div className="bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Booking created successfully!
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-emerald-700 dark:text-emerald-400"
                      onClick={() => (window.location.href = "/user-dashboard")}
                    >
                      View in your appointments
                    </Button>
                  </div>
                )}

                {/* Actions */}
                {showActions && (
                  <div className="flex gap-2 pt-2 border-t border-border/40">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptQuote(inquiry)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
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
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Counter Offer Dialog */}
      <Dialog open={counterDialogOpen} onOpenChange={setCounterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#271024] dark:text-[#e3ae72]">
              Send Counter-Offer
            </DialogTitle>
            <DialogDescription>
              Propose your preferred price for{" "}
              {selectedInquiry?.service.title}. We'll review your offer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="counterOffer">Your Offer ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="counterOffer"
                  type="number"
                  placeholder="150"
                  value={counterOffer}
                  onChange={(e) => setCounterOffer(e.target.value)}
                  className="pl-10"
                />
              </div>
              {selectedInquiry?.proposedPrice && (
                <p className="text-xs text-muted-foreground">
                  Original quote: ${selectedInquiry.proposedPrice.toFixed(2)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="counterNote">Note (Optional)</Label>
              <Textarea
                id="counterNote"
                placeholder="Let us know why this price works better for you..."
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCounterDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCounterOffer}
              disabled={!counterOffer || isSubmitting}
              className="bg-[#271024] text-white hover:bg-[#271024]/90 dark:bg-[#e3ae72] dark:text-[#271024]"
            >
              {isSubmitting ? "Sending..." : "Send Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
