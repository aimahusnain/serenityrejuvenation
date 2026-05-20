export default function Membership() {
    return (
      <section
        className="relative w-full h-96 bg-cover bg-center"
        style={{
          backgroundImage: "url('/botox-dysport-xeomin-in-Atlanta-GA-at-Conqr-Aesthetics-and-Wellness.webp')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
  
        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl lg:text-5xl font-light tracking-tight text-white mb-4">
                EXCLUSIVE BEAUTY, EXCLUSIVE BENEFITS.
              </h2>
  
              <p className="font-serif text-sm lg:text-base font-light tracking-widest text-white/90 mb-6">
                OUR MEMBERSHIP PROGRAM IS COMING SOON.
              </p>
  
              <p className="font-sans text-base lg:text-lg text-white/80 leading-relaxed">
                Unlock member-only pricing, priority booking, and personalized skincare perks.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  