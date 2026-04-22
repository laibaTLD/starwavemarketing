import FrameBackground from "./components/FrameBackground";
import HeroSection from "./sections/hero/HeroSection";
import BulletsPoints from "./sections/bullets-points/bulletspoints";
import AboutSection from "./sections/about/about-section";
import ServicesSection from "./sections/service/servicessection";
import CompanyDetailsSection from "./sections/company-details/company-details";
export default function Home() {
  return (
    <>
    <div className="relative isolate">
      <FrameBackground />
      <main className="relative min-h-[100vh] text-white">
        <HeroSection />
        
        <div className="h-[100vh]" ></div>

        {/*bullet points*/}
        <BulletsPoints/>
        <div className="h-[30vh]" ></div>

        
        {/* About Section */}
        <AboutSection />
        {/* Services Section */}
        <ServicesSection />

        {/* Company Details Section with Rocket */}
        <CompanyDetailsSection />

      </main>
    </div>
    </>
  );
}