"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRevealGroupRef = useRef<HTMLDivElement>(null);
  const planetMaskRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRevealGroupRef.current || !planetMaskRef.current) return;

    const ctx = gsap.context(() => {
      // THE REVEAL: Text starts behind the planet (right side) and moves left into view
      gsap.fromTo(
        textRevealGroupRef.current,
        { 
          x: "100%", // Start fully hidden to the right
          opacity: 0,
          scale: 0.9
        },
        {
          x: "0%", // Slide into the center
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%", // Reveal begins as the section enters view
            end: "center center",
            scrub: 1,
          }
        }
      );

      // Planet Pulse Animation
      gsap.to(planetMaskRef.current, {
        scale: 1.03,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[120vh] overflow-hidden flex items-center justify-center px-6 md:px-12"
      style={{ zIndex: 5 }}
    >
      {/* LAYER 1: Deep Space Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/astronaut-background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
          zIndex: 1
        }}
      />

      {/* LAYER 2: The Text Group (Middle Tier) */}
      <div 
        ref={textRevealGroupRef}
        className="relative w-full max-w-5xl pointer-events-auto"
        style={{ zIndex: 20 }}
      >
        <div className=" p-8 md:p-16">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            About <span className="text-cyan-400">Starwave</span>
          </h2>
          
          <div className="space-y-8 text-lg md:text-2xl leading-relaxed text-gray-300 font-light">
            <p>
              We are pioneers in digital innovation, crafting immersive experiences that transcend 
              the boundaries between technology and creativity.
            </p>
            <p>
              Our mission is to transform bold ideas into extraordinary digital realities 
              that captivate, engage, and inspire.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 flex flex-wrap gap-12 pt-10">
            <div>
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="text-sm text-cyan-500 uppercase tracking-widest mt-1">Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">100%</div>
              <div className="text-sm text-cyan-500 uppercase tracking-widest mt-1">Success</div>
            </div>
          </div>
        </div>
      </div>

    
    </section>
  );
}