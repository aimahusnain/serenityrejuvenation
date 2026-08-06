"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-all duration-300 shrink-0",
                  isCompleted &&
                    "bg-[#7a219f] dark:bg-[#efcafe] text-white dark:text-[#7a219f]",
                  isCurrent &&
                    "bg-white dark:bg-[#7a219f] border-2 border-[#7a219f] dark:border-[#efcafe] text-[#7a219f] dark:text-[#efcafe]",
                  step.id > currentStep &&
                    "bg-white/50 dark:bg-[#7a219f]/30 text-[#7a219f]/40 dark:text-[#efcafe]/40 border-2 border-transparent"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  step.id
                )}
              </div>
              {/* Step Label */}
              <span
                className={cn(
                  "text-xs sm:text-sm font-medium whitespace-nowrap hidden sm:block",
                  isCurrent && "text-[#7a219f] dark:text-[#efcafe]",
                  isCompleted && "text-[#7a219f]/70 dark:text-[#efcafe]/70",
                  step.id > currentStep && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  "w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 transition-all duration-300",
                  isCompleted
                    ? "bg-[#7a219f] dark:bg-[#efcafe]"
                    : "bg-[#7a219f]/15 dark:bg-[#efcafe]/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
