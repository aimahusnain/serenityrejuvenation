"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductLite } from "@/lib/dashboard";

interface ServiceSelectionProps {
  services: ProductLite[];
  selectedService: string | null;
  onSelect: (serviceId: string) => void;
  onNext: () => void;
}

export function ServiceSelection({
  services,
  selectedService,
  onSelect,
  onNext,
}: ServiceSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#271024] dark:text-[#e3ae72]">
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

          return (
            <Card
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={cn(
                "group cursor-pointer transition-all duration-300 hover:shadow-lg",
                "border-2",
                isSelected
                  ? "border-[#271024] dark:border-[#e3ae72] bg-[#271024]/5 dark:bg-[#e3ae72]/10"
                  : "border-border/60 hover:border-[#271024]/30 dark:hover:border-[#e3ae72]/30"
              )}
            >
              <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72] group-hover:text-[#271024] dark:group-hover:text-[#e3ae72]">
                      {service.title}
                    </h3>
                    <p className="text-sm font-medium text-[#e3ae72] dark:text-[#e3ae72]/80 mt-1">
                      {price}
                    </p>
                  </div>
                  {/* Selection Indicator */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                      isSelected
                        ? "border-[#271024] dark:border-[#e3ae72] bg-[#271024] dark:bg-[#e3ae72]"
                        : "border-[#271024]/30 dark:border-[#e3ae72]/30"
                    )}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white dark:text-[#271024]" />
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {service.description}
                </p>

                {/* Decorative Sparkle */}
                <div className="flex items-center gap-1.5 text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Premium treatment</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onNext}
          disabled={!selectedService}
          size="lg"
          className="px-8 sm:px-12 bg-[#271024] dark:bg-[#e3ae72] text-white dark:text-[#271024] hover:bg-[#271024]/80 dark:hover:bg-[#d49e5e]"
        >
          Continue to Date & Time
        </Button>
      </div>
    </div>
  );
}
