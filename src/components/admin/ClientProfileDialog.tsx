"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Mail, Phone, Calendar, DollarSign, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/lib/dashboard";

interface Client {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  preferredServices: string[];
  emailNotifications: boolean;
  createdAt: Date;
  totalSpending: number;
  pendingSpending: number;
  totalBookings: number;
  statusCounts: {
    PENDING: number;
    CONFIRMED: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  bookings: Array<{
    id: string;
    serviceName: string;
    servicePrice: number;
    date: Date;
    status: BookingStatus;
    notes: string | null;
  }>;
}

interface ClientProfileDialogProps {
  clientId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientProfileDialog({
  clientId,
  open,
  onOpenChange,
}: ClientProfileDialogProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for preferences
  const [phone, setPhone] = useState("");
  const [preferredServices, setPreferredServices] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    if (clientId && open) {
      fetchClientData(clientId);
    }
  }, [clientId, open]);

  const fetchClientData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/clients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data.client);
        setPhone(data.client.phone || "");
        setPreferredServices(data.client.preferredServices?.join(", ") || "");
        setEmailNotifications(data.client.emailNotifications);
      } else {
        const errorData = await res.json().catch(() => ({ error: "Failed to fetch client" }));
        setError(errorData.error || "Failed to fetch client");
      }
    } catch (err) {
      console.error("Error fetching client:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!clientId) return;

    setIsSaving(true);
    try {
      const preferredArray = preferredServices
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone || null,
          preferredServices: preferredArray,
          emailNotifications,
        }),
      });

      if (res.ok) {
        // Refresh client data
        await fetchClientData(clientId);
      } else {
        const errorData = await res.json().catch(() => ({ error: "Failed to save" }));
        alert(errorData.error || "Failed to save preferences");
      }
    } catch (err) {
      console.error("Error saving preferences:", err);
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const statusBadgeClass = (status: BookingStatus) => {
    const classes = {
      CONFIRMED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
      PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
      COMPLETED: "bg-primary/15 text-primary",
      CANCELLED: "bg-red-500/15 text-red-700 dark:text-red-400",
    };
    return classes[status] || "";
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !client) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{error || "Client not found"}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#7a219f] dark:text-[#efcafe]">
            {client.name || "Client Profile"}
          </DialogTitle>
          <DialogDescription>View and manage client information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Client Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{client.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone || "No phone"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined {new Date(client.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{client.totalBookings} bookings</span>
            </div>
          </div>

          <Separator />

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-[#7a219f]/10 dark:border-[#efcafe]/20">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-[#efcafe]" />
                <span className="text-xs text-muted-foreground">Total Spent</span>
              </div>
              <p className="text-xl font-bold text-[#7a219f] dark:text-[#efcafe]">
                ${client.totalSpending.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg border border-[#7a219f]/10 dark:border-[#efcafe]/20">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
              <p className="text-xl font-bold text-[#7a219f] dark:text-[#efcafe]">
                ${client.pendingSpending.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg border border-[#7a219f]/10 dark:border-[#efcafe]/20">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
              <p className="text-xl font-bold text-[#7a219f] dark:text-[#efcafe]">
                {client.statusCounts.COMPLETED}
              </p>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#7a219f] dark:text-[#efcafe]">
              Preferences & Notes
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="services">Preferred Services</Label>
                <Input
                  id="services"
                  value={preferredServices}
                  onChange={(e) => setPreferredServices(e.target.value)}
                  placeholder="e.g., Botox, Microneedling"
                />
                <p className="text-xs text-muted-foreground">Comma-separated list</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive appointment reminders via email
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Button onClick={handleSavePreferences} disabled={isSaving} size="sm">
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Booking History */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#7a219f] dark:text-[#efcafe]">
              Booking History
            </h3>
            {client.bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No bookings found
              </p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.serviceName}</TableCell>
                        <TableCell>
                          {new Date(booking.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${booking.servicePrice}</TableCell>
                        <TableCell>
                          <Badge className={cn("border-0", statusBadgeClass(booking.status))}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
