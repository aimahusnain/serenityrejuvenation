"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
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
    if (date < new Date().setHours(0, 0, 0, 0)) return;

    setSelectedDate(date);
    onDateSelect(date);
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    onTimeSelect(time);
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
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#07264f] dark:text-[#e3ae72]">
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
              <h3 className="text-lg font-semibold text-[#07264f] dark:text-[#e3ae72]">
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
                      "hover:bg-[#07264f]/10 dark:hover:bg-[#e3ae72]/10",
                      isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
                      isSelected &&
                        "bg-[#07264f] dark:bg-[#e3ae72] text-white dark:text-[#07264f]",
                      !isSelected &&
                        !isDisabled &&
                        "text-[#07264f] dark:text-[#e3ae72]",
                      isToday &&
                        !isSelected &&
                        "border border-[#07264f] dark:border-[#e3ae72]"
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
              <Clock className="w-5 h-5 text-[#07264f] dark:text-[#e3ae72]" />
              <h3 className="text-lg font-semibold text-[#07264f] dark:text-[#e3ae72]">
                Available Times
              </h3>
            </div>

            {selectedDate ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time;

                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleTimeClick(time)}
                      className={cn(
                        "text-sm",
                        isSelected
                          ? "bg-[#07264f] dark:bg-[#e3ae72] text-white dark:text-[#07264f] border-[#07264f] dark:border-[#e3ae72]"
                          : "border-[#07264f]/20 dark:border-[#e3ae72]/20 text-[#07264f] dark:text-[#e3ae72] hover:bg-[#07264f]/5 dark:hover:bg-[#e3ae72]/5"
                      )}
                    >
                      {time}
                    </Button>
                  );
                })}
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
          className="px-8 sm:px-12 bg-[#07264f] dark:bg-[#e3ae72] text-white dark:text-[#07264f] hover:bg-[#07264f]/80 dark:hover:bg-[#d49e5e]"
        >
          Continue to Add-ons
        </Button>
      </div>
    </div>
  );
}
