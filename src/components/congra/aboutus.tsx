import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function AboutUs() {
  return (
    <main className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
        {/* Left Column - Image */}
        <div className="relative h-96 lg:h-screen">
          <Image
            src="/Find-Your-Balance-Section-in-Atlanta-GA-at-Conqr-Aesthetics-and-Wellness.webp"
            alt="Conqr Aesthetics & Wellness Team"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Column - Content */}
        <div className="px-8 sm:px-12 lg:px-16 py-12 lg:py-24">
          <div className="max-w-2xl">
            {/* Header Label */}
            <p className="text-xs font-text font-semibold tracking-widest uppercase mb-8" style={{ color: '#d2b48c' }}>
              Serenity Rejuvenation
            </p>

            {/* Main Heading */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-8 uppercase" style={{ color: '#000000' }}>
              Find your balance, your confidence, and your bliss right here.
            </h1>

            {/* Body Text - Paragraph 1 */}
            <p className="font-text text-base leading-relaxed mb-6" style={{ color: '#1a1a1a' }}>
              At Serenity Rejuvenation Aesthetics & Wellness in Buckhead, Georgia, we believe that true beauty radiates from within. Our modern and innovative space is dedicated to helping you achieve your aesthetic goals and enhance your overall well-being.
            </p>

            {/* Body Text - Paragraph 2 */}
            <p className="font-text text-base leading-relaxed mb-6" style={{ color: '#1a1a1a' }}>
              Led by Brandi Milton, NP-C, our team of experienced professionals is committed to providing the highest quality medical aesthetic and wellness treatments in a comfortable and luxurious environment. We specialize in anti-aging solutions, using advanced technology and medical-grade products to deliver exceptional results.
            </p>

            {/* Body Text - Paragraph 3 */}
            <p className="font-text text-base leading-relaxed mb-12" style={{ color: '#1a1a1a' }}>
              Our holistic approach focuses on enhancing natural beauty while nurturing overall well-being, helping each client feel confident inside and out. From your initial consultation to your post-treatment care, we take the time to listen, understand your goals, and create a plan specifically for you.
            </p>

            {/* CTA Button */}
            <button
  className="inline-flex items-center gap-2 px-8 py-3 font-text font-semibold tracking-wider uppercase transition-colors duration-300 bg-[#d2b48c] text-black hover:bg-[#a67b5b]"
>
  Book an Appointment
  <ArrowRight className="w-5 h-5" />
</button>
          </div>
        </div>
      </div>
    </main>
  );
}
