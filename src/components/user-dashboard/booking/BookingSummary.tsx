"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Sparkles,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductLite } from "@/lib/dashboard";
import { PaymentModal } from "@/components/payment/PaymentModal";

interface BookingSummaryProps {
  service: ProductLite | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedAddOns: string[];
  notes: string;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const ADD_ONS_MAP: Record<string, { name: string; price: number }> = {
  "prp-enhancement": { name: "PRP Enhancement", price: 150 },
  "prf-boost": { name: "PRF Boost", price: 125 },
  "sculptra-addon": { name: "Sculptra Add-on", price: 200 },
  "led-therapy": { name: "LED Therapy", price: 75 },
};

export function BookingSummary({
  service,
  selectedDate,
  selectedTime,
  selectedAddOns,
  notes,
  onSubmit,
  onBack,
  isSubmitting = false,
}: BookingSummaryProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Calculate pricing
  const servicePrice = service?.price
    ? parseFloat(service.price.replace(/[^0-9.]/g, ""))
    : 0;

  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    return sum + (ADD_ONS_MAP[id]?.price || 0);
  }, 0);

  const totalPrice = servicePrice + addOnsTotal;

  // Format date
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Handle the booking process with payment
  const handleBookWithPayment = async () => {
    if (!service) {
      setBookingError("Please select a service");
      return;
    }

    setBookingError(null);

    // If there's no price (requires inquiry), submit without payment
    if (!servicePrice || service.requiresInquiry) {
      onSubmit();
      return;
    }

    // Create pending booking first
    try {
      const [time, period] = selectedTime!.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      const adjustedHours =
        period === "PM" ? (hours === 12 ? 12 : hours + 12) : hours === 12 ? 0 : hours;

      const bookingDate = new Date(selectedDate!);
      bookingDate.setHours(adjustedHours, minutes, 0, 0);

      const addOnNames =
        selectedAddOns.length > 0
          ? selectedAddOns
              .map((id) => ADD_ONS_MAP[id]?.name)
              .join(", ")
          : null;

      const finalNotes = [addOnNames, notes].filter(Boolean).join(" | ");

      // Create pending booking
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          date: bookingDate.toISOString(),
          notes: finalNotes || undefined,
          status: "PENDING", // Keep pending until payment completes
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPendingBookingId(data.booking.id);
        // Show payment modal
        setShowPayment(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setBookingError(data.error || "Failed to create booking. Please try again.");
      }
    } catch (error) {
      setBookingError("Network error. Please check your connection and try again.");
    }
  };

  const handlePaymentSuccess = () => {
    // Payment completed, onSubmit will handle the rest
    onSubmit();
    setShowPayment(false);
  };

  const handlePaymentError = (error: string) => {
    setBookingError(`Payment failed: ${error}`);
    setShowPayment(false);

    // Cancel the pending booking if payment failed
    if (pendingBookingId) {
      fetch(`/api/admin/bookings/${pendingBookingId}`, {
        method: "DELETE",
      }).catch(console.error);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#271024] dark:text-[#e3ae72]">
            Review Your Booking
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Please review your appointment details before confirming. You'll
            receive a confirmation email shortly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Service Summary */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-[#271024] dark:text-[#e3ae72]">
                <Sparkles className="w-4 h-4" />
                Treatment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-[#271024] dark:text-[#e3ae72]">
                  {service?.title}
                </p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {service?.description}
                </p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#271024]/10 dark:border-[#e3ae72]/10">
                <span className="text-sm text-muted-foreground">Service</span>
                <span className="font-medium text-[#271024] dark:text-[#e3ae72]">
                  ${servicePrice}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-[#271024] dark:text-[#e3ae72]">
                <Calendar className="w-4 h-4" />
                Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#e3ae72] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#271024] dark:text-[#e3ae72]">
                    {formattedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#e3ae72] shrink-0" />
                <p className="text-sm font-medium text-[#271024] dark:text-[#e3ae72]">
                  {selectedTime}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#e3ae72] shrink-0" />
                <p className="xs text-muted-foreground">
                  Serenity Rejuvenation Med Spa
                </p>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#e3ae72] shrink-0" />
                <p className="xs text-muted-foreground">
                  Licensed Aesthetician
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Add-ons & Total */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-[#271024] dark:text-[#e3ae72]">
                <CreditCard className="w-4 h-4" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedAddOns.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Add-ons
                  </p>
                  {selectedAddOns.map((id) => {
                    const addOn = ADD_ONS_MAP[id];
                    return (
                      <div
                        key={id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-muted-foreground">
                          {addOn?.name}
                        </span>
                        <span className="text-[#271024] dark:text-[#e3ae72]">
                          ${addOn?.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-3 border-t border-[#271024]/10 dark:border-[#e3ae72]/10">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#271024] dark:text-[#e3ae72]">
                    Total
                  </span>
                  <span className="text-xl font-bold text-[#e3ae72]">
                    ${totalPrice}
                  </span>
                </div>
              </div>

              {notes && (
                <div className="pt-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                    Notes
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Required Notice */}
        {servicePrice > 0 && !service?.requiresInquiry && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
            <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              <span className="font-medium">Payment Required:</span> A{" "}
              <span className="font-bold">${totalPrice}</span> payment will be
              collected to confirm your booking. Your appointment will be
              confirmed immediately after successful payment.
            </AlertDescription>
          </Alert>
        )}

        {bookingError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{bookingError}</AlertDescription>
          </Alert>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            size="lg"
            className="px-8 sm:px-12"
          >
            Back
          </Button>
          <Button
            onClick={handleBookWithPayment}
            disabled={isSubmitting}
            size="lg"
            className={cn(
              "px-8 sm:px-12 min-w-[200px]",
              "bg-[#271024] dark:bg-[#e3ae72]",
              "text-white dark:text-[#271024]",
              "hover:bg-[#271024]/80 dark:hover:bg-[#d49e5e]"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {servicePrice > 0 ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay & Confirm
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirm Booking
                  </>
                )}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && pendingBookingId && (
        <PaymentModal
          open={showPayment}
          onClose={() => {
            setShowPayment(false);
            handlePaymentError("Payment cancelled");
          }}
          amount={totalPrice}
          bookingId={pendingBookingId}
          productId={service?.id}
          serviceTitle={service?.title}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
