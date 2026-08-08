import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const {
      type,
      name,
      email,
      message,
      service,
      appointmentDate,
      notes,
      phone,
    } = payload;

    const isAppointmentEmail = type === "appointment" || Boolean(service && appointmentDate);
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    if (!adminEmail) {
      return NextResponse.json(
        { error: "Admin email is not configured" },
        { status: 500 }
      );
    }

    if (isAppointmentEmail) {
      if (!service || !appointmentDate) {
        return NextResponse.json(
          { error: "Service and appointment date are required" },
          { status: 400 }
        );
      }
      if (!email) {
        return NextResponse.json(
          { error: "Customer email is required for appointment confirmation" },
          { status: 400 }
        );
      }
    } else {
      if (!name || !email || !message) {
        return NextResponse.json(
          { error: "Name, email, and message are required" },
          { status: 400 }
        );
      }
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const formattedDate = appointmentDate
      ? new Date(appointmentDate).toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "short",
        })
      : "N/A";

    // Email to admin/store owner
    const adminMailOptions = {
      from: process.env.EMAIL_USER || adminEmail,
      to: adminEmail,
      replyTo: email || process.env.EMAIL_USER || adminEmail,

      subject: isAppointmentEmail
        ? `Reminder: New Appointment Booked – ${service}`
        : `New Message From ${name}`,

      html: isAppointmentEmail
        ? `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">

            <header style="background: linear-gradient(135deg, #7a219f, #a855f7); padding: 25px; text-align: center;">
              <h1 style="font-size: 28px; color: #fff; margin: 0;">
                Appointment Reminder
              </h1>
              <p style="font-size: 16px; color: #fff; margin: 10px 0 0;">
                A new appointment has been booked
              </p>
            </header>

            <div style="padding: 24px; background: #fff; color: #333;">

              <p style="font-size: 17px; margin: 0 0 20px;">
                This is a reminder that a new appointment has been booked.
                Please review the appointment details below.
              </p>

              <div style="background: #f8f5fb; padding: 18px; border-radius: 8px; margin-bottom: 20px;">

                <p style="font-size: 16px; margin: 0 0 12px;">
                  <strong>Client Name:</strong> ${name || "Unknown"}
                </p>

                <p style="font-size: 16px; margin: 0 0 12px;">
                  <strong>Email:</strong> ${email || "Not provided"}
                </p>

                <p style="font-size: 16px; margin: 0 0 12px;">
                  <strong>Phone:</strong> ${phone || "Not provided"}
                </p>

                <p style="font-size: 16px; margin: 0 0 12px;">
                  <strong>Service:</strong> ${service}
                </p>

                <p style="font-size: 16px; margin: 0 0 12px;">
                  <strong>Appointment Date:</strong> ${formattedDate}
                </p>

                <p style="font-size: 16px; margin: 0;">
                  <strong>Notes:</strong> ${notes || "No additional notes"}
                </p>

              </div>

              <p style="font-size: 15px; color: #666; margin: 0;">
                Please make sure the appointment is reviewed and prepared for accordingly.
              </p>

            </div>

            <footer style="background-color: #f5f5f5; padding: 12px; text-align: center;">
              <p style="font-size: 14px; color: #666; margin: 0;">
                &copy; ${new Date().getFullYear()} Serenity Rejuvenation. All rights reserved.
              </p>
            </footer>

          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <header style="background-color: #f5f5f5; padding: 20px; text-align: center;">
              <h1 style="font-size: 24px; color: #333; margin: 0;">
                New Message From ${name}
              </h1>
            </header>

            <div style="padding: 20px;">
              <p style="font-size: 16px; color: #666;">
                <strong>Name:</strong> ${name}
              </p>
              <p style="font-size: 16px; color: #666;">
                <strong>Email:</strong> ${email}
              </p>
              <p style="font-size: 16px; color: #666;">
                <strong>Message:</strong> ${message}
              </p>
            </div>

            <footer style="background-color: #f5f5f5; padding: 10px; text-align: center;">
              <p style="font-size: 14px; color: #999; margin: 0;">
                &copy; ${new Date().getFullYear()} Serenity Rejuvenation. All rights reserved.
              </p>
            </footer>
          </div>
        `,
    };

    // Email to customer (for appointment confirmations)
    const customerMailOptions = isAppointmentEmail ? {
      from: process.env.EMAIL_USER || adminEmail,
      to: email,
      subject: `Appointment Confirmation – ${service}`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">

          <header style="background: linear-gradient(135deg, #7a219f, #a855f7); padding: 25px; text-align: center;">
            <h1 style="font-size: 28px; color: #fff; margin: 0;">
              Appointment Confirmed
            </h1>
            <p style="font-size: 16px; color: #fff; margin: 10px 0 0;">
              Your appointment has been successfully booked
            </p>
          </header>

          <div style="padding: 24px; background: #fff; color: #333;">

            <p style="font-size: 17px; margin: 0 0 20px;">
              Dear ${name || "Valued Customer"},
            </p>

            <p style="font-size: 16px; margin: 0 0 20px;">
              Thank you for booking your appointment with Serenity Rejuvenation.
              Your appointment has been confirmed and we look forward to seeing you.
            </p>

            <div style="background: #f8f5fb; padding: 18px; border-radius: 8px; margin-bottom: 20px;">

              <p style="font-size: 16px; margin: 0 0 12px;">
                <strong>Service:</strong> ${service}
              </p>

              <p style="font-size: 16px; margin: 0 0 12px;">
                <strong>Appointment Date:</strong> ${formattedDate}
              </p>

              <p style="font-size: 16px; margin: 0;">
                <strong>Notes:</strong> ${notes || "No additional notes"}
              </p>

            </div>

            <p style="font-size: 15px; color: #666; margin: 0 0 10px;">
              Please arrive 10-15 minutes before your appointment time.
            </p>

            <p style="font-size: 15px; color: #666; margin: 0;">
              If you need to reschedule or cancel, please contact us as soon as possible.
            </p>

          </div>

          <footer style="background-color: #f5f5f5; padding: 12px; text-align: center;">
            <p style="font-size: 14px; color: #666; margin: 0;">
              &copy; ${new Date().getFullYear()} Serenity Rejuvenation. All rights reserved.
            </p>
          </footer>

        </div>
      `
    } : null;

    try {
      // Send email to admin
      console.log("Sending admin email to:", adminEmail);
      await transporter.sendMail(adminMailOptions);
      console.log("Admin email sent successfully");

      // Send confirmation email to customer for appointments
      if (isAppointmentEmail && customerMailOptions) {
        console.log("Sending customer confirmation email to:", email);
        await transporter.sendMail(customerMailOptions);
        console.log("Customer confirmation email sent successfully");
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("=== EMAIL SENDING ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      console.error("Email type:", isAppointmentEmail ? "appointment" : "contact");
      console.error("Recipient:", isAppointmentEmail ? `Admin: ${adminEmail}, Customer: ${email}` : adminEmail);
      console.error("=========================");
      
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error("Unexpected error:", e);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong! Please try again",
      },
      { status: 500 }
    );
  }
}