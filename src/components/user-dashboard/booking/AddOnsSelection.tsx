"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ADD_ONS = [
  { id: "prp-enhancement", name: "PRP Enhancement", price: 150 },
  { id: "prf-boost", name: "PRF Boost", price: 125 },
  { id: "sculptra-addon", name: "Sculptra Add-on", price: 200 },
  { id: "led-therapy", name: "LED Therapy", price: 75 },
];

interface AddOnsSelectionProps {
  selectedAddOns: string[];
  onToggleAddOn: (addOnId: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function AddOnsSelection({
  selectedAddOns,
  onToggleAddOn,
  notes,
  onNotesChange,
  onNext,
  onBack,
  onSkip,
}: AddOnsSelectionProps) {
  const totalAddOnPrice = ADD_ONS.reduce((sum, addOn) => {
    return selectedAddOns.includes(addOn.id) ? sum + addOn.price : sum;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#271024] dark:text-[#e3ae72]">
          Enhance Your Experience
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Optional add-ons to elevate your treatment. You can also add special
          requests for your appointment.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add-ons */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[#271024] dark:text-[#e3ae72]">
              <Sparkles className="w-5 h-5" />
              Available Add-ons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ADD_ONS.map((addOn) => {
              const isSelected = selectedAddOns.includes(addOn.id);

              return (
                <Button
                  key={addOn.id}
                  variant="outline"
                  onClick={() => onToggleAddOn(addOn.id)}
                  className={cn(
                    "w-full justify-between h-auto py-3 px-4 transition-all duration-200",
                    isSelected
                      ? "border-[#271024] dark:border-[#e3ae72] bg-[#271024]/5 dark:bg-[#e3ae72]/10"
                      : "border-[#271024]/15 dark:border-[#e3ae72]/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                        isSelected
                          ? "border-[#271024] dark:border-[#e3ae72] bg-[#271024] dark:bg-[#e3ae72]"
                          : "border-[#271024]/30 dark:border-[#e3ae72]/30"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white dark:text-[#271024]" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-[#271024] dark:text-[#e3ae72]">
                        {addOn.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        +${addOn.price}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Plus className="w-4 h-4 text-[#e3ae72]" />}
                </Button>
              );
            })}

            {selectedAddOns.length > 0 && (
              <div className="pt-3 border-t border-[#271024]/10 dark:border-[#e3ae72]/10">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-[#271024] dark:text-[#e3ae72]">
                    Add-ons total
                  </span>
                  <span className="text-[#e3ae72]">${totalAddOnPrice}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Special Requests */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-[#271024] dark:text-[#e3ae72]">
              Special Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm">
                Any special requests or notes? (optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Let us know about any allergies, preferences, or questions you have..."
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="min-h-32 resize-none border-[#271024]/15 dark:border-[#e3ae72]/20 focus:border-[#271024] dark:focus:border-[#e3ae72]"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We'll do our best to accommodate your requests.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          size="lg"
          className="px-8 sm:px-12"
        >
          Back
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
          size="lg"
          className="px-8 sm:px-12"
        >
          Skip Add-ons
        </Button>
        <Button
          onClick={onNext}
          size="lg"
          className="px-8 sm:px-12 bg-[#271024] dark:bg-[#e3ae72] text-white dark:text-[#271024] hover:bg-[#271024]/80 dark:hover:bg-[#d49e5e]"
        >
          Review Booking
        </Button>
      </div>
    </div>
  );
}
