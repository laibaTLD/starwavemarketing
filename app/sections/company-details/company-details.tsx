"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Custom Rocket Component (Pure SVG + CSS Animation) ---
const RocketSVG = () => (
  <svg viewBox="0 0 50 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">
    {/* Flame/Exhaust */}
    <path className="rocket-flame" d="M20 70 Q25 95 30 70" fill="#3B82F6" />
    <path className="rocket-flame-inner" d="M22 70 Q25 85 28 70" fill="#60A5FA" />
    
    {/* Rocket Body */}
    <path d="M25 10 C15 30 15 60 15 70 L35 70 C35 60 35 30 25 10Z" fill="#E2E8F0" />
    {/* Fins */}
    <path d="M15 55 L5 75 L15 70 Z" fill="#94A3B8" />
    <path d="M35 55 L45 75 L35 70 Z" fill="#94A3B8" />
    {/* Window */}
    <circle cx="25" cy="35" r="4" fill="#1E293B" />
  </svg>
);

export default function CompanyDetailsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // --- 1. ENTRANCE ANIMATIONS ---
      gsap.fromTo(".transition-heading", 
        { y: 50, opacity: 0, skewY: 5 },
        { y: 0, opacity: 1, skewY: 0, stagger: 0.2, duration: 1, ease: "power4.out" }
      );

      // --- 2. ORBITAL RINGS ROTATION ---
      gsap.to(".data-ring-inner", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });

      gsap.to(".data-ring-outer", {
        rotation: -360,
        duration: 35,
        repeat: -1,
        ease: "none"
      });

      // --- 3. THE ROCKET LAUNCH TIMELINE ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 40%",
          end: "bottom top",
          scrub: 1.5, // Smoother follow-through
        }
      });

      tl.to(rocketRef.current, {
        y: "-150vh", // Shoots up past the screen
        x: "20vw",   // Slight curve to the side
        scale: 0.8,  // Gets smaller as it gains altitude
        ease: "power2.in",
      });

    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // --- ROCKET CLICK LAUNCH ---
  const launchRocket = () => {
    if (isLaunched || !rocketRef.current) return;
    
    setIsLaunched(true);
    
    // Get the flame elements
    const flames = rocketRef.current?.querySelectorAll('.rocket-flame, .rocket-flame-inner');
    
    // Add launching class for enhanced flame effects
    rocketRef.current?.classList.add('rocket-launching');
    
    // Create launch animation
    gsap.timeline()
      // Increase flame size at launch start
      .to(flames, {
        scale: 2.5,
        duration: 0.3,
        ease: "power2.out"
      })
      // Launch rocket with enhanced flames
      .to(rocketRef.current, {
        y: "-200vh",
        x: "30vw",
        scale: 0.6,
        rotation: 15,
        duration: 2,
        ease: "power2.in",
      }, "-=0.2")
      // Make flames even bigger during flight
      .to(flames, {
        scale: 3.5,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
      }, "-=1.8")
      // Fade out rocket
      .to(rocketRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          // Remove launching class
          rocketRef.current?.classList.remove('rocket-launching');
          
          // Reset rocket after animation
          setTimeout(() => {
            gsap.set(rocketRef.current, {
              y: 0,
              x: 0,
              scale: 1,
              rotation: 0,
              opacity: 1
            });
            // Reset flames
            gsap.set(flames, {
              scale: 1,
              opacity: 1
            });
            setIsLaunched(false);
          }, 1000);
        }
      });
  };

  return (
    <>
      <style>{`
        .metallic-text {
          background: linear-gradient(180deg, #fff 30%, #555 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .neon-border {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 10px rgba(59, 130, 246, 0.2);
        }
        .grid-bg {
          background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <section 
        ref={containerRef} 
        className="relative w-full min-h-screen bg-[#020406] overflow-hidden flex items-center justify-center py-8 md:py-0"
      >
        {/* BACKGROUND HUD LAYER */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />

        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center relative z-10 px-6 md:px-20">
          
          {/* LEFT: COMPANY DETAILS COLUMN */}
          <div className="md:col-span-5 z-20">
            <div className="inline-flex items-center gap-3 mb-6 px-3 py-1 border border-blue-500/30 bg-blue-500/5 backdrop-blur-md rounded-full transition-heading">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-mono text-[10px] text-blue-400 tracking-[0.3em] uppercase">System Online</span>
            </div>

            <h2 className="font-michroma text-white text-4xl sm:text-5xl md:text-6xl leading-[0.85] uppercase mb-6 md:mb-10 transition-heading">
              Digital <br /> 
              <span className="metallic-text">Excellence</span>
            </h2>

            <div className="space-y-6 sub-heading transition-heading">
              <div className="console-log text-[11px] space-y-3 text-blue-400/70 border-l-2 border-blue-500/50 pl-6 py-2">
                <p className="console-line opacity-50"> {'>'} INITIALIZING: CORE_SYSTEMS</p>
                <p className="console-line text-white flex justify-between"> 
                   <span>{'>'} STATUS:</span> <span>OPERATIONAL (100%)</span>
                </p>
                <p className="console-line opacity-50"> {'>'} PROTOCOLS: ACTIVE</p>
              </div>
              
              <button className="group relative px-8 py-3 bg-white text-black sub-heading uppercase text-xs tracking-widest hover:bg-blue-400 transition-colors">
                Explore Solutions
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 group-hover:bg-white" />
              </button>
            </div>
          </div>

          {/* RIGHT: COMPANY DETAILS HUD */}
          <div className="md:col-span-7 flex justify-center relative">
            
            {/* ROCKET IN CENTER OF ORBITAL RINGS */}
            <div className="relative z-10 w-full max-w-2xl flex items-center justify-center">
              <div className="text-center relative">
                {/* ORBITAL RINGS CLOSE TO ROCKET */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="data-ring-inner absolute w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] border-2 border-dashed border-blue-400/60 rounded-full" />
                   <div className="data-ring-outer absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] border-2 border-blue-300/40 rounded-full">
                      <div className="absolute top-0 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full neon-border" />
                   </div>
                   <div className="absolute w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] border border-white/20 rounded-full" />
                </div>
                
                <div
                  ref={rocketRef}
                  className={`w-16 h-32 sm:w-20 sm:h-40 relative z-20 transition-all ${isLaunched ? 'pointer-events-none' : 'cursor-pointer hover:scale-110'}`}
                  style={{ willChange: "transform" }}
                  onClick={launchRocket}
                >
                  <div className="rocket-vibration">
                    <RocketSVG />
                  </div>
                </div>

                {/* CLICK TO LAUNCH INDICATOR */}
                {!isLaunched && (
                  <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse">
                    <span className="text-[10px] sm:text-xs text-blue-400 font-mono tracking-[0.3em] uppercase whitespace-nowrap">
                      [ Click to Launch ]
                    </span>
                    <div className="w-px h-4 bg-blue-400/50 mt-1" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        
        {/* HUD FOOTER DETAIL */}
        <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-10 md:left-20 flex items-center gap-6 sm:gap-10">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] sm:text-[10px] text-white/20 uppercase sub-heading tracking-widest">Core Systems</span>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1 h-3 bg-blue-500/30" style={{ opacity: 0.3 + (i * 0.2) }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* Rocket vibration before/during launch */
        .rocket-vibration {
          animation: vibrate 0.2s infinite alternate ease-in-out;
        }

        @keyframes vibrate {
          from { transform: translateX(-1px); }
          to { transform: translateX(1px); }
        }

        /* Flickering Flame Effect */
        .rocket-flame {
          animation: flicker 0.1s infinite alternate;
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
        }
        .rocket-flame-inner {
          animation: flicker 0.15s infinite alternate-reverse;
          filter: drop-shadow(0 0 12px rgba(96, 165, 250, 0.9));
        }

        @keyframes flicker {
          from { opacity: 0.8; transform: scaleY(1); }
          to { opacity: 1; transform: scaleY(1.3); }
        }

        /* Enhanced launch flame effect */
        .rocket-launching .rocket-flame {
          animation: launch-flicker 0.05s infinite alternate, flame-burst 0.3s ease-out;
        }
        .rocket-launching .rocket-flame-inner {
          animation: launch-flicker 0.08s infinite alternate-reverse, flame-burst 0.3s ease-out;
        }

        @keyframes launch-flicker {
          from { opacity: 0.9; transform: scaleY(1.2) scaleX(1.1); }
          to { opacity: 1; transform: scaleY(1.8) scaleX(1.4); }
        }

        @keyframes flame-burst {
          0% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8)); }
          50% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 1)) drop-shadow(0 0 40px rgba(96, 165, 250, 0.8)); }
          100% { filter: drop-shadow(0 0 30px rgba(59, 130, 246, 1)) drop-shadow(0 0 60px rgba(96, 165, 250, 0.6)); }
        }
      `}</style>
    </>
  );
}
