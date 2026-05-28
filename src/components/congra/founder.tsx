import Image from "next/image";

export default function Founder() {
  return (
    <section className="bg-black text-white py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative h-96 md:h-[600px] lg:h-[700px] w-full">
            <Image
              src="/brandi2-768x768.webp"
              alt="Brandi Milton, NP-C - Founder of Serenity Rejuvenation Aesthetics & Wellness"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            {/* Label */}
            <p className="text-[#d2b48c] text-sm font-light tracking-widest uppercase">
              Meet the face of Serenity Rejuvenation aesthetics & wellness
            </p>

            {/* Heading */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white">
              Brandi Milton, NP-C
            </h2>

            {/* Subheading */}
            <p className="text-[#d2b48c] text-sm md:text-base font-light tracking-wide uppercase">
              Master Injector & Founder of Serenity Rejuvenation Aesthetics &
              Wellness
            </p>

            {/* Bio paragraphs */}
            <div className="space-y-4 text-neutral-300 text-base md:text-lg leading-relaxed">
              <p>
                Meet Brandi Milton, the dynamic, board-certified Nurse
                Practitioner and visionary founder behind Serenity Rejuvenation
                Aesthetics & Wellness. Atlanta&apos;s rising name in modern
                beauty and holistic rejuvenation. With over a decade of
                experience in the medical field, Brandi has built her reputation
                on blending science, artistry, and compassion to help clients
                look and feel effortlessly confident.
              </p>

              <p>
                Brandi&apos;s philosophy is simple: beauty should never mask who
                you are; it should magnify it. Known for her expertise in
                anti-aging and natural enhancements, she customizes every
                treatment plan to celebrate individuality, empowering her
                clients to radiate confidence from the inside out.
              </p>

              <p>
                Originally from North Carolina and a proud graduate of the
                University of North Carolina at Chapel Hill, Brandi&apos;s
                journey from dedicated healthcare provider to leading aesthetics
                expert reflects her lifelong passion for transformation. Her
                holistic approach goes beyond skin-deep beauty, emphasizing
                wellness of both mind and body.
              </p>

              <p>
                At Serenity Rejuvenation, Brandi isn&apos;t just the medical
                director; she is the brand. Her precision, warmth, and
                unwavering dedication to excellence set the tone for everything
                Serenity Rejuvenation represents. Beyond the clinic, she&apos;s
                a devoted wife and mother of four, balancing her thriving career
                with family life and an authentic grace that clients instantly
                connect with.
              </p>

              <p>
                More than a Master Injector, Brandi Milton is the face and force
                behind Serenity Rejuvenation Aesthetics & Wellness, a woman
                redefining what it means to age beautifully, live confidently,
                and embrace the power of self-care.
              </p>
            </div>

            {/* Button */}
            <button className="bg-[#d2b48c] text-black px-6 py-3 font-light text-sm md:text-base tracking-widest uppercase hover:bg-[#c9a876] transition-colors w-fit">
              View More →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
