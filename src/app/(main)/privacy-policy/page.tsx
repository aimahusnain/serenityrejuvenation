import Link from "next/link";
import { FileText, Shield, Eye, Mail, Cookie, Calendar } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Serenity Rejuvenation",
  description: "Learn how Serenity Rejuvenation protects your privacy and handles your personal information.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        {
          heading: "Personal Information",
          text: "When you book appointments or create an account, we collect information such as your full name, email address, phone number, and mailing address. This information is essential for providing our services and communicating with you about your bookings.",
        },
        {
          heading: "Health & Wellness Information",
          text: "For certain spa treatments, we may collect relevant health information to ensure your safety and provide appropriate services. This includes allergies, medical conditions, or specific preferences that may affect your treatment experience.",
        },
        {
          heading: "Payment Information",
          text: "Payment processing is handled through secure third-party payment processors. We do not store complete credit card numbers on our servers. All payment transactions are encrypted using industry-standard SSL technology.",
        },
        {
          heading: "Account Information",
          text: "When you create an account, we store your credentials securely using industry-standard encryption. Your password is hashed and salted, and we never store it in plain text.",
        },
      ],
    },
    {
      icon: Shield,
      title: "How We Use Your Information",
      content: [
        {
          heading: "Service Delivery",
          text: "We use your information to schedule and manage your appointments and provide the spa services you request. This includes sending appointment confirmations and reminders.",
        },
        {
          heading: "Communication",
          text: "With your permission, we may send you promotional emails about special offers, new treatments, and spa packages. You can opt out of marketing communications at any time through your account settings or by replying 'STOP' to our messages.",
        },
        {
          heading: "Improvement & Analytics",
          text: "We analyze usage patterns to improve our services, optimize appointment scheduling, and enhance your overall experience. This helps us understand which treatments are most popular and how to serve you better.",
        },
        {
          heading: "Legal Compliance",
          text: "We may use your information to comply with legal obligations, respond to lawful requests, and protect our rights, privacy, safety, and property.",
        },
      ],
    },
    {
      icon: Mail,
      title: "Information Sharing",
      content: [
        {
          heading: "Third-Party Service Providers",
          text: "We work with trusted third parties to help us operate our business, including payment processors, email service providers, and booking management tools. These partners have limited access to your information only as necessary to perform their services.",
        },
        {
          heading: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction. We will notify you of any such change in control.",
        },
        {
          heading: "Legal Requirements",
          text: "We may disclose information if required to do so by law or in response to lawful requests from authorities, or to protect our rights and prevent fraud.",
        },
        {
          heading: "With Your Consent",
          text: "We may share your information with third parties when you explicitly consent to such sharing.",
        },
      ],
    },
    {
      icon: Cookie,
      title: "Cookies & Tracking",
      content: [
        {
          heading: "Essential Cookies",
          text: "We use essential cookies to ensure the website functions properly, including maintaining your session and authentication state. These cookies cannot be disabled.",
        },
        {
          heading: "Analytics Cookies",
          text: "We use analytics tools to understand how visitors interact with our website. This helps us improve user experience and identify popular features.",
        },
        {
          heading: "Preference Cookies",
          text: "We use preference cookies to remember your settings, such as theme preferences (light/dark mode) and language selections.",
        },
        {
          heading: "Cookie Management",
          text: "You can manage cookie preferences through your browser settings. However, disabling certain cookies may affect website functionality.",
        },
      ],
    },
    {
      icon: Calendar,
      title: "Data Retention & Your Rights",
      content: [
        {
          heading: "Data Retention",
          text: "We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Account information is retained until you delete your account. Booking records are retained for business and legal purposes.",
        },
        {
          heading: "Your Rights",
          text: "You have the right to access, correct, or delete your personal information. You can update your profile information through your account dashboard or contact us for assistance. You may also request data portability or opt out of data collection where permitted by law.",
        },
        {
          heading: "Account Deletion",
          text: "You may request deletion of your account and personal information by contacting us or through your account settings. We will process your request within 30 days, subject to legal obligations.",
        },
        {
          heading: "Data Security",
          text: "We implement industry-standard security measures including encryption, secure servers, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7a219f]/5 to-transparent dark:from-[#efcafe]/5">
      {/* Header */}
      <div className="bg-[#7a219f] dark:bg-[#efcafe] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 dark:bg-[#7a219f]/10 mb-6">
              <FileText className="w-8 h-8 text-white dark:text-[#7a219f]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-[#7a219f] mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/80 dark:text-[#7a219f]/80">
              Your privacy matters to us. Learn how we protect and use your information.
            </p>
            <p className="text-sm text-white/60 dark:text-[#7a219f]/60 mt-4">
              Last Updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="bg-white dark:bg-[#7a219f] rounded-2xl p-8 shadow-sm border border-[#7a219f]/10 dark:border-[#efcafe]/20">
            <p className="text-[#7a219f]/70 dark:text-[#efcafe]/70 leading-relaxed text-lg">
              At <strong className="text-[#7a219f] dark:text-[#efcafe]">Serenity Rejuvenation</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website, book appointments, or use our services.
            </p>
            <p className="text-[#7a219f]/70 dark:text-[#efcafe]/70 leading-relaxed text-lg mt-4">
              By using our services, you agree to the terms of this Privacy Policy. If you do not agree with these terms, please do not use our website or services.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <div
                key={sectionIndex}
                className="bg-white dark:bg-[#7a219f] rounded-2xl shadow-sm border border-[#7a219f]/10 dark:border-[#efcafe]/20 overflow-hidden"
              >
                {/* Section Header */}
                <div className="bg-[#7a219f]/5 dark:bg-[#efcafe]/10 px-8 py-6 flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#7a219f] dark:bg-[#efcafe]">
                    <Icon className="w-6 h-6 text-white dark:text-[#7a219f]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#7a219f] dark:text-[#efcafe]">
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
                          ? "border-b border-[#7a219f]/10 dark:border-[#efcafe]/15"
                          : ""
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-[#7a219f] dark:text-[#efcafe] mb-2">
                        {item.heading}
                      </h3>
                      <p className="text-[#7a219f]/60 dark:text-[#efcafe]/70 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-[#7a219f] to-[#0a3a66] dark:from-[#efcafe] dark:to-[#7a219f] rounded-2xl p-8 text-white dark:text-[#7a219f]">
            <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
            <p className="text-white/80 dark:text-[#7a219f]/80 mb-6">
              If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> privacy@serenityrejuvenation.com</p>
              <p><strong>Phone:</strong> (555) 123-4567</p>
              <p><strong>Hours:</strong> Daily 8:00 AM - 5:00 PM</p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 dark:border-[#7a219f]/20">
              <p className="text-sm text-white/70 dark:text-[#7a219f]/70">
                We will respond to your privacy-related inquiries within 30 business days.
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#7a219f] dark:text-[#efcafe] hover:text-[#7a219f]/80 dark:hover:text-[#efcafe]/80 font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
