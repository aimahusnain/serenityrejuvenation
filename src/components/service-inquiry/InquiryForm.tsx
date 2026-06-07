"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Mail, MapPin, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Service {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface InquiryFormProps {
  service: Service;
  trigger?: React.ReactNode;
}

export function InquiryForm({ service, trigger }: InquiryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.name || !formData.email || !formData.phone) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId: service.id,
            ...formData,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage({
            type: "success",
            text: data.message || "Inquiry submitted successfully!",
          });
          // Reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            preferredDate: "",
            preferredTime: "",
            notes: "",
          });
          // Close dialog after success
          setTimeout(() => {
            setOpen(false);
            router.refresh();
          }, 2000);
        } else {
          setMessage({
            type: "error",
            text: data.error || "Failed to submit inquiry. Please try again.",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const defaultTrigger = (
    <Button
      variant="default"
      className="w-full bg-[#271024] text-white hover:bg-[#271024]/90 dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
    >
      Request Appointment
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#271024] dark:text-[#e3ae72]">
            Request Appointment
          </DialogTitle>
          <DialogDescription>
            Submit your inquiry for <strong>{service.title}</strong>. We'll
            contact you shortly to confirm pricing and availability.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Summary */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#271024]/5 dark:bg-[#e3ae72]/10">
            <div className="p-2 rounded bg-[#271024]/10 dark:bg-[#e3ae72]/20">
              <Calendar className="h-4 w-4 text-[#271024] dark:text-[#e3ae72]" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-[#271024] dark:text-[#e3ae72]">
                {service.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {service.description}
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Preferred Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="preferredDate" className="text-sm">
                Preferred Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredTime" className="text-sm">
                Preferred Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any specific requirements or questions..."
              rows={3}
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-[#271024]/20 dark:border-[#e3ae72]/30"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#271024] text-white hover:bg-[#271024]/90 dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
            >
              {isPending ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
