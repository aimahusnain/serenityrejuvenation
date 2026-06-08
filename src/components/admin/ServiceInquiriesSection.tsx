"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
  Trash2,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string | null;
  preferredTime: string | null;
  notes: string | null;
  status: "PENDING" | "QUOTED" | "ACCEPTED" | "DECLINED" | "COUNTERED" | "CANCELLED";
  proposedPrice: number | null;
  proposedDate: string | null;
  proposedTime: string | null;
  counterOffer: number | null;
  counterNote: string | null;
  adminResponse: string | null;
  createdAt: string;
  service: {
    id: string;
    title: string;
    description: string;
  };
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface Props {
  inquiries: Inquiry[];
  onUpdate: (inquiries: Inquiry[]) => void;
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  QUOTED: {
    label: "Quote Sent",
    className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
  },
  COUNTERED: {
    label: "Countered",
    className: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20",
  },
};

export default function ServiceInquiriesSection({ inquiries, onUpdate }: Props) {
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [counterDialogOpen, setCounterDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<"all" | "PENDING" | "QUOTED" | "COUNTERED">("all");

  // Quote form state
  const [quotePrice, setQuotePrice] = useState("");
  const [quoteDate, setQuoteDate] = useState("");
  const [quoteTime, setQuoteTime] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Counter response form state
  const [acceptCounter, setAcceptCounter] = useState(true);
  const [newPrice, setNewPrice] = useState("");
  const [counterResponse, setCounterResponse] = useState("");

  const filteredInquiries =
    filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  const statusCounts = {
    all: inquiries.length,
    PENDING: inquiries.filter((i) => i.status === "PENDING").length,
    QUOTED: inquiries.filter((i) => i.status === "QUOTED").length,
    COUNTERED: inquiries.filter((i) => i.status === "COUNTERED").length,
  };

  const openQuoteDialog = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setQuotePrice(inquiry.proposedPrice?.toString() || "");
    setQuoteDate(inquiry.proposedDate || inquiry.preferredDate || "");
    setQuoteTime(inquiry.proposedTime || inquiry.preferredTime || "");
    setQuoteMessage("");
    setQuoteDialogOpen(true);
  };

  const openCounterDialog = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setAcceptCounter(true);
    setNewPrice("");
    setCounterResponse("");
    setCounterDialogOpen(true);
  };

  const handleSubmitQuote = async () => {
    if (!selectedInquiry || !quotePrice) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: selectedInquiry.id,
          action: "proposeQuote",
          proposedPrice: parseFloat(quotePrice),
          proposedDate: quoteDate || null,
          proposedTime: quoteTime || null,
          message: quoteMessage || null,
        }),
      });

      if (res.ok) {
        setQuoteDialogOpen(false);
        window.location.reload();
      } else {
        const error = await res.json().catch(() => ({ error: "Failed to send quote" }));
        alert(error.error || "Failed to send quote. Please try again.");
      }
    } catch (error) {
      console.error("Failed to submit quote:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCounterResponse = async () => {
    if (!selectedInquiry) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: selectedInquiry.id,
          action: "respondToCounter",
          acceptCounter,
          newPrice: acceptCounter ? null : parseFloat(newPrice),
          message: counterResponse || null,
        }),
      });

      if (res.ok) {
        setCounterDialogOpen(false);
        window.location.reload();
      } else {
        const error = await res.json().catch(() => ({ error: "Failed to respond" }));
        alert(error.error || "Failed to respond. Please try again.");
      }
    } catch (error) {
      console.error("Failed to respond to counter:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInquiry = async () => {
    if (!selectedInquiry) return;

    try {
      const response = await fetch(`/api/inquiries?id=${selectedInquiry.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedInquiries = inquiries.filter((i) => i.id !== selectedInquiry.id);
        onUpdate(updatedInquiries);
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
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

  return (
    <>
      <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#271024] dark:text-[#e3ae72] flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Service Inquiries
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage appointment requests and price negotiations
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Filter Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {(["all", "PENDING", "QUOTED", "COUNTERED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  filter === status
                    ? "bg-[#271024] text-white dark:bg-[#e3ae72] dark:text-[#271024]"
                    : "bg-[#271024]/5 text-[#271024]/70 dark:bg-[#e3ae72]/10 dark:text-[#e3ae72]/70 hover:bg-[#271024]/10"
                )}
              >
                {status === "all" ? "All" : statusConfig[status].label}
                <span className="ml-1.5 opacity-70">({statusCounts[status]})</span>
              </button>
            ))}
          </div>

          {/* Inquiries List */}
          <div className="space-y-3">
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-[#271024]/30 dark:text-[#e3ae72]/30 mb-4" />
                <p className="text-muted-foreground">
                  {filter === "all"
                    ? "No inquiries yet"
                    : `No ${statusConfig[filter as keyof typeof statusConfig]?.label.toLowerCase()} inquiries`}
                </p>
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="p-4 rounded-lg border border-[#271024]/10 dark:border-[#e3ae72]/20 bg-white dark:bg-[#271024]/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Service & Status */}
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#271024] dark:text-[#e3ae72]">
                          {inquiry.service.title}
                        </h3>
                        <Badge className={cn("border-0", statusConfig[inquiry.status].className)}>
                          {statusConfig[inquiry.status].label}
                        </Badge>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="flex items-center gap-2 text-[#271024]/70 dark:text-[#e3ae72]/70">
                          <span className="font-medium">{inquiry.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {inquiry.email}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {inquiry.phone}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          Pref: {formatDate(inquiry.preferredDate)}
                          {inquiry.preferredTime && (
                            <>
                              <span>•</span>
                              <Clock className="h-3.5 w-3.5" />
                              {inquiry.preferredTime}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      {inquiry.notes && (
                        <div className="text-sm text-muted-foreground italic">
                          "{inquiry.notes}"
                        </div>
                      )}

                      {/* Current Quote */}
                      {inquiry.proposedPrice && (
                        <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium text-blue-700 dark:text-blue-400">
                              Your quote: ${inquiry.proposedPrice.toFixed(2)}
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
                            <p className="text-xs text-muted-foreground mt-2">
                              Your note: "{inquiry.adminResponse}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Counter Offer */}
                      {inquiry.status === "COUNTERED" && inquiry.counterOffer && (
                        <div className="bg-purple-500/10 dark:bg-purple-500/20 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              <span className="font-medium text-purple-700 dark:text-purple-400">
                                Counter: ${inquiry.counterOffer.toFixed(2)}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => openCounterDialog(inquiry)}
                            >
                              Respond
                            </Button>
                          </div>
                          {inquiry.counterNote && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Customer note: "{inquiry.counterNote}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="text-xs text-muted-foreground">
                        Received {new Date(inquiry.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-[#271024] dark:text-[#e3ae72]"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-[#271024]/10 dark:border-[#e3ae72]/20 bg-white dark:bg-[#271024]"
                      >
                        {inquiry.status === "PENDING" && (
                          <DropdownMenuItem
                            onClick={() => openQuoteDialog(inquiry)}
                            className="cursor-pointer text-[#271024] dark:text-[#e3ae72]/80"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Send Price Quote
                          </DropdownMenuItem>
                        )}
                        {(inquiry.status === "PENDING" || inquiry.status === "QUOTED") && (
                          <DropdownMenuItem
                            onClick={() => openQuoteDialog(inquiry)}
                            className="cursor-pointer text-[#271024] dark:text-[#e3ae72]/80"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Update Quote
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            handleDeleteInquiry();
                          }}
                          className="cursor-pointer text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quote Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#271024] dark:text-[#e3ae72]">
              Send Price Quote
            </DialogTitle>
            <DialogDescription>
              Send a price quote for <strong>{selectedInquiry?.service.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Customer preference reminder */}
            <div className="bg-[#271024]/5 dark:bg-[#e3ae72]/10 rounded-lg p-3 text-sm">
              <p className="font-medium text-[#271024] dark:text-[#e3ae72]">
                Customer's preference:
              </p>
              <p className="text-muted-foreground">
                {selectedInquiry?.preferredDate ? formatDate(selectedInquiry.preferredDate) : "No date"} • {selectedInquiry?.preferredTime || "No time"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="quotePrice">Price ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="quotePrice"
                    type="number"
                    placeholder="150"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quoteTime">Time</Label>
                <select
                  id="quoteTime"
                  value={quoteTime}
                  onChange={(e) => setQuoteTime(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="">Select time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quoteDate">Date</Label>
              <Input
                id="quoteDate"
                type="date"
                value={quoteDate}
                onChange={(e) => setQuoteDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quoteMessage">Message to Customer (Optional)</Label>
              <Textarea
                id="quoteMessage"
                placeholder="Add a personal note..."
                value={quoteMessage}
                onChange={(e) => setQuoteMessage(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setQuoteDialogOpen(false)}
              className="border-[#271024]/20 dark:border-[#e3ae72]/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitQuote}
              disabled={!quotePrice || isSubmitting}
              className="bg-[#271024] text-white hover:bg-[#271024]/90 dark:bg-[#e3ae72] dark:text-[#271024]"
            >
              {isSubmitting ? "Sending..." : "Send Quote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Counter Response Dialog */}
      <Dialog open={counterDialogOpen} onOpenChange={setCounterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#271024] dark:text-[#e3ae72]">
              Respond to Counter-Offer
            </DialogTitle>
            <DialogDescription>
              Customer offered <strong>${selectedInquiry?.counterOffer?.toFixed(2)}</strong> for{" "}
              <strong>{selectedInquiry?.service.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedInquiry?.counterNote && (
              <div className="bg-purple-500/10 dark:bg-purple-500/20 rounded-lg p-3">
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  Customer note: "{selectedInquiry.counterNote}"
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Label>Choose Response:</Label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setAcceptCounter(true)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                    acceptCounter
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-border/60 hover:border-emerald-500/50"
                  )}
                >
                  <CheckCircle className={cn(
                    "h-5 w-5",
                    acceptCounter ? "text-emerald-600" : "text-muted-foreground"
                  )} />
                  <div>
                    <p className="font-medium">Accept Counter-Offer</p>
                    <p className="text-xs text-muted-foreground">
                      Create booking at customer's price
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAcceptCounter(false)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                    !acceptCounter
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-border/60 hover:border-blue-500/50"
                  )}
                >
                  <DollarSign className={cn(
                    "h-5 w-5",
                    !acceptCounter ? "text-blue-600" : "text-muted-foreground"
                  )} />
                  <div>
                    <p className="font-medium">Propose New Price</p>
                    <p className="text-xs text-muted-foreground">
                      Send a different price to the customer
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {!acceptCounter && (
              <div className="space-y-2">
                <Label htmlFor="newPrice">Your Price ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPrice"
                    type="number"
                    placeholder="Enter your price"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="counterResponse">Response Note (Optional)</Label>
              <Textarea
                id="counterResponse"
                placeholder="Add a message for the customer..."
                value={counterResponse}
                onChange={(e) => setCounterResponse(e.target.value)}
                rows={2}
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
              onClick={handleSubmitCounterResponse}
              disabled={isSubmitting || (!acceptCounter && !newPrice)}
              className="bg-[#271024] text-white hover:bg-[#271024]/90 dark:bg-[#e3ae72] dark:text-[#271024]"
            >
              {isSubmitting ? "Sending..." : acceptCounter ? "Accept & Create Booking" : "Send New Quote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
