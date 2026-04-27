"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !leftContentRef.current || !rightContentRef.current) return;

    const ctx = gsap.context(() => {
      // 1. PINNING TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%", // Long pinning scroll distance
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 2. STAGGERED ENTRANCE ANIMATION (LEFT SIDE)
      const animateItems = leftContentRef.current?.querySelectorAll(".animate-item");
      if (animateItems) {
        tl.fromTo(
          animateItems,
          { 
            x: -100, 
            opacity: 0, 
            filter: "blur(20px) brightness(2)",
            scale: 0.9 
          },
          { 
            x: 0, 
            opacity: 1, 
            filter: "blur(0px) brightness(1)",
            scale: 1,
            stagger: 0.2,
            ease: "power3.out",
            duration: 1 
          }
        );
      }

      // 3. HUD EXPANSION ANIMATION (RIGHT SIDE)
      tl.fromTo(
        rightContentRef.current,
        { opacity: 0, scale: 0.8, rotateY: 45 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 1, ease: "expo.out" },
        "<" // Syncs with left side entrance
      );

      // 4. FLOATING DATA SHARDS (微分的速度)
      gsap.to(".hud-shard", {
        y: -10,
        opacity: 0.8,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen overflow-hidden flex flex-col md:flex-row items-center px-8 md:px-24"
    >
      {/* BACKGROUND DEPTH GRID - Subtle */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* LEFT CONTENT: Narrative Layer */}
      <div ref={leftContentRef} className="relative z-30 w-full md:w-1/2 flex flex-col justify-center py-10 md:py-20">
        <div className="animate-item mb-3 md:mb-4">
          <span className="font-mono text-[#FFA500] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] uppercase opacity-70">
            System_Manifest // 0.1
          </span>
        </div>
        
        <h2 className="animate-item text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 md:mb-10 tracking-tighter leading-none">
          About <br /> <span className="font-michroma metallic-text">Starwave</span>
        </h2>

        <div className="animate-item space-y-4 md:space-y-6 max-w-lg">
          <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed font-light">
            We are pioneers in <span className="text-white font-medium">digital innovation</span>,
            crafting immersive experiences that transcend the boundaries between technology and creativity.
          </p>
          <div className="h-[1px] w-16 md:w-20 bg-[#FFA500]" />
          <p className="text-xs sm:text-sm md:text-base text-gray-500 font-mono leading-relaxed">
            [OBJECTIVE]: TRANSFORM BOLD IDEAS INTO EXTRAORDINARY REALITIES THROUGH
            HIGH-VELOCITY DESIGN ARCHITECTURE.
          </p>
        </div>
      </div>

      {/* RIGHT CONTENT: Dynamic HUD Layer (Z-Index 40 for max visibility) */}
      <div ref={rightContentRef} className="relative w-full md:w-1/2 h-[35vh] sm:h-[40vh] md:h-screen flex items-center justify-center z-40 mt-4 md:mt-0">
        <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-md aspect-square">

          {/* Central Technical Core Glow - Highly visible flare */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-cyan-400/20 rounded-full blur-[30px] sm:blur-[40px] md:blur-[60px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-white/50 rounded-full blur-[8px] sm:blur-[10px]" />

          {/* DYNAMIC HUD RINGS - Visibility increased */}
          {/* Increased opacity from /20 to /60 */}
          <div className="absolute inset-0 sm:inset-1 md:inset-2 border border-cyan-500/60 rounded-full animate-[spin_20s_linear_infinite]" />
          {/* Increased opacity from /10 to /40 */}
          <div className="absolute inset-3 sm:inset-4 md:inset-8 border border-orange-500/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

          {/* DYNAMIC SCANNERS - Bold and visible */}
          <div className="absolute top-0 left-0 w-full h-[2px] sm:h-[3px] bg-cyan-400 shadow-[0_0_15px_#00ffff] sm:shadow-[0_0_25px_#00ffff] animate-scan" />
          <div className="absolute w-[1px] h-full left-1/2 bg-white/5 top-0" />
          <div className="absolute h-[1px] w-full top-1/2 bg-white/5 left-0" />

          {/* FLOATING SHARDS - Visibility increased from /40 */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`absolute hud-shard w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rotate-45 animate-pulse`}
              style={{
                opacity: 0.7, // Increased from opacity-40
                top: `${15 * i}%`,
                left: `${10 * i + 10}%`,
                animationDelay: `${i * 0.4}s`,
                filter: "drop-shadow(0 0 8px rgba(255,255,255,0.7))"
              }}
            />
          ))}

          {/* HIGHLY VISIBLE TECHNICAL READOUT */}
          <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 right-0 font-mono text-cyan-300 text-[8px] sm:text-[9px] md:text-[11px] uppercase space-y-0.5 sm:space-y-1 md:space-y-2 text-right bg-black/50 p-1.5 sm:p-2 md:p-4 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
            <p className="opacity-70">Lat: 40.7128 N</p>
            <p className="opacity-70">Long: 74.0060 W</p>
            <p className="text-white font-bold tracking-widest"> [STATUS: SYNC_]</p>
            <div className="w-full h-[2px] bg-cyan-500/20 mt-1 sm:mt-2 overflow-hidden rounded-full">
              <div className="w-1/2 h-full bg-cyan-400 animate-loading-bar" />
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL CSS FX */}
      <style jsx global>{`
        .metallic-text {
          background: linear-gradient(120deg, #fff 0%, #444 50%, #fff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }

        .animate-scan {
          animation: scan 5s linear infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}