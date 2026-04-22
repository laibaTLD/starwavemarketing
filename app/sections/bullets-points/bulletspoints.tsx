"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const missionObjectiveRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const objectives = missionObjectiveRefs.current.filter(ref => ref !== null);
      const mainHeading = containerRef.current?.querySelector('.heading');

      // --- 1. INITIAL STATE ---
      gsap.set(objectives, { 
        x: 100, 
        opacity: 0, 
        filter: 'blur(10px)' 
      });

      // --- 2. ENTRANCE ANIMATION ---
      gsap.to(objectives, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%", 
          end: "top 10%",
          scrub: 1,
        }
      });

      // --- 3. THE EXIT FADE ---
      objectives.forEach((obj) => {
        gsap.to(obj, {
          opacity: 0,
          x: -100, 
          filter: 'blur(15px)',
          scale: 0.9,
          ease: "none",
          scrollTrigger: {
            trigger: obj,
            start: "top 20%", 
            end: "top -10%",  
            scrub: 1,
          }
        });
      });

      // --- 4. HEADING DISSOLVE ---
      if (mainHeading) {
        gsap.to(mainHeading, {
          y: -50,
          opacity: 0,
          filter: 'blur(20px)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 10%",
            end: "top -20%",
            scrub: 1,
          }
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-start px-6 md:px-24"
    >
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] blur-[150px] rounded-full" />
      </div>

      {/* TEXT LAYER */}
      <div className="relative z-20 max-w-4xl text-left">
        <h2
          ref={headingRef}
          className="font-michroma heading metallic-text glow-metal mb-12"
          style={{
            position: "relative",
            zIndex: 80,
            textAlign: "left",
            fontSize: "clamp(1rem, 10vw, 5rem)",
            lineHeight: 0.9,
            pointerEvents: "none",
            willChange: "transform",
            textTransform: "uppercase",
            textShadow: "0 0 15px rgba(255, 140, 0, 0.3)",
          }}
        >
          Starwave 
          <br />
          Marketing
        </h2>
        
        <div className="space-y-16">
          {[
            { id: "01", title: "PROPELLING BRANDS", desc: "Engineering high-velocity growth strategies for the digital era." },
            { id: "02", title: "INTERFACE EXCELLENCE", desc: "Crafting intuitive, high-tech digital flight decks with precision." },
            { id: "03", title: "FUTURE-PROOFING", desc: "Building scalable architectures designed for the digital void." }
          ].map((obj, i) => (
            <div 
              key={obj.id}
              ref={el => { missionObjectiveRefs.current[i] = el; }}
              className="flex items-start space-x-6"
            >
              {/* UPDATED SPAN: Reduced size to 10px and adjusted alignment */}
              <span 
            
                className="font-helvetica mt-1.5 metallic-text"
                style={{ 
                  color: '#FFA500',
                  fontSize: '38px',
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(255, 165, 0, 0.5)',
                  opacity: 0.8
                }}
              >
                [{obj.id}]
              </span>
              
              <div>
                <h3 className="font-helvetica font-bold text-white text-2xl md:text-3xl mb-4 tracking-tight uppercase">
                  {obj.title}
                </h3>
                <p className="text-gray-500 text-sm md:text-base font-helvetica leading-relaxed max-w-xl">
                  {obj.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .metallic-text {
          background: linear-gradient(120deg, #ffffff 0%, #b7b7b7 25%, #8a8a8a 40%, #e0e0e0 55%, #7a7a7a 70%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </section>
  );
}