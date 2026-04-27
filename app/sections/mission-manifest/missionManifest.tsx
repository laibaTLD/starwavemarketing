'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MissionManifestProps {
  onBack?: () => void;
  onLaunch?: () => void;
}

export default function MissionManifest({ onBack, onLaunch }: MissionManifestProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shuttleRef = useRef<HTMLDivElement>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [altitude, setAltitude] = useState(50000);

  // --- EXIT SEQUENCES ---
  const handleLaunch = () => {
    const tl = gsap.timeline({ onComplete: onLaunch });
    
    tl.to(shuttleRef.current, { opacity: 1, scale: 1, duration: 0.2 })
      .to(".launch-btn", { backgroundColor: "#fff", color: "#000", scale: 0.9, duration: 0.1 })
      .to(shuttleRef.current, { 
        y: -1500, 
        scale: 0.2, 
        filter: "blur(20px)",
        boxShadow: "0 500px 100px #00ffff",
        duration: 0.8, 
        ease: "power4.in" 
      })
      .to(containerRef.current, { 
        scaleY: 0.001, 
        scaleX: 1, 
        opacity: 0, 
        filter: "brightness(5)",
        duration: 0.4, 
        ease: "power2.inOut" 
      }, "-=0.3");
  };

  const handleBack = () => {
    gsap.to(containerRef.current, {
      x: "-100%",
      skewX: 10,
      duration: 0.6,
      ease: "power4.in",
      onComplete: onBack
    });
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => setAltitude(Math.round(50000 - (self.progress * 50000)))
      });

      // Scramble Title Effect
      gsap.from(".main-heading", {
        y: 100, opacity: 0, skewX: 20, filter: "blur(20px)", duration: 1.5, ease: "expo.out"
      });

      gsap.from(".phase-selection .data-node", {
        opacity: 0, y: 60, rotateX: -45, stagger: 0.1,
        scrollTrigger: { trigger: ".phase-selection", start: "top 80%" }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const services = [
    { id: 0, title: "Core Development", use: "FOUNDATION", detail: "Next.js 15 high-performance architecture", specs: ["SSR + RSC", "Optimized Routing", "Scalable APIs"], metrics: { speed: "0.8s", score: "99", rank: "A+" } },
    { id: 1, title: "Motion Systems", use: "INTERACTION", detail: "GSAP powered ultra-smooth animations", specs: ["120Hz Animations", "Scroll Sync", "Micro Interactions"], metrics: { fps: "120", smooth: "100%", latency: "0.5ms" } },
    { id: 2, title: "SEO Uplink", use: "DISCOVERY", detail: "Optimized for global search visibility", specs: ["Meta Optimization", "Schema", "Fast Indexing"], metrics: { index: "24h", rank: "#1", traffic: "+300%" } },
    { id: 3, title: "UI Engineering", use: "PRESENTATION", detail: "Modern UI with Tailwind + design systems", specs: ["Responsive", "Dark Mode", "Reusable Components"], metrics: { mobile: "100%", a11y: "AAA", perf: "95" } },
    { id: 4, title: "Performance Layer", use: "OPTIMIZATION", detail: "Ultra-fast loading and optimization", specs: ["Code Splitting", "Lazy Load", "Edge Cache"], metrics: { load: "0.9s", cache: "99%", size: "-40%" } },
    { id: 5, title: "Deployment", use: "OPERATIONS", detail: "Global edge deployment with CI/CD", specs: ["Vercel Edge", "Auto Deploy", "Monitoring"], metrics: { uptime: "99.9%", cdn: "247", build: "45s" } }
  ];

  return (
    <section ref={containerRef} className="relative bg-[#020406] text-white overflow-hidden font-mono" style={{ minHeight: "215vh", perspective: "1000px", overflow: "hidden" }}>
      
      {/* SHUTTLE FX */}
      <div ref={shuttleRef} className="fixed bottom-[-100px] left-1/2 -translate-x-1/2 opacity-0 pointer-events-none z-[100]">
          <div className="w-1 bg-cyan-400 h-40 shadow-[0_0_50px_#00ffff]" />
          <div className="w-12 h-24 bg-white" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      </div>

      {/* GRID HUD */}
      <div className="fixed inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: "linear-gradient(#00ffff1a 1px, transparent 1px), linear-gradient(90deg, #00ffff1a 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* ALTITUDE HUD */}
      <div className="fixed bottom-10 left-10 z-50 border-l-2 border-cyan-400 pl-4 py-2 bg-black/40 backdrop-blur-md">
        <p className="text-[10px] text-cyan-400 tracking-[0.5em] uppercase font-black opacity-60 italic">ALTITUDE_V_01</p>
        <h2 className="text-5xl font-black tabular-nums tracking-tighter italic">
          {altitude.toLocaleString()}
        </h2>
      </div>

      {/* HERO SECTION */}
      <div className="phase-ingress h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 relative">
        <p className="text-cyan-400 tracking-[0.3em] sm:tracking-[0.5em] text-[8px] sm:text-[10px] mb-4 sm:mb-6 uppercase font-bold italic">
          // SYSTEM INITIALIZATION COMPLETE //
        </p>
        <h1 className="main-heading text-5xl sm:text-6xl md:text-7xl lg:text-[9rem] font-black italic mb-6 sm:mb-8 tracking-tighter leading-none">
          STAR<span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-400 drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]">WAVE</span>
        </h1>
        <div className="max-w-4xl space-y-6 sm:space-y-8 px-4">
          <p className="text-sm sm:text-lg md:text-xl text-white/60 leading-relaxed font-medium uppercase tracking-wide">
            We engineer high-performance digital experiences with precision,
            motion, and scale. Our mission-critical approach ensures every pixel
            serves a purpose.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-12">
            {[ {t: "VELOCITY", c: "cyan"}, {t: "PRECISION", c: "orange"}, {t: "REACH", c: "green"} ].map((item) => (
              <div key={item.t} className="p-4 sm:p-6 border border-white/5 bg-white/5 backdrop-blur-sm group hover:border-cyan-500/50 transition-all">
                <h3 className={`text-${item.c}-400 font-black tracking-widest text-xs mb-2 sm:mb-3 group-hover:scale-110 transition-transform italic`}>{item.t}</h3>
                <p className="text-white/50 text-[9px] sm:text-[10px] leading-tight font-bold uppercase tracking-tighter italic">Mission Optimized Architecture</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MISSION BRIEFING & SUMMARY SECTION */}
      <div className="phase-summary min-h-screen py-16 sm:py-24 flex items-center justify-center px-4 sm:px-6">
        <div className="summary-card max-w-6xl w-full text-center space-y-8 sm:space-y-12">
          
          <div className="inline-block px-4 sm:px-8 py-2 sm:py-3 border border-white/10 rounded-sm mb-4 bg-black/40 backdrop-blur-xl">
             <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter italic">
              Mission <span className="text-cyan-400 drop-shadow-[0_0_15px_#00ffff]">Conclusion</span>
            </h2>
          </div>

          <p className="text-sm sm:text-lg md:text-xl text-white/70 leading-relaxed max-w-4xl mx-auto italic font-medium uppercase tracking-tight px-4">
            We engineer high-performance digital experiences with precision, motion, and scale. Our mission-critical approach ensures every interaction delivers measurable results.
          </p>
          
          <div className="text-left space-y-4 sm:space-y-6 px-4">
            <h3 className="text-lg sm:text-2xl font-black text-cyan-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] italic border-b border-cyan-400/20 pb-2">MISSION BRIEFING</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[ 
                { h: "PRIMARY OBJECTIVE", c: "orange", d: "Deploy ultra-fast web applications leveraging Next.js 15 architecture with server-side rendering and React Server Components for optimal performance and SEO rankings." },
                { h: "TECHNICAL SPECIFICATIONS", c: "cyan", d: "Implement GSAP-powered 120Hz motion systems with precise scroll synchronization and micro-interactions for buttery-smooth user experiences across all devices." },
                { h: "SEO OPTIMIZATION", c: "green", d: "Configure semantic HTML5 markup with structured data, meta tags, and lightning-fast indexing to achieve top search engine visibility and organic traffic growth." },
                { h: "DEPLOYMENT STRATEGY", c: "purple", d: "Utilize Vercel Edge Network with global CDN distribution, automated CI/CD pipelines, and real-time monitoring for 99.99% uptime and sub-second response times." }
              ].map((card, i) => (
                <div key={i} className="data-node p-4 sm:p-8 border border-white/5 bg-[#0a0c0e] hover:border-white/20 transition-all relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-[2px] h-full bg-${card.c}-400 group-hover:w-full group-hover:opacity-5 transition-all duration-500`} />
                  <h4 className={`text-${card.c}-400 font-black text-[10px] sm:text-xs tracking-widest mb-2 sm:mb-4 italic`}>// {card.h}</h4>
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed uppercase font-bold tracking-tighter italic group-hover:text-white transition-colors">{card.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 sm:pt-12 space-y-6 sm:space-y-10">
            <p className="text-white/40 text-[8px] sm:text-[10px] tracking-[0.5em] sm:tracking-[0.8em] font-black uppercase italic animate-pulse">// SYSTEM_READINESS: OPTIMAL //</p>
            <button onClick={handleLaunch} className="launch-btn group relative px-12 sm:px-20 py-5 sm:py-8 bg-transparent border-2 border-cyan-400 overflow-hidden">
              <div className="absolute inset-0 bg-cyan-400 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 text-cyan-400 group-hover:text-black font-black uppercase tracking-[0.5em] sm:tracking-[1em] text-sm sm:text-xl italic transition-colors">
                Launch Project
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* BACK BUTTON */}
      {onBack && (
        <button onClick={handleBack} className="fixed top-4 sm:top-10 left-4 sm:left-10 z-[60] flex items-center gap-2 sm:gap-4 group">
          <div className="w-10 sm:w-12 h-10 sm:h-12 border border-cyan-400/30 rounded-full flex items-center justify-center group-hover:bg-cyan-400 group-hover:border-cyan-400 transition-all">
            <span className="text-cyan-400 group-hover:text-black text-xs sm:text-sm font-bold transition-colors italic">←</span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-cyan-400 tracking-[0.3em] sm:tracking-[0.5em] font-black opacity-0 group-hover:opacity-100 transition-all uppercase italic hidden sm:block">ABORT_MISSION</span>
        </button>
      )}

    </section>
  );
}