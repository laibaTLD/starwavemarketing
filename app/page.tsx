import FrameBackground from "./components/FrameBackground";
import HeroSection from "./sections/hero/HeroSection";
import AboutUsSection from "./sections/about/aboutussection";

export default function Home() {
  return (
    <>
    <div className="relative isolate">
      <FrameBackground />
      <main className="relative min-h-[800vh] text-white">
        <HeroSection />
        
        {/* Section 2 */}
        <section className="h-screen flex flex-col items-center justify-center px-16">
          <p className="font-helvetica text-2xl md:text-4xl text-metallic-gray text-center max-w-3xl">
           
          </p>
        </section>

        {/* Section 3 */}
        <section className="h-screen flex flex-col items-center justify-center px-16">
          <p className="font-fulco text-xl md:text-2xl text-white text-center max-w-2xl">
           
          </p>
        </section>

        {/* About Us Section */}
        <AboutUsSection />
      </main>
    </div>
    </>
  );
}