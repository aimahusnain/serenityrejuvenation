import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enrichBookings, parsePrice } from "@/lib/dashboard";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get user with their bookings and preferences
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { date: "desc" },
        },
        preferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get products for enrichment
    const products = await prisma.product.findMany();

    // Enrich bookings with service details
    const enrichedBookings = enrichBookings(
      user.bookings.map((b) => ({
        id: b.id,
        userId: b.userId,
        serviceId: b.serviceId,
        date: b.date,
        status: b.status,
        notes: b.notes,
        createdAt: b.createdAt,
      })),
      products.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description,
        image: p.image,
        requiresInquiry: p.requiresInquiry,
      }))
    );

    // Calculate spending
    const completedBookings = enrichedBookings.filter((b) => b.status === "COMPLETED");
    const totalSpending = completedBookings.reduce((sum, b) => sum + b.servicePrice, 0);
    const pendingSpending = enrichedBookings
      .filter((b) => b.status === "PENDING" || b.status === "CONFIRMED")
      .reduce((sum, b) => sum + b.servicePrice, 0);

    // Count by status
    const statusCounts = {
      PENDING: enrichedBookings.filter((b) => b.status === "PENDING").length,
      CONFIRMED: enrichedBookings.filter((b) => b.status === "CONFIRMED").length,
      COMPLETED: enrichedBookings.filter((b) => b.status === "COMPLETED").length,
      CANCELLED: enrichedBookings.filter((b) => b.status === "CANCELLED").length,
    };

    return NextResponse.json({
      client: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.preferences?.phone || null,
        preferredServices: user.preferences?.preferredServices || [],
        emailNotifications: user.preferences?.emailNotifications ?? true,
        createdAt: user.createdAt,
        totalSpending,
        pendingSpending,
        totalBookings: enrichedBookings.length,
        statusCounts,
        bookings: enrichedBookings,
      },
    });
  } catch (error) {
    console.error("Error fetching client details:", error);
    return NextResponse.json({ error: "Failed to fetch client details" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { phone, preferredServices, emailNotifications } = body;

    // Upsert preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: id },
      create: {
        userId: id,
        phone: phone || null,
        preferredServices: preferredServices || [],
        emailNotifications: emailNotifications ?? true,
      },
      update: {
        ...(phone !== undefined && { phone: phone || null }),
        ...(preferredServices !== undefined && { preferredServices: preferredServices || [] }),
        ...(emailNotifications !== undefined && { emailNotifications }),
      },
    });

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error("Error updating client preferences:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}
