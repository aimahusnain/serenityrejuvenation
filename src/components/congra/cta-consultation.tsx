import Image from 'next/image'

export default function CTAConsultation() {
  return (
    <section className="relative h-96 lg:h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <Image
        src="/cta-consultation.jpg"
        alt="Free consultation CTA"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="font-serif text-4xl lg:text-6xl text-white mb-6 lg:mb-8 text-balance">
          SCHEDULE YOUR FREE CONSULTATION TODAY!
        </h2>
        
        <p className="font-serif text-5xl lg:text-7xl text-white mb-8 font-light">
          (404) 446-9566
        </p>

        <button className="inline-block bg-[#d2b48c] text-black px-8 py-3 font-semibold tracking-wider hover:bg-[#c9a876] transition-colors">
          BOOK AN APPOINTMENT →
        </button>
      </div>
    </section>
  )
}
