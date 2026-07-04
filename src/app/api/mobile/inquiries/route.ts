// /api/mobile/inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new service inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, serviceId, name, email, phone, preferredDate, preferredTime, notes } = body;

    // Validate required fields
    if (!userId || !serviceId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'userId, serviceId, name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if service exists
    const service = await prisma.product.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Create inquiry
    const inquiry = await prisma.serviceInquiry.create({
      data: {
        userId,
        serviceId,
        name,
        email,
        phone,
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        notes: notes || null,
        status: 'PENDING',
      },
    });

    // Get service details for response
    const inquiryWithService = await prisma.serviceInquiry.findUnique({
      where: { id: inquiry.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      inquiry: inquiryWithService,
      message: 'Inquiry created successfully. We will contact you shortly.',
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}

// Get user's inquiries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const inquiries = await prisma.serviceInquiry.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get service details for each inquiry
    const inquiriesWithServices = await Promise.all(
      inquiries.map(async (inquiry) => {
        const service = await prisma.product.findUnique({
          where: { id: inquiry.serviceId },
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            price: true,
            requiresInquiry: true,
          },
        });

        return {
          ...inquiry,
          service,
        };
      })
    );

    return NextResponse.json({
      inquiries: inquiriesWithServices,
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}