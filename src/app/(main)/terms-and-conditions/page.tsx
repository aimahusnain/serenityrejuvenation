import Link from "next/link";
import { FileText, Calendar, CreditCard, User, AlertCircle, Clock } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions - Serenity Rejuvenation",
  description: "Terms and conditions for Serenity Rejuvenation spa services, bookings, and purchases.",
};

export default function TermsAndConditionsPage() {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        {
          heading: "Agreement to Terms",
          text: "By accessing our website, booking appointments, or using any services provided by Serenity Rejuvenation, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please refrain from using our services.",
        },
        {
          heading: "Changes to Terms",
          text: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the revised terms.",
        },
        {
          heading: "Age Requirement",
          text: "You must be at least 18 years old to create an account and purchase our services. By using our services, you represent that you are of legal age and have the capacity to enter into these terms.",
        },
        {
          heading: "Account Responsibility",
          text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.",
        },
      ],
    },
    {
      icon: Calendar,
      title: "Bookings & Appointments",
      content: [
        {
          heading: "Booking Process",
          text: "Appointments can be booked through our website, by phone, or in-person. All bookings are subject to availability and confirmation. We recommend booking in advance, especially for weekend appointments.",
        },
        {
          heading: "Cancellations",
          text: "Cancellations must be made at least 24 hours before your scheduled appointment to avoid a cancellation fee. Late cancellations or no-shows may be charged the full service price or a $50 fee, whichever is less.",
        },
        {
          heading: "Arrival Time",
          text: "Please arrive 10-15 minutes before your appointment to complete any necessary paperwork and prepare for your treatment. Late arrivals may result in shortened service time at full price.",
        },
        {
          heading: "Health Conditions",
          text: "Please inform us of any health conditions, allergies, or pregnancy before your appointment. Certain treatments may not be suitable for individuals with specific health conditions. We reserve the right to refuse service if a treatment may pose health risks.",
        },
      ],
    },
    {
      icon: CreditCard,
      title: "Payments & Pricing",
      content: [
        {
          heading: "Pricing",
          text: "All prices are listed in USD and are subject to change without notice. The price quoted at the time of booking will be honored. We accept major credit cards, debit cards, and cash.",
        },
        {
          heading: "Payment Collection",
          text: "Payment is due at the time of service. For first-time clients or appointments over $200, we may require a credit card to hold the reservation. Your card will not be charged until the day of your appointment.",
        },
        {
          heading: "Gratuities",
          text: "Gratuities are not included in our service prices and are at your discretion. For your convenience, gratuities can be added to credit card payments.",
        },
        {
          heading: "Refunds",
          text: "Refunds are handled on a case-by-case basis. If you are dissatisfied with your service, please contact us within 24 hours. Refund requests made more than 7 days after service will not be considered.",
        },
      ],
    },
    {
      icon: User,
      title: "Client Conduct",
      content: [
        {
          heading: "Respectful Behavior",
          text: "We are committed to providing a safe and relaxing environment for all clients and staff. We reserve the right to refuse service or ask clients to leave who engage in disruptive, aggressive, or inappropriate behavior.",
        },
        {
          heading: "Prohibited Items",
          text: "For the comfort and safety of all guests, smoking, vaping, and consumption of alcohol or illegal substances are prohibited on our premises. Use of mobile phones is discouraged in treatment areas.",
        },
        {
          heading: "Personal Belongings",
          text: "We provide secure storage for your personal belongings during your treatment. However, we are not responsible for lost or stolen items. Please leave valuables at home.",
        },
        {
          heading: "Photography",
          text: "Photography and video recording are prohibited in treatment areas to protect client privacy and maintain a peaceful environment. Social media sharing is welcomed in our public areas only.",
        },
      ],
    },
    {
      icon: AlertCircle,
      title: "Limitation of Liability",
      content: [
        {
          heading: "Service Disclaimer",
          text: "Our spa services are designed for relaxation and wellness purposes. They are not intended to diagnose, treat, cure, or prevent any medical condition. Please consult healthcare professionals for medical concerns.",
        },
        {
          heading: "Allergic Reactions",
          text: "While we use high-quality products and conduct patch tests when requested, we cannot guarantee that allergic reactions will not occur. Please inform us of any known allergies.",
        },
        {
          heading: "Property Damage",
          text: "We are not liable for damage to personal property brought onto our premises. Clients use our facilities and equipment at their own risk.",
        },
        {
          heading: "Force Majeure",
          text: "We are not liable for failures or delays due to circumstances beyond our control, including natural disasters, power outages, or other emergencies.",
        },
      ],
    },
    {
      icon: Clock,
      title: "Operating Hours & Policies",
      content: [
        {
          heading: "Business Hours",
          text: "We are open daily from 8:00 AM to 5:00 PM. These hours may vary by season or holidays. We reserve the right to adjust hours without prior notice. Emergency closures may occur due to weather or facility issues.",
        },
        {
          heading: "Late Policy",
          text: "Clients arriving more than 15 minutes late may need to reschedule their appointment at full charge. This ensures we maintain our schedule and respect other clients' time.",
        },
        {
          heading: "Children Policy",
          text: "For the tranquility of all guests, children under 16 are not permitted in treatment areas unless receiving a service accompanied by a parent or guardian.",
        },
        {
          heading: "Pet Policy",
          text: "With the exception of service animals, pets are not permitted in our facility to accommodate clients with allergies.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#271024]/5 to-transparent dark:from-[#e3ae72]/5">
      {/* Header */}
      <div className="bg-[#271024] dark:bg-[#e3ae72] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 dark:bg-[#271024]/10 mb-6">
              <FileText className="w-8 h-8 text-white dark:text-[#271024]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-[#271024] mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-white/80 dark:text-[#271024]/80">
              Please review our terms for appointments, payments, and services.
            </p>
            <p className="text-sm text-white/60 dark:text-[#271024]/60 mt-4">
              Last Updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="bg-white dark:bg-[#271024] rounded-2xl p-8 shadow-sm border border-[#271024]/10 dark:border-[#e3ae72]/20">
            <p className="text-[#271024]/70 dark:text-[#e3ae72]/70 leading-relaxed text-lg">
              Welcome to <strong className="text-[#271024] dark:text-[#e3ae72]">Serenity Rejuvenation</strong>. These Terms and Conditions govern your use of our website, booking services, and all spa treatments provided by our establishment.
            </p>
            <p className="text-[#271024]/70 dark:text-[#e3ae72]/70 leading-relaxed text-lg mt-4">
              Please read these terms carefully before using our services. By booking an appointment or making a purchase, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <div
                key={sectionIndex}
                className="bg-white dark:bg-[#271024] rounded-2xl shadow-sm border border-[#271024]/10 dark:border-[#e3ae72]/20 overflow-hidden"
              >
                {/* Section Header */}
                <div className="bg-[#271024]/5 dark:bg-[#e3ae72]/10 px-8 py-6 flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#271024] dark:bg-[#e3ae72]">
                    <Icon className="w-6 h-6 text-white dark:text-[#271024]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#271024] dark:text-[#e3ae72]">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content */}
                <div className="p-8 space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`pb-6 ${
                        itemIndex < section.content.length - 1
                          ? "border-b border-[#271024]/10 dark:border-[#e3ae72]/15"
                          : ""
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72] mb-2">
                        {item.heading}
                      </h3>
                      <p className="text-[#271024]/60 dark:text-[#e3ae72]/70 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-[#271024] to-[#0a3a66] dark:from-[#e3ae72] dark:to-[#d49e5e] rounded-2xl p-8 text-white dark:text-[#271024]">
            <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
            <p className="text-white/80 dark:text-[#271024]/80 mb-6">
              If you have any questions about these Terms and Conditions or need clarification on any policies, please contact our customer service team:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> support@serenityrejuvenation.com</p>
              <p><strong>Phone:</strong> (555) 123-4567</p>
              <p><strong>Hours:</strong> Daily 8:00 AM - 5:00 PM</p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 dark:border-[#271024]/20">
              <p className="text-sm text-white/70 dark:text-[#271024]/70">
                We appreciate your business and look forward to serving you at Serenity Rejuvenation.
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#271024] dark:text-[#e3ae72] hover:text-[#271024]/80 dark:hover:text-[#e3ae72]/80 font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
