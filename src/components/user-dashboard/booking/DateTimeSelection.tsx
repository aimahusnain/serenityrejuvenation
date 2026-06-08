"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimeSelectionProps {
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// Generate time slots from 9 AM to 5 PM
const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export function DateTimeSelection({
  onDateSelect,
  onTimeSelect,
  onNext,
  onBack,
}: DateTimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    const totalDays = lastDayOfMonth.getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: Array<{ date: Date; isCurrentMonth: boolean; isDisabled: boolean }> = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({
        date: new Date(year, month, 1 - (startDayOfWeek - i)),
        isCurrentMonth: false,
        isDisabled: true,
      });
    }

    // Add days of the current month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isDisabled = date < today;
      days.push({
        date,
        isCurrentMonth: true,
        isDisabled,
      });
    }

    return days;
  }, [currentMonth]);

  // Fetch available time slots when a date is selected
  useEffect(() => {
    if (selectedDate) {
      const fetchAvailableSlots = async () => {
        setIsLoadingSlots(true);
        setSlotsError(null);
        try {
          // Format date as YYYY-MM-DD for the API
          const dateStr = selectedDate.toISOString().split('T')[0];
          const res = await fetch(`/api/bookings/available-slots?date=${dateStr}`);
          if (res.ok) {
            const data = await res.json();
            setAvailableSlots(data.availableSlots);
          } else {
            // If API fails, show all slots (fallback)
            setAvailableSlots(TIME_SLOTS);
            setSlotsError("Couldn't check availability. All times shown.");
          }
        } catch (error) {
          console.error("Error fetching available slots:", error);
          setAvailableSlots(TIME_SLOTS);
          setSlotsError("Couldn't check availability. All times shown.");
        } finally {
          setIsLoadingSlots(false);
        }
      };

      fetchAvailableSlots();
    } else {
      // Reset to all slots when no date is selected
      setAvailableSlots(TIME_SLOTS);
    }
  }, [selectedDate]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    setSelectedDate(date);
    onDateSelect(date);
  };

  const handleTimeClick = (time: string) => {
    // Only allow selection if the slot is available
    if (availableSlots.includes(time)) {
      setSelectedTime(time);
      onTimeSelect(time);
    }
  };

  const canProceed = selectedDate && selectedTime;

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const isDateSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#271024] dark:text-[#e3ae72]">
          Choose Date & Time
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Select your preferred appointment date and time slot. We'll confirm
          your booking shortly.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousMonth}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72]">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextMonth}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayObj, index) => {
                const date = dayObj.date;
                const isDisabled = dayObj.isDisabled;
                const isSelected = isDateSelected(date);
                const isToday =
                  date.getDate() === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear();

                return (
                  <button
                    key={index}
                    disabled={isDisabled}
                    onClick={() => handleDateClick(date)}
                    className={cn(
                      "aspect-square rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:bg-[#271024]/10 dark:hover:bg-[#e3ae72]/10",
                      isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
                      isSelected &&
                        "bg-[#271024] dark:bg-[#e3ae72] text-white dark:text-[#271024]",
                      !isSelected &&
                        !isDisabled &&
                        "text-[#271024] dark:text-[#e3ae72]",
                      isToday &&
                        !isSelected &&
                        "border border-[#271024] dark:border-[#e3ae72]"
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#271024] dark:text-[#e3ae72]" />
              <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72]">
                Available Times
              </h3>
            </div>

            {selectedDate ? (
              <div className="space-y-4">
                {isLoadingSlots ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <p className="text-sm">Checking availability...</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center px-4">
                    <Clock className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium">No slots available</p>
                    <p className="text-xs mt-1">All time slots are booked for this date</p>
                  </div>
                ) : (
                  <>
                    {slotsError && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 text-center p-2 bg-amber-500/10 rounded-lg">
                        {slotsError}
                      </div>
                    )}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {TIME_SLOTS.map((time) => {
                        const isAvailable = availableSlots.includes(time);
                        const isSelected = selectedTime === time;

                        return (
                          <Button
                            key={time}
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => handleTimeClick(time)}
                            disabled={!isAvailable}
                            className={cn(
                              "text-sm",
                              isSelected
                                ? "bg-[#271024] dark:bg-[#e3ae72] text-white dark:text-[#271024] border-[#271024] dark:border-[#e3ae72]"
                                : isAvailable
                                  ? "border-[#271024]/20 dark:border-[#e3ae72]/20 text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/5"
                                  : "opacity-40 cursor-not-allowed border-dashed"
                            )}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                    {availableSlots.length < TIME_SLOTS.length && (
                      <p className="text-xs text-center text-muted-foreground">
                        {availableSlots.length} of {TIME_SLOTS.length} slots available
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                Please select a date first
              </div>
            )}
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
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
          className="px-8 sm:px-12 bg-[#271024] dark:bg-[#e3ae72] text-white dark:text-[#271024] hover:bg-[#271024]/80 dark:hover:bg-[#d49e5e]"
        >
          Continue to Add-ons
        </Button>
      </div>
    </div>
  );
}
