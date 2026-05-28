import Image from "next/image";

export function ServicesGrid() {
  const services = [
    {
      id: 1,
      title: "INJECTABLES",
      image: "/injectables.webp",
      description:
        "Enhance your natural beauty with a soft, refreshed look. Our gentle, customized approach smooths lines and restores balance, so you feel confident and comfortable in your own skin.",
    },
    {
      id: 2,
      title: "SKIN TREATMENTS",
      image: "/skin-treatment.webp",
      description:
        "Healthy, glowing skin starts with the right care. We take time to understand your skin's needs and create treatments that renew, calm, and bring out your natural radiance.",
    },
    {
      id: 3,
      title: "LASER TREATMENTS",
      image: "/laser-treatments.webp",
      description:
        "Enjoy the freedom of smooth, touchable skin without the daily upkeep. Our safe, effective laser treatments make it easy to feel confident and carefree in your own body.",
    },
    {
      id: 4,
      title: "WELLNESS",
      image: "/wellness.webp",
      description:
        "True beauty begins with how you feel. Our wellness treatments are designed to help you restore balance, reduce stress, and reconnect with your best self, inside and out.",
    },
  ];

  return (
    <section className="bg-black py-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-neutral-800">
        {services.map((service) => (
          <div
            key={service.id}
            className="px-6 py-12 lg:px-8 lg:py-16 flex flex-col"
          >
            {/* Title */}
            <h3
              className="font-heading text-xl font-light tracking-widest uppercase mb-6"
              style={{ color: "#ffffff" }}
            >
              {service.title}
            </h3>

            {/* Image Container */}
            <div className="relative w-full aspect-square mb-6 overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Description */}
            <p
              className="font-text text-sm leading-relaxed"
              style={{ color: "#cccccc" }}
            >
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
