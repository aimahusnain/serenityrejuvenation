"use client";

import Link from "next/link";
import { Calendar, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InquiryForm } from "@/components/service-inquiry/InquiryForm";

export interface ProductLite {
  id: string;
  title: string;
  price: string | null;
  description: string;
  image?: string;
  requiresInquiry?: boolean;
}

interface ServiceCardProps {
  service: ProductLite;
  showInquiryButton?: boolean;
}

export function ServiceCard({ service, showInquiryButton = false }: ServiceCardProps) {
  const isContactForPrice = service.requiresInquiry || !service.price;

  return (
    <Card className="group overflow-hidden border-border/60 hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#271024]/5 dark:bg-[#e3ae72]/10">
        {service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Calendar className="h-16 w-16 text-[#271024]/20 dark:text-[#e3ae72]/20" />
          </div>
        )}
        {isContactForPrice && (
          <Badge className="absolute top-3 right-3 bg-[#e3ae72] text-[#271024]">
            Contact for Price
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-[#271024] dark:text-[#e3ae72] line-clamp-1">
              {service.title}
            </CardTitle>
            {service.price && !isContactForPrice ? (
              <p className="text-lg font-semibold text-[#e3ae72] dark:text-[#271024] mt-1">
                ${service.price}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Pricing upon consultation
              </p>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {service.description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="pt-0">
        {isContactForPrice || showInquiryButton ? (
          <InquiryForm service={service} />
        ) : (
          <Link href={`/book?service=${service.id}`} className="w-full">
            <Button
              className="w-full bg-[#271024] text-white hover:bg-[#271024]/90 dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
            >
              Book Now
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

// Grid wrapper for service cards
export function ServiceGrid({ services }: { services: ProductLite[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
