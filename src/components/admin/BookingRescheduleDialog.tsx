"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

interface BookingRescheduleDialogProps {
  bookingId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BookingRescheduleDialog({
  bookingId,
  open,
  onOpenChange,
  onSuccess,
}: BookingRescheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedDate("");
      setSelectedTime("");
      setHasConflict(false);
      setAvailableSlots(TIME_SLOTS);
    }
  }, [open]);

  // Check for conflicts when date/time changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      checkForConflicts();
    }
  }, [selectedDate, selectedTime]);

  // Update available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;

    try {
      const res = await fetch(`/api/bookings/available-slots?date=${selectedDate}`);
      if (res.ok) {
        const data = await res.json();
        setAvailableSlots(data.availableSlots);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const checkForConflicts = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsCheckingConflict(true);
    try {
      const [time, period] = selectedTime.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : period === "AM" && hours === 12 ? 0 : hours;

      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(adjustedHours, minutes, 0, 0);

      // Check for existing bookings at this time (excluding current booking)
      const res = await fetch(`/api/admin/bookings/check-conflict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newDateTime.toISOString(),
          excludeBookingId: bookingId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHasConflict(data.hasConflict);
      }
    } catch (error) {
      console.error("Error checking conflicts:", error);
    } finally {
      setIsCheckingConflict(false);
    }
  };

  const handleSave = async () => {
    if (!selectedDate || !selectedTime || hasConflict || !bookingId) return;

    setIsSaving(true);
    try {
      const [time, period] = selectedTime.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : period === "AM" && hours === 12 ? 0 : hours;

      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(adjustedHours, minutes, 0, 0);

      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDateTime.toISOString() }),
      });

      if (res.ok) {
        onOpenChange(false);
        onSuccess?.();
      } else {
        const error = await res.json().catch(() => ({ error: "Failed to reschedule" }));
        alert(error.error || "Failed to reschedule booking");
      }
    } catch (error) {
      console.error("Error rescheduling:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = selectedDate && selectedTime && !hasConflict && !isCheckingConflict;

  // Get min date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Select a new date and time for this appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              min={minDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              disabled={!selectedDate}
            >
              <SelectTrigger id="time">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableSlots.length < TIME_SLOTS.length && (
              <p className="text-xs text-muted-foreground">
                {availableSlots.length} of {TIME_SLOTS.length} slots available
              </p>
            )}
          </div>

          {/* Conflict Warning */}
          {isCheckingConflict && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking for conflicts...
            </div>
          )}

          {hasConflict && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm">
                This time slot conflicts with an existing booking. Please choose a different time.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave || isSaving}>
            {isSaving ? "Saving..." : "Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
