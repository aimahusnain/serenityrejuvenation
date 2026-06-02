"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductLite } from "@/lib/dashboard";

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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#07264f] dark:text-[#e3ae72]">
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
            <CardTitle className="text-base flex items-center gap-2 text-[#07264f] dark:text-[#e3ae72]">
              <Sparkles className="w-4 h-4" />
              Treatment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-[#07264f] dark:text-[#e3ae72]">
                {service?.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {service?.description}
              </p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#07264f]/10 dark:border-[#e3ae72]/10">
              <span className="text-sm text-muted-foreground">Service</span>
              <span className="font-medium text-[#07264f] dark:text-[#e3ae72]">
                ${servicePrice}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-[#07264f] dark:text-[#e3ae72]">
              <Calendar className="w-4 h-4" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-[#e3ae72] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#07264f] dark:text-[#e3ae72]">
                  {formattedDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#e3ae72] shrink-0" />
              <p className="text-sm font-medium text-[#07264f] dark:text-[#e3ae72]">
                {selectedTime}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#e3ae72] shrink-0" />
              <p className="text-xs text-muted-foreground">
                Serenity Rejuvenation Med Spa
              </p>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#e3ae72] shrink-0" />
              <p className="text-xs text-muted-foreground">
                Licensed Aesthetician
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Add-ons & Total */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-[#07264f] dark:text-[#e3ae72]">
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
                      <span className="text-[#07264f] dark:text-[#e3ae72]">
                        ${addOn?.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-[#07264f]/10 dark:border-[#e3ae72]/10">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#07264f] dark:text-[#e3ae72]">
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

      {/* Payment Note */}
      <Card className="bg-[#07264f]/5 dark:bg-[#e3ae72]/10 border-[#07264f]/10 dark:border-[#e3ae72]/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-[#07264f] dark:text-[#e3ae72] shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-[#07264f] dark:text-[#e3ae72] mb-1">
                Payment Information
              </p>
              <p>
                Payment will be collected at your appointment. We accept all
                major credit cards and cash.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
          onClick={onSubmit}
          disabled={isSubmitting}
          size="lg"
          className={cn(
            "px-8 sm:px-12 min-w-[200px]",
            "bg-[#07264f] dark:bg-[#e3ae72]",
            "text-white dark:text-[#07264f]",
            "hover:bg-[#07264f]/80 dark:hover:bg-[#d49e5e]"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Confirming...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Confirm Booking
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
