'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface OrbitalSuccessProps {
  onBack?: () => void;
}

export default function OrbitalSuccess({ onBack }: OrbitalSuccessProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  const satellitesRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission logic here
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance animation
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 2,
        ease: "power2.inOut"
      });

      gsap.from(planetRef.current, {
        y: 300,
        opacity: 0,
        duration: 3,
        ease: "power3.out"
      });

      // Satellite orbital animations
      const satellites = satellitesRef.current?.children;
      if (satellites) {
        gsap.from(satellites, {
          opacity: 0,
          scale: 0,
          stagger: 0.3,
          duration: 1,
          ease: "back.out(1.7)"
        });

        // Create orbital motion for each satellite
        Array.from(satellites).forEach((satellite, index) => {
          const duration = 20 + (index * 5); // Varied durations
          const radius = 150 + (index * 30); // Varied radii
          
          gsap.to(satellite, {
            rotation: 360,
            duration: duration,
            repeat: -1,
            ease: "none",
            transformOrigin: `${radius}px center`
          });
        });
      }

      // Pulse effect for cyan glow
      gsap.to(".atmospheric-glow", {
        opacity: 0.8,
        duration: 2.5,
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
      className="relative min-h-screen bg-[#020406] text-white font-mono overflow-hidden"
    >
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#00FFFF1a 1px, transparent 1px), 
            linear-gradient(90deg, #00FFFF1a 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.1
        }}
      />

      {/* Atmospheric Rim (Planet) */}
      <div 
        ref={planetRef}
        className="absolute bottom-0 left-0 right-0 h-[60vh]"
      >
        {/* Main atmospheric glow */}
        <div 
          className="atmospheric-glow absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center bottom, 
              rgba(0, 255, 255, 0.3) 0%, 
              rgba(0, 255, 255, 0.1) 30%, 
              transparent 70%)`,
            filter: 'blur(100px)',
            opacity: 0.6
          }}
        />
      </div>

      {/* Satellite System */}
      <div 
        ref={satellitesRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-[#FFA500] rounded-full"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 8)}%`,
              boxShadow: '0 0 10px #FFA500'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black italic tracking-tighter mb-8 sm:mb-12 px-4">
          <span 
            className="block text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, #00FFFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            ORBIT_ESTABLISHED
          </span>
        </h1>

        {/* Status Text */}
        <div className="mb-8 sm:mb-16 text-center px-4">
          <p className="text-[10px] sm:text-xs tracking-widest uppercase text-cyan-400 opacity-80">
            // SYSTEM_STABILITY: 100% //
          </p>
          <p className="text-[10px] sm:text-xs tracking-widest uppercase text-cyan-400 opacity-80">
            // COORDINATES: GEO_STATIONARY //
          </p>
        </div>

        {/* Return Button */}
        <button 
          onClick={onBack}
          className="group relative px-8 sm:px-12 sm:py-6 bg-transparent border border-white/10 backdrop-blur-md text-white font-mono text-xs sm:text-sm tracking-widest uppercase hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 mb-8 sm:mb-16"
        >
          <span className="relative z-10">Return to Space</span>
          
          {/* Hover glow effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
              filter: 'blur(20px)'
            }}
          />
        </button>

      </div>

      {/* CONTACT FORM & FOOTER SECTION */}
      <div className="relative z-20 px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2">
          
          {/* Contact Form */}
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-3xl font-black text-cyan-400 tracking-wider italic">
              // TRANSMISSION_PROTOCOL //
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs text-cyan-400 tracking-widest uppercase mb-2 font-black italic">
                  Callsign
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/40 border border-cyan-400/30 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Enter your callsign..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-cyan-400 tracking-widest uppercase mb-2 font-black italic">
                  Frequency
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/40 border border-cyan-400/30 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="your.frequency@comms.net"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-cyan-400 tracking-widest uppercase mb-2 font-black italic">
                  Message Payload
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/40 border border-cyan-400/30 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                  placeholder="Transmit your message..."
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-mono text-sm tracking-widest uppercase hover:bg-cyan-400 hover:text-black transition-all duration-300 group"
              >
                <span className="group-hover:tracking-[1.2em] transition-all duration-300">TRANSMIT</span>
              </button>
            </form>
          </div>

          {/* Company Information */}
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-3xl font-black text-cyan-400 tracking-wider italic">
              // STARWAVE_COMMAND //
            </h2>
            
            <div className="space-y-6 text-white/70 font-mono text-sm">
              <div className="border-l-2 border-cyan-400/30 pl-4">
                <h3 className="text-cyan-400 font-black tracking-widest text-xs uppercase mb-2 italic">Mission Control</h3>
                <p className="text-white/60 leading-relaxed">
                  STARWAVE Digital Engineering<br/>
                  Orbital Development Division<br/>
                  Low Earth Orbit Station Alpha
                </p>
              </div>
              
              <div className="border-l-2 border-cyan-400/30 pl-4">
                <h3 className="text-cyan-400 font-black tracking-widest text-xs uppercase mb-2 italic">Communication Channels</h3>
                <p className="text-white/60 leading-relaxed">
                  Primary: comms@starwave.digital<br/>
                  Emergency: urgent@starwave.digital<br/>
                  Quantum Link: quantum.starwave.net
                </p>
              </div>
              
              <div className="border-l-2 border-cyan-400/30 pl-4">
                <h3 className="text-cyan-400 font-black tracking-widest text-xs uppercase mb-2 italic">Operational Hours</h3>
                <p className="text-white/60 leading-relaxed">
                  24/7 Mission Operations<br/>
                  Real-time Support Available<br/>
                  Global Response Time: &lt;2hrs
                </p>
              </div>
              
              <div className="border-l-2 border-cyan-400/30 pl-4">
                <h3 className="text-cyan-400 font-black tracking-widest text-xs uppercase mb-2 italic">Mission Capabilities</h3>
                <ul className="text-white/60 space-y-1 text-xs">
                  <li>• Next.js 15 Orbital Architecture</li>
                  <li>• GSAP Motion Systems Integration</li>
                  <li>• Global SEO Optimization</li>
                  <li>• Edge Network Deployment</li>
                  <li>• Real-time Performance Monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-cyan-400/20">
          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs text-cyan-400/60 font-mono">
            <p className="tracking-widest uppercase italic mb-3 sm:mb-4 md:mb-0">
              // STARWAVE_DIGITAL © 2024 ORBITAL_DIVISION //
            </p>
            <div className="flex space-x-4 sm:space-x-6 tracking-widest uppercase italic">
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">Terms</span>
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">Mission</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
