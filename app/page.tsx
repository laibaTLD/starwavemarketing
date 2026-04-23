"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Only register once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import FrameBackground from "./components/FrameBackground";
import HeroSection from "./sections/hero/HeroSection";
import BulletsPoints from "./sections/bullets-points/bulletspoints";
import AboutSection from "./sections/about/about-section";
import ServicesSection from "./sections/service/servicessection";
import CompanyDetailsSection from "./sections/company-details/company-details";
import CTASection from "./sections/cta/ctasection";
import MissionManifest from "./sections/mission-manifest/missionManifest";

export default function Home() {
  const [isLaunched, setIsLaunched] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleLaunch = () => {
    // Kill all active ScrollTriggers before switching state to prevent removeChild errors
    ScrollTrigger.getAll().forEach(t => t.kill());
    setIsLaunched(true);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // Global cleanup on unmount
    return () => {
      gsap.killTweensOf("*");
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="relative isolate bg-[#020406]" ref={mainRef}>
      <FrameBackground />
      
      <main className="relative text-white">
        {!isLaunched ? (
          <div key="landing-view">
            <HeroSection />
            <div className="h-[100vh]"></div>
            <BulletsPoints />
            <div className="h-[30vh]"></div>
            <AboutSection />
            <ServicesSection />
            <CompanyDetailsSection />
            <CTASection onLaunch={handleLaunch} />
          </div>
        ) : (
          <div key="manifest-view">
            <MissionManifest onBack={() => setIsLaunched(false)} />
          </div>
        )}
      </main>
    </div>
  );
}