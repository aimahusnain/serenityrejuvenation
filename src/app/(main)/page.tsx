import HomePageShell from "@/components/home/HomePageShell";
import HeroSection from "@/components/HeroSection";
import TextSlider from "@/components/TextSlider";
import NailTechSection from "@/components/Nailtechsection";
import PurelyRejuvenated from "@/components/Purelyrejuvenated";
import ProductsSection from "@/components/productsection";
import { ScrollBasedVelocity } from "@/components/ScrollBasedVelocity";
import BeforeAfterSection from "@/components/beforeafter";
import HeroSection1 from "@/components/HeroSection-top";

const Home = () => {
  return (
    <HomePageShell>
      <div>
        <div className="m-4 flex flex-col gap-3">
          <HeroSection1 />
          <NailTechSection />
          <PurelyRejuvenated />
          <ProductsSection />
        </div>
        <div className="mb-10">
          <HeroSection
            images={[
              "/hero image 1.jpg",
              "/hero image 2.png",
              "/hero image 3.jpg",
              "/hero image 4.jpg",
              "/hero image 5.jpeg",
              "/hero image 6.jpg",
            ]}
            delay={5000}
          />
          <TextSlider />
        </div>
        <ScrollBasedVelocity />
        <BeforeAfterSection />
      </div>
    </HomePageShell>
  );
};

export default Home;
