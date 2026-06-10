import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all inquiries for the current user (admin can see all)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Admins can see all inquiries, regular users only their own
    const inquiries = await prisma.serviceInquiry.findMany({
      where: user.role === "ADMIN" ? {} : { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch service details for each inquiry
    const inquiriesWithServices = await Promise.all(
      inquiries.map(async (inquiry) => {
        const service = await prisma.product.findUnique({
          where: { id: inquiry.serviceId },
          select: { id: true, title: true, description: true, image: true },
        });
        return {
          ...inquiry,
          service,
        };
      })
    );

    return NextResponse.json({ inquiries: inquiriesWithServices });
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

// POST create a new service inquiry
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serviceId, name, email, phone, preferredDate, preferredTime, notes } =
      await request.json();

    if (!serviceId || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the service exists and requires inquiry
    const service = await prisma.product.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Create the inquiry
    const inquiry = await prisma.serviceInquiry.create({
      data: {
        userId: session.user.id,
        serviceId,
        name,
        email,
        phone,
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        notes: notes || null,
      },
    });

    // TODO: Send notification to spa owner
    // This would integrate with your email/SMS service
    // await sendInquiryNotification(inquiry, service);

    return NextResponse.json({
      success: true,
      inquiry,
      message:
        "Your inquiry has been submitted. We'll contact you shortly to confirm pricing and availability.",
    });
  } catch (error) {
    console.error("Failed to create inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

// PATCH update inquiry - handles multiple actions:
// - Admin: propose price, respond to counter-offer
// - User: accept/decline quote, send counter-offer
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { inquiryId, action, ...data } = body;

    if (!inquiryId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.serviceInquiry.findUnique({
      where: { id: inquiryId },
      include: { user: true },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const isAdmin = session.user.id === inquiry.user.id
      ? false
      : await prisma.user
          .findUnique({ where: { id: session.user.id }, select: { role: true } })
          .then((u) => u?.role === "ADMIN");

    // Handle different actions
    switch (action) {
      // Admin actions
      case "proposeQuote": {
        if (!isAdmin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { proposedPrice, proposedDate, proposedTime, message } = data;
        if (!proposedPrice) {
          return NextResponse.json(
            { error: "Price is required" },
            { status: 400 }
          );
        }

        const updated = await prisma.serviceInquiry.update({
          where: { id: inquiryId },
          data: {
            proposedPrice,
            proposedDate: proposedDate || inquiry.preferredDate,
            proposedTime: proposedTime || inquiry.preferredTime,
            status: "QUOTED",
            counterOffer: null,
            counterNote: null,
            adminResponse: message || null,
          },
        });

        // TODO: Send notification to user
        // await sendQuoteNotification(updated);

        return NextResponse.json({
          success: true,
          inquiry: updated,
          message: "Quote sent to customer",
        });
      }

      case "respondToCounter": {
        if (!isAdmin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { acceptCounter, newPrice, message } = data;
        if (acceptCounter) {
          // Check if inquiry already has a booking (already accepted)
          if (inquiry.bookingId) {
            // Verify the booking still exists
            const existingBooking = await prisma.booking.findUnique({
              where: { id: inquiry.bookingId },
            });

            if (existingBooking) {
              return NextResponse.json({
                success: true,
                booking: existingBooking,
                message: "Booking already created for this inquiry.",
              });
            }
          }

          // User accepted counter-offer, create booking
          const booking = await prisma.booking.create({
            data: {
              userId: inquiry.userId,
              serviceId: inquiry.serviceId,
              date: new Date(
                inquiry.proposedDate || inquiry.preferredDate || ""
              ),
              status: "CONFIRMED",
              notes: `Price: $${inquiry.counterOffer}. ${inquiry.notes || ""}`,
            },
          });

          await prisma.serviceInquiry.update({
            where: { id: inquiryId },
            data: { status: "ACCEPTED", bookingId: booking.id },
          });

          return NextResponse.json({
            success: true,
            booking,
            message: "Booking created successfully",
          });
        } else {
          // Admin proposes new price
          if (!newPrice) {
            return NextResponse.json(
              { error: "New price is required" },
              { status: 400 }
            );
          }

          const updated = await prisma.serviceInquiry.update({
            where: { id: inquiryId },
            data: {
              proposedPrice: newPrice,
              status: "QUOTED",
              adminResponse: message || null,
            },
          });

          // TODO: Send notification to user
          // await sendNewQuoteNotification(updated);

          return NextResponse.json({
            success: true,
            inquiry: updated,
            message: "New quote sent to customer",
          });
        }
      }

      // User actions
      case "acceptQuote": {
        if (isAdmin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        if (inquiry.userId !== session.user.id) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (!inquiry.proposedPrice) {
          return NextResponse.json(
            { error: "No quote to accept" },
            { status: 400 }
          );
        }

        // Check if inquiry already has a booking (already accepted)
        if (inquiry.bookingId) {
          // Verify the booking still exists
          const existingBooking = await prisma.booking.findUnique({
            where: { id: inquiry.bookingId },
          });

          if (existingBooking) {
            return NextResponse.json({
              success: true,
              booking: existingBooking,
              message: "Booking already confirmed! Check your dashboard for details.",
            });
          }
        }

        // Create booking
        const booking = await prisma.booking.create({
          data: {
            userId: inquiry.userId,
            serviceId: inquiry.serviceId,
            date: new Date(
              inquiry.proposedDate || inquiry.preferredDate || ""
            ),
            status: "CONFIRMED",
            notes: `Price: $${inquiry.proposedPrice}. ${inquiry.notes || ""}`,
          },
        });

        await prisma.serviceInquiry.update({
          where: { id: inquiryId },
          data: { status: "ACCEPTED", bookingId: booking.id },
        });

        // TODO: Send confirmation notifications
        // await sendBookingConfirmation(booking, inquiry);

        return NextResponse.json({
          success: true,
          booking,
          message: "Booking confirmed! Check your dashboard for details.",
        });
      }

      case "declineQuote": {
        if (isAdmin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        if (inquiry.userId !== session.user.id) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.serviceInquiry.update({
          where: { id: inquiryId },
          data: { status: "DECLINED" },
        });

        // TODO: Send notification to admin
        // await sendDeclineNotification(inquiry);

        return NextResponse.json({
          success: true,
          message: "Quote declined. We appreciate your feedback.",
        });
      }

      case "sendCounterOffer": {
        if (isAdmin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        if (inquiry.userId !== session.user.id) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { counterOffer, counterNote } = data;
        if (!counterOffer) {
          return NextResponse.json(
            { error: "Counter offer amount is required" },
            { status: 400 }
          );
        }

        const updated = await prisma.serviceInquiry.update({
          where: { id: inquiryId },
          data: {
            status: "COUNTERED",
            counterOffer,
            counterNote: counterNote || null,
          },
        });

        // TODO: Send notification to admin
        // await sendCounterOfferNotification(updated);

        return NextResponse.json({
          success: true,
          inquiry: updated,
          message: "Counter-offer sent to the spa owner.",
        });
      }

      case "cancelInquiry": {
        if (inquiry.userId !== session.user.id && !isAdmin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.serviceInquiry.update({
          where: { id: inquiryId },
          data: { status: "CANCELLED" },
        });

        return NextResponse.json({
          success: true,
          message: "Inquiry cancelled",
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to update inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

// DELETE inquiry (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const inquiryId = searchParams.get("id");

    if (!inquiryId) {
      return NextResponse.json(
        { error: "Missing inquiry ID" },
        { status: 400 }
      );
    }

    await prisma.serviceInquiry.delete({
      where: { id: inquiryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
