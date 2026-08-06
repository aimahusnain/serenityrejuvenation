"use client";

import { useState, useTransition, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, MoreVertical, Edit, Trash2, Package, Clock, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  title: string;
  price: string | null;
  description: string;
  image: string;
  benefits: string[];
  requiresInquiry: boolean;
}

interface ServicesManagementSectionProps {
  initialServices: Service[];
}

export function ServicesManagementSection({ initialServices }: ServicesManagementSectionProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    benefits: "",
    requiresInquiry: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      description: "",
      image: "",
      benefits: "",
      requiresInquiry: false,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingService(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      price: service.price || "",
      description: service.description,
      image: service.image,
      benefits: service.benefits.join(", "),
      requiresInquiry: service.requiresInquiry,
    });
    setImagePreview(service.image);
    setIsDialogOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        let imageUrl = formData.image;

        // Upload new image if selected
        if (imageFile) {
          setIsUploading(true);
          try {
            imageUrl = await uploadImage(imageFile);
          } catch (error) {
            alert("Failed to upload image. Please try again.");
            setIsUploading(false);
            return;
          } finally {
            setIsUploading(false);
          }
        } else if (imagePreview && !formData.image) {
          imageUrl = imagePreview;
        }

        const benefitsArray = formData.benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean);

        const payload = {
          title: formData.title,
          price: formData.price || null,
          description: formData.description,
          image: imageUrl || "/images/placeholder.jpg",
          benefits: benefitsArray,
          requiresInquiry: formData.requiresInquiry,
        };

        const url = editingService
          ? "/api/admin/services"
          : "/api/admin/services";

        const method = editingService ? "PATCH" : "POST";

        const body = editingService
          ? { ...payload, id: editingService.id }
          : payload;

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          if (editingService) {
            setServices((prev) =>
              prev.map((s) => (s.id === editingService.id ? data.service : s))
            );
          } else {
            setServices((prev) => [...prev, data.service]);
          }
          setIsDialogOpen(false);
          resetForm();
        } else {
          const error = await res.json().catch(() => ({ error: "Operation failed" }));
          alert(error.error || "Operation failed");
        }
      } catch (error) {
        console.error("Service operation error:", error);
        alert("Network error. Please try again.");
      }
    });
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/services", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: serviceToDelete.id }),
        });

        if (res.ok) {
          setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
          setDeleteDialogOpen(false);
          setServiceToDelete(null);
        } else {
          const error = await res.json().catch(() => ({ error: "Delete failed" }));
          alert(error.error || "Delete failed");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Network error. Please try again.");
      }
    });
  };

  const confirmDelete = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20 bg-white dark:bg-[#7a219f]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
              Services & Treatments
            </CardTitle>
            <CardDescription>Manage your spa services and pricing</CardDescription>
          </div>
          <Button onClick={openCreateDialog} size="sm" className="bg-[#7a219f] hover:bg-[#7a219f]/80 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]">
            <Plus className="h-4 w-4 mr-1" />
            Add Service
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {services.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No services found. Add your first service to get started.</p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#7a219f]/10 dark:border-[#efcafe]/20 p-4 hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/5 transition-colors bg-white dark:bg-[#7a219f]"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {service.image && (
                    <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-[#7a219f]/5 dark:bg-[#efcafe]/10">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-[#7a219f] dark:text-[#efcafe] truncate">
                        {service.title}
                      </h4>
                      {service.requiresInquiry && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 whitespace-nowrap">
                          Contact for Price
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-semibold text-[#efcafe] dark:text-[#7a219f]">
                        {service.price ? `$${service.price}` : "Contact for pricing"}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ~60 min
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7a219f] dark:text-[#efcafe]">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-[#7a219f] border-[#7a219f]/10 dark:border-[#efcafe]/20">
                    <DropdownMenuItem onClick={() => openEditDialog(service)} className="text-[#7a219f] dark:text-[#efcafe]/80">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => confirmDelete(service)}
                      className="text-red-600 focus:text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#7a219f]">
          <DialogHeader>
            <DialogTitle className="text-[#7a219f] dark:text-[#efcafe]">
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Update the service details below."
                : "Fill in the details to add a new service."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Service Image</Label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden border border-[#7a219f]/10 dark:border-[#efcafe]/20">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 hover:bg-red-700"
                        onClick={handleImageRemove}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="h-24 w-24 shrink-0 rounded-lg border-2 border-dashed border-[#7a219f]/20 dark:border-[#efcafe]/30 flex items-center justify-center bg-[#7a219f]/5 dark:bg-[#efcafe]/5">
                      <Package className="h-8 w-8 text-[#7a219f]/30 dark:text-[#efcafe]/30" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="service-image"
                    />
                    <Label
                      htmlFor="service-image"
                      className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10 transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Service Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Botox Treatment"
                  required
                  className="border-[#7a219f]/10 dark:border-[#efcafe]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 250"
                  className="border-[#7a219f]/10 dark:border-[#efcafe]/20"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for "Contact for Price" services
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the service..."
                  rows={3}
                  required
                  className="border-[#7a219f]/10 dark:border-[#efcafe]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                <Input
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="e.g., Wrinkle reduction, Radiant skin"
                  className="border-[#7a219f]/10 dark:border-[#efcafe]/20"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requiresInquiry">Requires Consultation</Label>
                  <p className="text-xs text-muted-foreground">
                    Hide price, require contact for pricing
                  </p>
                </div>
                <Switch
                  id="requiresInquiry"
                  checked={formData.requiresInquiry}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, requiresInquiry: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isUploading}
                className="bg-[#7a219f] hover:bg-[#7a219f]/80 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : isPending ? (
                  "Saving..."
                ) : editingService ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-[#7a219f]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#7a219f] dark:text-[#efcafe]">Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{serviceToDelete?.title}&quot;? This
              action cannot be undone. Services with existing bookings cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
