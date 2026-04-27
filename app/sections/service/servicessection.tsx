"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  { id: '01', title: 'NEURAL MARKETING', category: 'ALGORITHMIC BIAS', desc: 'Predicting human behavior via deep-learning clusters.', status: 'ACTIVE' },
  { id: '02', title: 'IMMERSIVE SYSTEMS', category: 'SPATIAL WEB', desc: 'Engineering 3D digital environments for total immersion.', status: 'STABLE' },
  { id: '03', title: 'BRAND ARCHITECTURE', category: 'VISUAL DNA', desc: 'Synthesizing emotional equity through structural design.', status: 'SYNCED' },
  { id: '04', title: 'FUTURE TECH', category: 'NEURAL NETS', desc: 'Automating industry growth through predictive R&D.', status: 'DEPLOYED' }
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const smallStarsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [starPositions, setStarPositions] = useState<{x: number, y: number}[]>([]);

  useEffect(() => {
    // Initialize star positions on client side to prevent hydration mismatch
    const positions = [...Array(5)].map((_, index) => {
      const angle = (index / 5) * Math.PI * 2;
      const radius = 20;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    });
    setStarPositions(positions);

    const section = sectionRef.current;
    if (!section || !starRef.current) return;

    const xSet = gsap.quickSetter(starRef.current, "x", "px");
    const ySet = gsap.quickSetter(starRef.current, "y", "px");
    const pos = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };

    // Small stars follow logic
    const smallStarsPos = smallStarsRef.current.map(() => ({ x: 0, y: 0 }));
    const xSetSmallStars = smallStarsRef.current.map(star => 
      star ? gsap.quickSetter(star, "x", "px") : null
    );
    const ySetSmallStars = smallStarsRef.current.map(star => 
      star ? gsap.quickSetter(star, "y", "px") : null
    );

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouse.x = e.clientX - rect.left - section.offsetWidth / 2;
      mouse.y = e.clientY - rect.top - section.offsetHeight / 2;

      // Card-specific 3D Parallax Tilt
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const rotateX = (e.clientY - cardCenterY) / 20;
        const rotateY = (cardCenterX - e.clientX) / 20;

        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.6,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      });
    };

    const ticker = () => {
      pos.x += (mouse.x - pos.x) * 0.08;
      pos.y += (mouse.y - pos.y) * 0.08;
      xSet(pos.x);
      ySet(pos.y);

      // Animate small stars to move with the main star
      smallStarsPos.forEach((starPos, index) => {
        const speed = 0.08; // Same speed as main star
        
        // Create tight circular formation around main star
        const angle = (index / 5) * Math.PI * 2 + (Date.now() * 0.0001 * (index + 1)); // Slow rotation
        const radius = 15 + (index * 6); // Tight radius - close to main star
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;
        
        // Move with main star position + offset
        const targetX = pos.x + offsetX;
        const targetY = pos.y + offsetY;
        
        starPos.x += (targetX - starPos.x) * speed;
        starPos.y += (targetY - starPos.y) * speed;
        
        if (xSetSmallStars[index] && ySetSmallStars[index]) {
          xSetSmallStars[index](starPos.x);
          ySetSmallStars[index](starPos.y);
        }
      });
    };

    section.addEventListener("mousemove", handleMouseMove);
    gsap.ticker.add(ticker);

    const ctx = gsap.context(() => {
      gsap.from(".service-node", {
        x: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: section, start: "top 60%" }
      });
    }, section);

    return () => {
      ctx.revert();
      section.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen bg-[#020406] py-10 px-4 md:px-12 overflow-hidden flex items-center"
    >
      {/* THE SEARCHLIGHT STAR */}
      <div 
        ref={starRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-[700px] h-[700px] bg-[#3B82F6]/5 blur-[140px] rounded-full" />
          <div className="relative w-12 h-12 bg-[#3B82F6] shadow-[0_0_70px_#3B82F6] star-shape">
             <div className="absolute inset-0 bg-white opacity-40 star-shape scale-[0.2]" />
          </div>
        </div>
      </div>

      {/* SMALL STARS THAT FOLLOW CURSOR */}
      {starPositions.map((position, index) => (
        <div
          key={index}
          ref={el => { smallStarsRef.current[index] = el; }}
          className="absolute pointer-events-none z-40"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
          }}
        >
          <div 
            className="bg-blue-400 star-shape"
            style={{
              width: `${3 + index * 1.5}px`,
              height: `${3 + index * 1.5}px`,
              opacity: 0.4 + (index * 0.1),
              boxShadow: `0 0 ${8 + index * 3}px rgba(59, 130, 246, 0.6)`
            }}
          />
        </div>
      ))}

      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        
        {/* LEFT SIDE: COMMAND TEXT */}
        <div className="lg:col-span-4 flex flex-col justify-center text-center lg:text-left mb-8 lg:mb-0">
          <h2 className="font-michroma text-4xl md:text-5xl lg:text-6xl text-white leading-none uppercase tracking-tighter mb-6">
            OUR<br /><span className="metallic-text">SERVICES</span>
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-[#3B82F6] to-transparent mb-6 mx-auto lg:mx-0" />
          <p className="text-gray-500 font-helvetica text-xs uppercase tracking-widest leading-loose">
            Targeting human behavior <br /> 
            // Neural clusters online <br />
            // Initializing spatial web...
          </p>
        </div>

        {/* RIGHT SIDE: TACTICAL NODES */}
        <div className="lg:col-span-8 space-y-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              ref={el => { cardsRef.current[idx] = el; }}
              className="service-node group relative bg-[#0a0c12]/60 border border-white/10 backdrop-blur-md p-1 hover:border-[#3B82F6]/50 transition-colors duration-500"
              style={{ clipPath: "polygon(0 0, 95% 0, 100% 25%, 100% 100%, 5% 100%, 0 75%)" }}
            >
              <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-8 p-4 md:p-8 bg-gradient-to-br from-white/[0.03] to-transparent h-full w-full">
                
                {/* Technical Node ID */}
                <div className="flex md:flex-col items-center gap-2 md:gap-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border border-white/10 group-hover:border-[#3B82F6]/50 transition-all">
                    <span className="font-helvetica text-xl md:text-2xl font-bold text-white group-hover:text-[#3B82F6]">{service.id}</span>
                  </div>
                  <div className="hidden md:block mt-2 w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent" />
                </div>

                {/* Info Cluster */}
                <div className="flex-grow text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-2">
                    <span className="font-helvetica text-[9px] text-[#3B82F6] tracking-[0.4em] uppercase">{service.category}</span>
                    <div className="hidden md:block flex-grow h-[1px] bg-white/5" />
                    <span className="font-helvetica text-[9px] text-white/30 uppercase">{service.status}</span>
                  </div>
                  
                  <h3 className="font-helvetica text-xl sm:text-2xl md:text-4xl font-bold text-white group-hover:translate-x-2 transition-transform duration-500">
                    {service.title}
                  </h3>
                  
                  <p className="mt-2 text-gray-400 text-xs sm:text-sm max-w-lg leading-relaxed group-hover:text-gray-200 transition-colors">
                    {service.desc}
                  </p>
                </div>

                {/* Interaction Trigger */}
                <div className="hidden md:block">
                  <div className="relative w-12 h-12 flex items-center justify-center border border-white/5 group-hover:bg-[#3B82F6] transition-all duration-500">
                    <div className="w-2 h-2 bg-white rotate-45 group-hover:scale-0 transition-transform" />
                    <svg className="absolute w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity fill-black" viewBox="0 0 24 24">
                      <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* HUD Ornamentation */}
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#3B82F6]" />
              <div className="absolute top-0 left-0 h-8 w-[1px] bg-[#3B82F6]" />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .metallic-text {
          background: linear-gradient(120deg, #fff 0%, #3B82F6 50%, #fff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .star-shape {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
      `}</style>
    </section>
  );
}