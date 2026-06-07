import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get preferences
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    // Get bookings
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        status: true,
        notes: true,
        serviceId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Fetch service details for each booking
    const bookingsWithServices = await Promise.all(
      bookings.map(async (booking) => {
        const service = await prisma.product.findUnique({
          where: { id: booking.serviceId },
          select: { id: true, title: true, price: true },
        });
        return {
          ...booking,
          service,
        };
      })
    );

    // Get inquiries
    const inquiries = await prisma.serviceInquiry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        preferredDate: true,
        preferredTime: true,
        notes: true,
        status: true,
        proposedPrice: true,
        counterOffer: true,
        serviceId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Fetch service details for each inquiry
    const inquiriesWithServices = await Promise.all(
      inquiries.map(async (inquiry) => {
        const service = await prisma.product.findUnique({
          where: { id: inquiry.serviceId },
          select: { id: true, title: true },
        });
        return {
          ...inquiry,
          service,
        };
      })
    );

    // Compile export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        ...user,
        password: "***REDACTED***",
      },
      preferences: preferences || null,
      bookings: bookingsWithServices,
      inquiries: inquiriesWithServices,
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error("Export data error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
