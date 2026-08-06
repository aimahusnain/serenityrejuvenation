"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductLite } from "@/lib/dashboard";

interface ServiceSelectionProps {
  services: ProductLite[];
  selectedService: string | null;
  onSelect: (serviceId: string) => void;
  onNext: () => void;
  requiresInquiryCheck?: boolean;
}

export function ServiceSelection({
  services,
  selectedService,
  onSelect,
  onNext,
  requiresInquiryCheck = false,
}: ServiceSelectionProps) {
  // Check if selected service requires inquiry
  const selectedServiceData = services.find((s) => s.id === selectedService);
  const requiresInquiry = selectedServiceData?.requiresInquiry || !selectedServiceData?.price;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#7a219f] dark:text-[#efcafe]">
          Choose Your Treatment
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Select from our premium skincare and wellness treatments designed to
          rejuvenate your body and mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service) => {
          const isSelected = selectedService === service.id;
          const price = service.price ? `$${service.price}` : "Contact for pricing";
          const serviceRequiresInquiry = service.requiresInquiry || !service.price;

          return (
            <Card
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={cn(
                "group cursor-pointer transition-all duration-300 hover:shadow-lg",
                "border-2",
                isSelected
                  ? "border-[#7a219f] dark:border-[#efcafe] bg-[#7a219f]/5 dark:bg-[#efcafe]/10"
                  : "border-border/60 hover:border-[#7a219f]/30 dark:hover:border-[#efcafe]/30"
              )}
            >
              <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#7a219f] dark:text-[#efcafe] group-hover:text-[#7a219f] dark:group-hover:text-[#efcafe]">
                        {service.title}
                      </h3>
                      {serviceRequiresInquiry && (
                        <Badge className="bg-[#efcafe] text-[#7a219f] text-xs">
                          Contact for Price
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#efcafe] dark:text-[#efcafe]/80 mt-1">
                      {price}
                    </p>
                  </div>
                  {/* Selection Indicator */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                      isSelected
                        ? "border-[#7a219f] dark:border-[#efcafe] bg-[#7a219f] dark:bg-[#efcafe]"
                        : "border-[#7a219f]/30 dark:border-[#efcafe]/30"
                    )}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white dark:text-[#7a219f]" />
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {service.description}
                </p>

                {/* Decorative Sparkle */}
                <div className="flex items-center gap-1.5 text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Premium treatment</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Continue Button - Hide if service requires inquiry */}
      {!requiresInquiryCheck || !requiresInquiry ? (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onNext}
            disabled={!selectedService}
            size="lg"
            className="px-8 sm:px-12 bg-[#7a219f] dark:bg-[#efcafe] text-white dark:text-[#7a219f] hover:bg-[#7a219f]/80 dark:hover:bg-[#7a219f]"
          >
            Continue to Date & Time
          </Button>
        </div>
      ) : (
        <div className="flex justify-center pt-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-[#7a219f] dark:text-[#efcafe]">
              {selectedServiceData?.title}
            </span>{" "}
            requires a consultation. Please use the inquiry form below.
          </p>
        </div>
      )}
    </div>
  );
}
