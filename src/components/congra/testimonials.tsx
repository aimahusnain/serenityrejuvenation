import Image from 'next/image'

export default function Testimonials() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative h-96">
            <Image
              src="/Patient-Looking-at-Her-Face-in-Front-of-Mirror-Conqr-Aesthetics-and-Wellness.webp"
              alt="Client consultation at Conqr Aesthetics"
              fill
              className="object-cover"
            />
          </div>

          {/* Testimonial Content */}
          <div className="flex flex-col justify-center">
            <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-8 text-balance">
              TESTIMONIALS
            </h2>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Serenity Rejuvenation is an incredible wellness spa! Brandi takes the time to listen to your concerns, provides a tailored skincare regimen and offers the highest quality products! She and her team are personable and want to support your needs. She has helped with my fine lines, dry skin and uneven skin tone. As a woman of color I would highly recommend Serenity Rejuvenation Aesthetics & Wellness!
            </p>

            <div className="mb-8">
              <p className="font-serif text-2xl text-gray-900 mb-4">Dawn C.</p>
              <div className="flex gap-1">
                <span className="text-gray-400 text-lg">•</span>
                <span className="text-gray-400 text-lg">•</span>
                <span className="text-gray-400 text-lg">•</span>
                <span className="text-gray-400 text-lg">•</span>
                <span className="text-gray-400 text-lg">•</span>
                <span className="text-gray-400 text-lg">•</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
