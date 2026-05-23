import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function Mission() {
  return (
    <main className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
        {/* Left Column - Content */}
        <div className="px-8 sm:px-12 lg:px-16 py-12 lg:py-24">
          <div className="max-w-2xl relative">
            {/* Decorative Background Element */}
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: '#d2b48c' }}></div>

            {/* Header Label */}
            <p className="text-xs font-semibold tracking-widest uppercase mb-6 relative z-10" style={{ color: '#d2b48c' }}>
            Serenity Rejuvenation Aesthetics & Wellness
            </p>

            {/* Main Heading - Script Style */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-8 relative z-10 italic" style={{ color: '#7a8a8a', fontFamily: 'Georgia, serif' }}>
              Helping you feel better about you!
            </h2>

            {/* Body Text - Paragraph 1 */}
            <p className="text-base leading-relaxed mb-6 relative z-10" style={{ color: '#1a1a1a' }}>
              At Serenity Rejuvenation Aesthetics & Wellness, we believe beauty isn&apos;t about perfection. It&apos;s about feeling confident, comfortable, and happy in your skin. When you feel good on the inside, it naturally shows on the outside. Our goal is to help you bring out that inner confidence through personalized aesthetic and wellness care designed just for you.
            </p>

            {/* Body Text - Paragraph 2 */}
            <p className="text-base leading-relaxed mb-6 relative z-10" style={{ color: '#1a1a1a' }}>
              We know that choosing the right treatment or provider can feel overwhelming. That&apos;s why our team takes the time to truly listen, understand your goals, and guide you every step of the way. You&apos;ll never feel rushed or pressured, just supported, informed, and cared for. Whether you&apos;re seeking subtle enhancements or transformative results, our mission is to help you look refreshed, feel rejuvenated, and embrace your most confident self, both inside and out.
            </p>

            {/* Body Text - Paragraph 3 */}
            <p className="text-base leading-relaxed mb-12 relative z-10" style={{ color: '#1a1a1a' }}>
              We&apos;re here to make your experience comfortable, your results meaningful, and your journey empowering. Your satisfaction isn&apos;t just important to us, it&apos;s what drives everything we do. Because at Serenity Rejuvenation Aesthetics & Wellness, helping you feel better about yourself is what we&apos;re all about.
            </p>

            {/* CTA Button */}
            <button className="inline-flex items-center gap-2 px-8 py-3 font-semibold tracking-wider uppercase transition-colors duration-300 relative z-10" style={{ backgroundColor: '#d2b48c', color: '#000000' }}>
              Book an Appointment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="relative h-96 lg:h-screen">
          <Image
            src="/HELPINGYOUFEELBETTER.webp"
            alt="Conqr Aesthetics & Wellness Team with Client"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </main>
  );
}
