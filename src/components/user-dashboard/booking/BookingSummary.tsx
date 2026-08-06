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
  Lock,
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

    // Prepare booking details but DON'T create booking yet
    // We'll create the booking AFTER successful payment
    const [time, period] = selectedTime!.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const adjustedHours =
      period === "PM" ? (hours === 12 ? 12 : hours + 12) : hours === 12 ? 0 : hours;

    const bookingDate = new Date(selectedDate!);
    bookingDate.setHours(adjustedHours, minutes, 0, 0);

    // Store booking data for after payment
    const bookingData = {
      serviceId: service.id,
      date: bookingDate.toISOString(),
      addOns: selectedAddOns,
      notes,
    };

    // Set pending booking data (not an actual booking yet)
    setPendingBookingId(JSON.stringify(bookingData));

    // Show payment modal directly without creating a booking
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    // Payment completed successfully
    // NOW create the actual booking
    try {
      const bookingData = JSON.parse(pendingBookingId || "{}");
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

      // Create the booking now that payment is successful
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service?.id,
          date: bookingDate.toISOString(),
          notes: finalNotes || undefined,
          status: "CONFIRMED", // Payment succeeded, so booking is confirmed
          paymentId: paymentResult.paymentId, // Link the payment to the booking
        }),
      });

      if (res.ok) {
        // Close modal and redirect to dashboard
        setShowPayment(false);
        setTimeout(() => {
          window.location.href = "/user-dashboard";
        }, 500);
      } else {
        const data = await res.json().catch(() => ({}));
        setBookingError(`Payment succeeded but booking failed: ${data.error || "Please contact support."}`);
        setShowPayment(false);
      }
    } catch (error) {
      setBookingError("Payment succeeded but failed to create booking. Please contact support.");
      setShowPayment(false);
    }
  };

  const handlePaymentError = (error: string) => {
    setBookingError(`Payment failed: ${error}`);
    setShowPayment(false);

    // Note: Backend already handles failed payment cleanup by setting booking to CANCELLED
    // No need to manually delete here
  };

  return (
    <>
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#7a219f] to-[#3d1a3a] dark:from-[#efcafe] dark:to-[#7a219f] bg-clip-text text-transparent">
            Review Your Booking
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Please review your appointment details before confirming. A confirmation email will be sent upon successful payment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {/* Service Summary */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4 bg-gradient-to-br from-[#7a219f]/5 to-[#3d1a3a]/5 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-[#7a219f] dark:text-[#efcafe]">
                <Sparkles className="w-4 h-4 text-[#efcafe]" />
                Treatment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="font-semibold text-[#7a219f] dark:text-[#efcafe] text-base">
                  {service?.title}
                </p>
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {service?.description}
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground font-medium">Service</span>
                <span className="font-semibold text-[#7a219f] dark:text-[#efcafe] text-lg">
                  ${servicePrice}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4 bg-gradient-to-br from-[#7a219f]/5 to-[#3d1a3a]/5 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-[#7a219f] dark:text-[#efcafe]">
                <Calendar className="w-4 h-4 text-[#efcafe]" />
                Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#efcafe]/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-[#efcafe]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#7a219f] dark:text-[#efcafe]">
                    {formattedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#efcafe]/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#efcafe]" />
                </div>
                <p className="text-sm font-medium text-[#7a219f] dark:text-[#efcafe]">
                  {selectedTime}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Serenity Rejuvenation Med Spa
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Licensed Aesthetician
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Add-ons & Total */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4 bg-gradient-to-br from-[#7a219f]/5 to-[#3d1a3a]/5 border-b">
              <CardTitle className="text-base flex items-center gap-2 text-[#7a219f] dark:text-[#efcafe]">
                <CreditCard className="w-4 h-4 text-[#efcafe]" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {selectedAddOns.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Add-ons
                  </p>
                  {selectedAddOns.map((id) => {
                    const addOn = ADD_ONS_MAP[id];
                    return (
                      <div
                        key={id}
                        className="flex justify-between items-center text-sm py-1"
                      >
                        <span className="text-muted-foreground">
                          {addOn?.name}
                        </span>
                        <span className="font-medium text-[#7a219f] dark:text-[#efcafe]">
                          ${addOn?.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#7a219f] dark:text-[#efcafe]">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[#efcafe]">
                    ${totalPrice}
                  </span>
                </div>
              </div>

              {notes && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Notes
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Required Notice */}
        {servicePrice > 0 && !service?.requiresInquiry && (
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/50 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Secure Payment Required</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  A <span className="font-bold">${totalPrice}</span> payment is required to confirm your booking.
                  Your appointment will be confirmed immediately after successful payment.
                </p>
              </div>
            </div>
          </div>
        )}

        {bookingError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{bookingError}</AlertDescription>
          </Alert>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            size="lg"
            className="px-8 h-12 rounded-xl text-base font-medium border-2"
          >
            Back
          </Button>
          <Button
            onClick={handleBookWithPayment}
            disabled={isSubmitting}
            size="lg"
            className={cn(
              "px-8 h-12 rounded-xl text-base font-medium min-w-[220px]",
              "bg-gradient-to-r from-[#7a219f] to-[#3d1a3a]",
              "text-white hover:from-[#7a219f]/90 hover:to-[#3d1a3a]/90",
              "shadow-lg shadow-[#7a219f]/20 transition-all duration-200"
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
                    <Lock className="w-4 h-4" />
                    Pay ${totalPrice}
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
          productId={service?.id}
          serviceTitle={service?.title}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
