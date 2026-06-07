"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StepProgress } from "./booking/StepProgress";
import { ServiceSelection } from "./booking/ServiceSelection";
import { DateTimeSelection } from "./booking/DateTimeSelection";
import { AddOnsSelection } from "./booking/AddOnsSelection";
import { BookingSummary } from "./booking/BookingSummary";
import { InquiryForm } from "@/components/service-inquiry";
import type { ProductLite } from "@/lib/dashboard";
import { Highlighter } from "../ui/highlighter";
import { AlertCircle } from "lucide-react";

const STEPS = [
  { id: 1, label: "Service" },
  { id: 2, label: "Date & Time" },
  { id: 3, label: "Add-ons" },
  { id: 4, label: "Review" },
];

interface BookAppointmentPageProps {
  services: ProductLite[];
}

export function BookAppointmentPage({ services }: BookAppointmentPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const selectedServiceData = services.find((s) => s.id === selectedService);

  // Check if service requires inquiry (no price or explicitly marked)
  const requiresInquiry =
    selectedServiceData?.requiresInquiry || !selectedServiceData?.price;

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleToggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      setMessage(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setMessage(null);
    }
  };

  const handleSkip = () => {
    setCurrentStep(4); // Skip to review
    setMessage(null);
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      setMessage({ type: "error", text: "Please complete all required fields." });
      return;
    }

    // Combine date and time
    const [time, period] = selectedTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    // Convert 12-hour to 24-hour format
    const adjustedHours =
      period === "PM"
        ? hours === 12
          ? 12
          : hours + 12
        : hours === 12
          ? 0
          : hours;

    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(adjustedHours, minutes, 0, 0);

    // Prepare notes with add-ons
    const addOnNames =
      selectedAddOns.length > 0
        ? selectedAddOns
            .map((id) => {
              const map: Record<string, string> = {
                "prp-enhancement": "PRP Enhancement",
                "prf-boost": "PRF Boost",
                "sculptra-addon": "Sculptra Add-on",
                "led-therapy": "LED Therapy",
              };
              return map[id];
            })
            .join(", ")
        : null;

    const finalNotes = [addOnNames, notes].filter(Boolean).join(" | ");

    startTransition(async () => {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId: selectedService,
            date: bookingDate.toISOString(),
            notes: finalNotes || undefined,
          }),
        });

        if (res.ok) {
          setMessage({
            type: "success",
            text: "Booking confirmed! Redirecting to dashboard...",
          });
          setTimeout(() => {
            router.push("/user-dashboard");
            // Refresh after navigation to ensure data is up-to-date
            setTimeout(() => {
              router.refresh();
              window.location.reload();
            }, 100);
          }, 2000);
        } else {
          const data = await res.json().catch(() => ({}));
          setMessage({
            type: "error",
            text: data.error || "Failed to book. Please try again.",
          });
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Network error. Please check your connection and try again.",
        });
      }
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#271024] dark:text-[#e3ae72] leading-tight">
            Book Your
            <span className="block mt-1 text-[#e3ae72] dark:text-[#271024]">
              <Highlighter lightColor="#271024" darkColor="#e3ae72">
              Appointment
              </Highlighter>
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto">
            Schedule your visit to Serenity Rejuvenation Med Spa and begin your
            journey to renewed wellness.
          </p>
        </div>

        {/* Inquiry Required Notice */}
        {selectedService && requiresInquiry && (
          <div className="max-w-3xl mx-auto mb-6 p-4 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">This service requires a consultation</p>
              <p className="text-sm mt-1 opacity-90">
                Pricing for <strong>{selectedServiceData?.title}</strong> is determined after a personalized consultation. Submit your inquiry and we'll contact you to discuss details and pricing.
              </p>
            </div>
          </div>
        )}

        {/* Step Progress */}
        <StepProgress steps={STEPS} currentStep={currentStep} />

        {/* Message */}
        {message && (
          <div
            className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Step Content */}
        <div className="max-w-5xl mx-auto">
          {currentStep === 1 && (
            <ServiceSelection
              services={services}
              selectedService={selectedService}
              onSelect={handleServiceSelect}
              onNext={handleNext}
              requiresInquiryCheck={true}
            />
          )}

          {/* If service requires inquiry, show inquiry form instead of booking flow */}
          {selectedService && requiresInquiry && currentStep === 1 ? (
            <div className="mt-8 flex justify-center">
              <InquiryForm
                service={selectedServiceData || {
                  id: selectedService,
                  title: "Service",
                  description: "",
                  price: null,
                  requiresInquiry: true
                }}
              />
            </div>
          ) : (
            <>
              {currentStep === 2 && (
                <DateTimeSelection
                  onDateSelect={handleDateSelect}
                  onTimeSelect={handleTimeSelect}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 3 && (
                <AddOnsSelection
                  selectedAddOns={selectedAddOns}
                  onToggleAddOn={handleToggleAddOn}
                  notes={notes}
                  onNotesChange={setNotes}
                  onNext={handleNext}
                  onBack={handleBack}
                  onSkip={handleSkip}
                />
              )}

              {currentStep === 4 && (
                <BookingSummary
                  service={selectedServiceData || null}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  selectedAddOns={selectedAddOns}
                  notes={notes}
                  onSubmit={handleSubmit}
                  onBack={handleBack}
                  isSubmitting={isPending}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
