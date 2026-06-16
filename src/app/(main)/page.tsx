import HeroSection from "@/components/HeroSection";
import TextSlider from "@/components/TextSlider";
import NailTechSection from "@/components/Nailtechsection";
import PurelyRejuvenated from "@/components/Purelyrejuvenated";
import ProductsSection from "@/components/productsection";
import { ScrollBasedVelocity } from "@/components/ScrollBasedVelocity";
import BeforeAfterSection from "@/components/beforeafter";

const Home = () => {
  return (
    <div>
      <div className="m-4 flex flex-col gap-3">
        <div>
          {/* Hero Section with auto-rotating images */}
          <HeroSection
            images={[
              "/hero image 1.jpg",
              "/hero image 2.png",
              "/hero image 3.jpg",
              "/hero image 4.jpg",
              "/hero image 5.jpeg",
              "/hero image 6.jpg",
            ]}
            delay={5000} // Change image every 5 seconds
          />
          <TextSlider />
        </div>

        <NailTechSection />
        <PurelyRejuvenated />
        <ProductsSection />
      </div>
      <ScrollBasedVelocity />
      <BeforeAfterSection />
    </div>
  );
};

export default Home;
