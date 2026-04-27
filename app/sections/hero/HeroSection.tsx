"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLParagraphElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const missionStatusRef = useRef<HTMLDivElement>(null);
  const coordinatesRef = useRef<HTMLDivElement>(null);
  const hudGridRef = useRef<HTMLDivElement>(null);
  const hudTopLeftRef = useRef<HTMLDivElement>(null);
  const hudBottomRightRef = useRef<HTMLDivElement>(null);
  const cornerBracketLeftRef = useRef<HTMLDivElement>(null);
  const cornerBracketRightRef = useRef<HTMLDivElement>(null);
  const signalStrengthRef = useRef<HTMLDivElement>(null);
  const connectingStatusRef = useRef<HTMLDivElement>(null);
  const satelliteRef = useRef<HTMLDivElement>(null);
  const asteroidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current || !satelliteRef.current || !asteroidRef.current) return;

    const ctx = gsap.context(() => {
      /* ──────────────────────────────────────
         ENTRY ANIMATIONS
         ────────────────────────────────────── */
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power4.out",
          delay: 0.2,
        }
      );

      // Subheading reveal
      gsap.fromTo(
        subHeadingRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          delay: 0.7,
        }
      );

      // CTA Button reveal
      gsap.fromTo(
        ctaButtonRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 1.0,
        }
      );

      // Technical text elements reveal
      gsap.fromTo(
        [missionStatusRef.current, coordinatesRef.current],
        { opacity: 0 },
        {
          opacity: 0.4,
          duration: 1.5,
          ease: "power2.out",
          delay: 1.5,
        }
      );

      // Corner brackets reveal
      gsap.fromTo(
        [cornerBracketLeftRef.current, cornerBracketRightRef.current],
        { opacity: 0, scale: 0.8 },
        {
          opacity: 0.6,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          delay: 2.0,
        }
      );

      // Signal strength and connecting status reveal
      gsap.fromTo(
        [signalStrengthRef.current, connectingStatusRef.current],
        { opacity: 0, x: -20 },
        {
          opacity: 0.5,
          x: 0,
          duration: 1,
          ease: "power2.out",
          delay: 2.2,
        }
      );

      // HUD grid reveal
      gsap.fromTo(
        hudGridRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          delay: 2.4,
        }
      );

      // HUD crosshair brackets reveal
      gsap.fromTo(
        [hudTopLeftRef.current, hudBottomRightRef.current],
        { opacity: 0, scale: 0.8 },
        {
          opacity: 0.6,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          delay: 2.6,
        }
      );

      // Pulsing animation for connecting dot
      gsap.to(connectingStatusRef.current, {
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 3.0,
      });

      // Assets staggered reveal
      const assets = [
        satelliteRef.current,
        asteroidRef.current,
      ];

      gsap.fromTo(
        assets,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.2,
          delay: 0.5,
        }
      );

      /* ──────────────────────────────────────
         GSAP PARALLAX LOGIC (Differential Depth)
         ────────────────────────────────────── */

      // 1. TEXT PLANE (.heading): 1.0x Baseline Speed
      gsap.fromTo(headingRef.current, 
        { y: 0 }, // Start position
        {
          y: -300, // End position - Reduced scroll amount for centered layout
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // 1.5. SUBHEADING: Slightly slower than heading
      gsap.fromTo(subHeadingRef.current,
        { y: 0 }, // Start position
        {
          y: -200, // End position - Slower scroll for subheading
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // 1.7. CTA BUTTON: Even slower for depth
      gsap.fromTo(ctaButtonRef.current,
        { y: 0 }, // Start position
        {
          y: -150, // End position - Slowest scroll for CTA button
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // 2. SLOW PLANE (.asset-mg): 0.4x Relative Speed
      // Drift -200px to -400px over the scroll range
      gsap.fromTo([satelliteRef.current, asteroidRef.current],
        { y: 0, x: 0, rotation: 0 }, // Start position
        {
          y: -300,
          x: (i) => (i === 0 ? 80 : -50), // Subtle drift
          rotation: (i) => (i === 0 ? -15 : 20),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatWeightless {
          0%, 100% { transform: translateY(0px) rotate(0.2deg); }
          50% { transform: translateY(-25px) rotate(-0.5deg); }
        }
        
        @keyframes lensFlare {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .lens-flare-effect {
          position: relative;
          overflow: hidden;
        }
        
        .lens-flare-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 45%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0.4) 55%,
            transparent 100%
          );
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .lens-flare-effect:hover::before {
          opacity: 1;
          animation: lensFlare 0.8s ease-out;
          filter: blur(2px);
        }
      `}</style>
      <section
        ref={sectionRef}
        style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "10vh",
        overflow: "hidden",
        zIndex: 1,
      }}
    >

      {/* ── HERO HUB (Z:40) ── */}
      <div style={{ position: "relative", zIndex: 80, textAlign: "center" }}>
        <h1
          ref={headingRef}
          className="font-michroma heading metallic-text glow-metal"
          style={{
            position: "relative",
            zIndex: 80,
            textAlign: "center",
            fontSize: "clamp(1rem, 6vw, 6rem)",
            lineHeight: 0.9,
            pointerEvents: "none",
            willChange: "transform",
            textTransform: "uppercase",
            textShadow: "0 0 15px rgba(255, 140, 0, 0.3)",
            marginBottom: "1rem",
          }}
        >
          Starwave 
          <br />
          Marketing
        </h1>

        {/* ── TAGLINE (UNDER MARKETING) ── */}
        <p
          ref={subHeadingRef}
          className="font-helvetica text-metallic-gray"
          style={{
            position: "relative",
            zIndex: 40,
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            maxWidth: "600px",
            letterSpacing: "0.2rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Creative digital experiences that captivate and convert
        </p>

        {/* ── CTA BUTTON (GLASSMORPHIC) ── */}
        <button
          ref={ctaButtonRef}
          className="font-helvetica lens-flare-effect"
          style={{
            position: "relative",
            zIndex: 40,
            padding: "0.75rem 1.875rem", // 25% reduction from 1rem 2.5rem
            fontSize: "clamp(0.675rem, 1.5vw, 0.825rem)", // 25% reduction from 0.9rem 2vw 1.1rem
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.15rem",
            color: "#f0f0f0", // Light silver/white text
            textShadow: "0 0 8px rgba(255, 215, 0, 0.3)", // Subtle gold text-shadow
            background: "rgba(40, 40, 45, 0.7)", // Semi-transparent deep charcoal
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(100, 150, 255, 0.4)", // Faint blue border
            borderRadius: "50px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 0 25px rgba(100, 150, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)", // Blue outer glow
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "1px solid rgba(100, 150, 255, 0.8)";
            e.currentTarget.style.boxShadow = "0 0 50px rgba(100, 150, 255, 0.6), inset 0 0 25px rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "1px solid rgba(100, 150, 255, 0.4)";
            e.currentTarget.style.boxShadow = "0 0 25px rgba(100, 150, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Launch Project
        </button>
      </div>

      {/* ── TACTICAL MID-GROUND (Z:30) ── */}
      {/* Satellite (Left Top Corner - Scaled Down 30%) */}
      <div
        ref={satelliteRef}
        style={{
          position: "absolute",
          top: "10px",
          left: "-50px",
          zIndex: 30,
          pointerEvents: "none",
          willChange: "transform",
          background: "transparent",
          width: "clamp(196px, 24.5vw, 385px)", // 30% smaller than original
        }}
      >
        <img
          src="/assets/space-satellite.png"
          alt="Satellite"
          loading="eager"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            mixBlendMode: "screen",
            filter: "hue-rotate(180deg) brightness(0.8) contrast(1.3) blur(3px) drop-shadow(0 0 30px rgba(255, 255, 255, 0.1))",
            animation: "floatWeightless 8s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── SIGNAL STRENGTH (BOTTOM-LEFT) ── */}
      <div
        ref={signalStrengthRef}
        style={{
          position: "absolute",
          bottom: "clamp(80px, 12vh, 100px)",
          left: "clamp(10px, 2vw, 20px)",
          zIndex: 35,
          opacity: 0.5,
        }}
      >
        <div style={{
          fontSize: "8px",
          color: "#00ff00",
          fontFamily: "monospace",
          marginBottom: "4px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}>
          SIGNAL
        </div>
        <div style={{
          display: "flex",
          gap: "2px",
          alignItems: "flex-end",
        }}>
          <div style={{
            width: "3px",
            height: "8px",
            backgroundColor: "#00ff00",
            boxShadow: "0 0 3px rgba(0, 255, 0, 0.5)",
          }} />
          <div style={{
            width: "3px",
            height: "12px",
            backgroundColor: "#00ff00",
            boxShadow: "0 0 3px rgba(0, 255, 0, 0.5)",
          }} />
          <div style={{
            width: "3px",
            height: "16px",
            backgroundColor: "#00ff00",
            boxShadow: "0 0 3px rgba(0, 255, 0, 0.5)",
          }} />
          <div style={{
            width: "3px",
            height: "10px",
            backgroundColor: "#ffff00",
            boxShadow: "0 0 3px rgba(255, 255, 0, 0.5)",
          }} />
          <div style={{
            width: "3px",
            height: "6px",
            backgroundColor: "#ffff00",
            boxShadow: "0 0 3px rgba(255, 255, 0, 0.5)",
          }} />
        </div>
      </div>

      {/* ── CONNECTING STATUS (BOTTOM-LEFT) ── */}
      <div
        ref={connectingStatusRef}
        style={{
          position: "absolute",
          bottom: "clamp(50px, 8vh, 70px)",
          left: "clamp(10px, 2vw, 20px)",
          zIndex: 35,
          opacity: 0.5,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          lineHeight: "1",
          transform: "translateY(-1px)",
        }}
      >
        <div style={{
          width: "6px",
          height: "6px",
          backgroundColor: "#00ffff",
          borderRadius: "50%",
          boxShadow: "0 0 8px rgba(0, 255, 255, 0.4)",
          border: "1px solid rgba(0, 255, 255, 0.3)",
        }} />
        <div style={{
          fontSize: "9px",
          color: "#00ffff",
          fontFamily: "monospace",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}>
          CONNECTING TO STARWAVE....
        </div>
      </div>

      {/* Small Asteroid (Far Mid-Right - Scaled Down 20%) */}
      <div
        ref={asteroidRef}
        style={{
          position: "absolute",
          top: "50%",
          right: "-20px",
          zIndex: 30,
          pointerEvents: "none",
          willChange: "transform",
          background: "transparent",
        }}
      >
        <img
          src="/assets/asteroid.png"
          alt="Small Asteroid"
          loading="eager"
          style={{
            display: "block",
            width: "128px", // 20% smaller than 160px
            height: "100%",
            objectFit: "contain",
            mixBlendMode: "screen",
            filter: "brightness(0.8) contrast(1.4) saturate(0.8) blur(1.5px) drop-shadow(0 0 20px rgba(255, 140, 0, 0.6))",
          }}
        />
      </div>

      
      {/* ── HUD GRID (TWO-COLUMN TECHNICAL DISPLAY) ── */}
      <div
        ref={hudGridRef}
        style={{
          position: "absolute",
          bottom: "clamp(60px, 10vh, 80px)",
          right: "clamp(10px, 2vw, 20px)",
          zIndex: 40,
          width: "clamp(200px, 40vw, 280px)",
          maxWidth: "90vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(10px, 2vw, 20px)",
          padding: "clamp(8px, 2vw, 15px)",
          background: "radial-gradient(circle at 30% 50%, rgba(0, 10, 30, 0.8), rgba(0, 5, 20, 0.9)), repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)",
          border: "1px solid rgba(0, 255, 255, 0.2)",
          borderRadius: "4px",
          filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.2))",
        }}
      >
        {/* Left Column - Status */}
        <div
          ref={missionStatusRef}
          style={{
            fontSize: "clamp(8px, 1.5vw, 11px)",
            color: "#00ff00",
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "clamp(0.5px, 0.5vw, 1px)",
            lineHeight: "1.4",
            filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.2))",
          }}
        >
          STATUS: <span style={{ color: "#ffff00" }}>ACTIVE</span>
          <br />
          [<span style={{ color: "#00ffff" }}>STREAMING</span>]
        </div>

        {/* Right Column - Coordinates */}
        <div
          ref={coordinatesRef}
          style={{
            fontSize: "clamp(9px, 1.8vw, 12px)",
            color: "#00ff00",
            fontFamily: "monospace",
            letterSpacing: "0.5px",
            lineHeight: "1.3",
            textAlign: "left",
            paddingLeft: "clamp(8px, 2vw, 20px)",
            filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.2))",
          }}
        >
          <div>LAT: 28.5728</div>
          <div style={{ marginTop: "2px" }}>LONG: -80.6490</div>
          <div style={{ marginTop: "6px", fontSize: "clamp(8px, 1.5vw, 10px)" }}>ALT: 42.3511 km</div>
        </div>
      </div>

      {/* HUD Crosshair Brackets */}
      {/* Top-left crosshair - Top corner of page */}
      <div
        ref={hudTopLeftRef}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 41,
          opacity: 0.6,
          filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.2))",
        }}
      >
        <div style={{
          width: "20px",
          height: "1px",
          backgroundColor: "#00ffff",
          boxShadow: "0 0 3px rgba(0, 255, 255, 0.5)",
        }} />
        <div style={{
          width: "1px",
          height: "20px",
          backgroundColor: "#00ffff",
          boxShadow: "0 0 3px rgba(0, 255, 255, 0.5)",
          marginTop: "-1px",
        }} />
      </div>

      {/* Top-right crosshair - Top corner of page */}
      <div
        ref={hudBottomRightRef}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 41,
          opacity: 0.6,
          filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.2))",
        }}
      >
        <div style={{
          width: "20px",
          height: "1px",
          backgroundColor: "#00ffff",
          boxShadow: "0 0 3px rgba(0, 255, 255, 0.5)",
          marginLeft: "auto",
        }} />
        <div style={{
          width: "1px",
          height: "20px",
          backgroundColor: "#00ffff",
          boxShadow: "0 0 3px rgba(0, 255, 255, 0.5)",
          marginTop: "-1px",
          marginLeft: "19px",
        }} />
      </div>

      {/* ── CORNER BRACKETS (VIEWFINDER) ── */}
      {/* Bottom-left corner bracket */}
      <div
        ref={cornerBracketLeftRef}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "30px",
          zIndex: 40,
          opacity: 0.6,
        }}
      >
        <div style={{
          width: "20px",
          height: "1px",
          backgroundColor: "#00ffff",
          boxShadow: "0 0 5px rgba(0, 255, 255, 0.5)",
        }} />
        <div style={{
          width: "1px",
          height: "20px",
          backgroundColor: "#00ffff",
          boxShadow: "0 0 5px rgba(0, 255, 255, 0.5)",
          marginTop: "-1px",
        }} />
      </div>

      {/* Bottom-right corner bracket */}
      <div
        ref={cornerBracketRightRef}
        style={{
          position: "absolute",
          bottom: "30px",
          right: "30px",
          zIndex: 40,
          opacity: 0.6,
        }}
      >
        <div style={{
          width: "20px",
          height: "1px",
          backgroundColor: "#00ffff",
          boxShadow: "0 0 5px rgba(0, 255, 255, 0.5)",
          marginLeft: "auto",
        }} />
        <div style={{
          width: "1px",
          height: "20px",
          backgroundColor: "#00ffff",
          boxShadow: "0 0 5px rgba(0, 255, 255, 0.5)",
          marginTop: "-1px",
          marginLeft: "19px",
        }} />
      </div>
    </section>
    </>
  );
}