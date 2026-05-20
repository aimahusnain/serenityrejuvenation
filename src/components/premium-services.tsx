import Image from 'next/image';

export function PremiumServices() {
  const services = [
    {
      title: 'THE SALT FACIAL TREATMENT',
      description:
        'Renew your skin with this gentle, three-step resurfacing treatment that exfoliates, hydrates, and restores your natural glow. Perfect for all skin types, it makes your complexion smoother, brighter, and beautifully revitalized.',
    },
    {
      title: 'CHEMICAL PEEL',
      description:
        'Reveal a radiant, youthful glow with our customized chemical peels designed to exfoliate dull skin, reduce fine lines, and improve texture. Each treatment is personalized to your skin\'s needs for a fresher, more even complexion.',
    },
    {
      title: 'SCULPTRA® TREATMENT',
      description:
        'Rebuild collagen from within and restore natural volume with Sculptra®, a long-lasting injectable that enhances facial structure and smooths fine lines. Enjoy firmer, more youthful-looking skin and confidence that lasts.',
    },
  ];

  return (
    <section className="bg-black text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <p className="text-tan text-sm tracking-wide uppercase mb-4">
            Serenity Rejuvenation Aesthetics & Wellness
            </p>
            <h2 className="text-4xl lg:text-5xl font-serif font-light mb-12">
              Our Premium Services
            </h2>

            {/* Timeline Services */}
            <div className="relative pl-8">
              {/* Vertical Line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-tan to-transparent"></div>

              {/* Services */}
              <div className="space-y-10">
                {services.map((service, index) => (
                  <div key={index} className="relative">
                    {/* Dot Marker */}
                    <div className="absolute -left-4 top-1 w-2 h-2 bg-tan rounded-full"></div>

                    <h3 className="text-tan font-serif text-sm tracking-wide uppercase mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className="mt-8 bg-[#A67B5B] hover:bg-[#A67B5B]/90 text-black px-6 py-3 text-sm tracking-wider font-medium transition-colors">
                BOOK AN APPOINTMENT →
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-96 lg:h-screen">
            <Image
              src="/Our-Premium-Services-Updated-in-Atlanta-GA-at-Conqr-Aesthetics-and-Wellness.webp"
              alt="Aesthetician performing skincare treatment"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-tan {
          color: #d2b48c;
        }
      `}</style>
    </section>
  );
}
