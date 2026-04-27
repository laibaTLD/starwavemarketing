"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Custom scramble text function
const scrambleText = (element: HTMLElement, finalText: string, duration: number, chars: string = "!@#$%^&*()_+-=[]{}|;:,.<>?") => {
  let currentIndex = 0;
  const totalChars = finalText.length;
  const scrambleChars = chars.split('');
  
  const animate = () => {
    let scrambled = "";
    for (let i = 0; i < totalChars; i++) {
      if (i < currentIndex) {
        scrambled += finalText[i];
      } else {
        scrambled += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }
    }
    element.textContent = scrambled;
    
    if (currentIndex < totalChars) {
      currentIndex++;
      setTimeout(animate, duration / totalChars);
    }
  };
  
  animate();
};

interface CTASectionProps {
  onLaunch?: () => void;
}

export default function CTASection({ onLaunch }: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement>(null);
  const leftLogsRef = useRef<HTMLDivElement>(null);
  const rightMetadataRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const inputPromptRef = useRef<HTMLDivElement>(null);
  const safetyRef = useRef<HTMLDivElement>(null);
  const statusBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // --- STEP 1: THE SCRAMBLE (Main Heading) ---
      const scrambleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });

      scrambleTimeline
        .fromTo(mainHeadingRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        )
        .call(() => {
          if (mainHeadingRef.current) {
            scrambleText(mainHeadingRef.current, "TRANSMIT YOUR VISION", 1200, "Xk9$2!@#%&*");
          }
        });

      // --- STEP 2: THE TYPEWRITER (Lateral Readouts) ---
      const typewriterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse"
        }
      });

      // Left logs - type in one by one
      const leftLogs = leftLogsRef.current?.querySelectorAll('.log-line');
      if (leftLogs) {
        leftLogs.forEach((log, index) => {
          const text = log.textContent || "";
          log.textContent = "";
          typewriterTimeline.call(() => {
            scrambleText(log as HTMLElement, text, 150, "!@#$%^&*()_+-=[]{}|;:,.<>?");
          }, [], `+=${index * 0.15}`);
        });
      }

      // Right metadata - type in one by one
      const rightMetadata = rightMetadataRef.current?.querySelectorAll('.meta-line');
      if (rightMetadata) {
        rightMetadata.forEach((meta, index) => {
          const text = meta.textContent || "";
          meta.textContent = "";
          typewriterTimeline.call(() => {
            scrambleText(meta as HTMLElement, text, 150, "!@#$%^&*()_+-=[]{}|;:,.<>?");
          }, [], `+=${(leftLogs?.length || 0) * 0.15 + index * 0.15}`);
        });
      }

      // --- STEP 3: THE PULSE (CTA Button) ---
      gsap.to(ctaButtonRef.current, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 40%",
          toggleActions: "play none none reverse"
        }
      });

      // --- STEP 4: THE HOVER (Status Badge) ---
      const handleHover = () => {
        if (statusBadgeRef.current) {
          scrambleText(statusBadgeRef.current, "> SYSTEM_CHECK: LOCKED_ON", 450, "Xk9$2!@#%&*");
          gsap.to(statusBadgeRef.current, { color: "#FFA500", duration: 0.5 });
        }
      };

      const handleHoverOut = () => {
        if (statusBadgeRef.current) {
          scrambleText(statusBadgeRef.current, "> SYSTEM_CHECK: TARGET_ACQUIRED", 450, "Xk9$2!@#%&*");
          gsap.to(statusBadgeRef.current, { color: "#60A5FA", duration: 0.5 });
        }
      };

      // Add hover listeners to the section
      sectionRef.current?.addEventListener('mouseenter', handleHover);
      sectionRef.current?.addEventListener('mouseleave', handleHoverOut);

      // --- Additional entrance animations for other elements ---
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      const prompts = [inputPromptRef.current, safetyRef.current];
      gsap.fromTo(prompts,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2,
          ease: "power2.out",
          delay: 1.0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 40%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Cleanup function
      return () => {
        sectionRef.current?.removeEventListener('mouseenter', handleHover);
        sectionRef.current?.removeEventListener('mouseleave', handleHoverOut);
      };

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style jsx global>{`
        .metallic-text {
          background: linear-gradient(120deg, #ffffff 0%, #3B82F6 50%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        .neon-border {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 10px rgba(59, 130, 246, 0.2);
        }

        .grid-bg {
          background-image: linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .terminal-cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
        }
      `}</style>

      <section 
        ref={sectionRef}
        className="relative w-full min-h-screen bg-[#020406] overflow-hidden flex items-center justify-center px-4 md:px-8 lg:px-20"
      >
        {/* BACKGROUND GRID */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-20 text-center">
          
          {/* 1. THE HEADER SEQUENCE */}
          <div 
            ref={headerRef}
            className="mb-6 md:mb-8 space-y-2"
          >
            {/* Prompt A (Status) */}
            <div 
              ref={statusBadgeRef}
              className="font-mono text-[10px] md:text-xs text-blue-400 tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-80"
            >
              &gt; SYSTEM_CHECK: TARGET_ACQUIRED
            </div>
            
            {/* Prompt B (The Hook) */}
            <div className="font-mono text-[10px] md:text-xs text-cyan-400 tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-80">
              [ PHASE: FINAL_APPROACH ]
            </div>
          </div>

          {/* 2. MAIN HEADING */}
          <h1 
            ref={mainHeadingRef}
            className="font-michroma text-white text-3xl sm:text-5xl md:text-6xl lg:text-8xl leading-[0.9] md:leading-[0.85] uppercase mb-8 md:mb-16 transition-all"
          >
            TRANSMIT YOUR <span className="metallic-text">VISION</span>
          </h1>

          {/* 3. LATERAL READOUTS CONTAINER */}
          <div className="relative mb-8 md:mb-16">
            
            {/* LEFT SIDE - SYSTEM LOGS */}
            <div 
              ref={leftLogsRef}
              className="hidden md:block absolute left-0 top-0 text-left space-y-1"
            >
              <div className="log-line font-mono text-[8px] lg:text-[10px] text-gray-500 opacity-70">
                &gt; UPLINK_ESTABLISHED...
              </div>
              <div className="log-line font-mono text-[8px] lg:text-[10px] text-gray-500 opacity-70">
                &gt; BANDWIDTH: OPTIMAL
              </div>
              <div className="log-line font-mono text-[8px] lg:text-[10px] text-gray-500 opacity-70">
                &gt; ENCRYPTION: AES-256_ACTIVE
              </div>
              <div className="log-line font-mono text-[8px] lg:text-[10px] text-gray-500 opacity-70">
                &gt; READY_TO_BROADCAST
              </div>
            </div>

            {/* RIGHT SIDE - METADATA */}
            <div 
              ref={rightMetadataRef}
              className="hidden md:block absolute right-0 top-0 text-right space-y-1"
            >
              <div className="meta-line font-mono text-[8px] lg:text-[10px] text-gray-500 opacity-70">
                LOC: [USER_CURRENT_SECTOR]
              </div>
              <div className="meta-line font-mono text-[8px] lg:text-[10px] text-gray-500 opacity-70">
                TIME: [T-MINUS_00:00:00]
              </div>
              <div className="meta-line font-mono text-[8px] lg:text-[10px] text-gray-500 opacity-70">
                MISSION: DIGITAL_ASCENSION
              </div>
              <div className="meta-line font-mono text-[8px] lg:text-[10px] text-gray-500 opacity-70">
                CAPACITY: 2_SLOTS_REMAINING
              </div>
            </div>
          </div>

          {/* 4. INTERACTION PROMPTS */}
          <div className="relative z-20 space-y-6">
            
            {/* Above Button - Input Required */}
            <div 
              ref={inputPromptRef}
              className="font-mono text-[10px] md:text-xs text-orange-400 tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-80"
            >
              [ INPUT_REQUIRED: INITIATE_PROJECT ]
            </div>

            {/* CTA Button */}
            <button
              ref={ctaButtonRef}
              className="group relative px-8 md:px-12 py-3 md:py-4 bg-white text-black font-michroma uppercase text-sm md:text-lg tracking-widest hover:bg-blue-400 transition-all duration-300 neon-border pulse-glow"
              onClick={() => {
                // Add your CTA action here
                console.log('CTA clicked - Commence Ignition');
                if (onLaunch) {
                  onLaunch();
                }
              }}
            >
              COMMENCE IGNITION
              <div className="absolute -bottom-1 -right-1 w-2 md:w-3 h-2 md:h-3 bg-blue-500 group-hover:bg-white transition-colors" />
            </button>

            {/* Below Button - Safety */}
            <div 
              ref={safetyRef}
              className="font-mono text-[9px] md:text-[10px] text-gray-600 opacity-60"
            >
              &gt; NO_RECOIL_GUARANTEED // 100% SECURE
            </div>
          </div>

          {/* DECORATIVE CORNER BRACKETS */}
          <div className="absolute top-4 md:top-10 left-4 md:left-10 w-6 md:w-8 h-[1px] bg-blue-500/50" />
          <div className="absolute top-4 md:top-10 left-4 md:left-10 h-6 md:h-8 w-[1px] bg-blue-500/50" />
          <div className="absolute top-4 md:top-10 right-4 md:right-10 w-6 md:w-8 h-[1px] bg-blue-500/50" />
          <div className="absolute top-4 md:top-10 right-4 md:right-10 h-6 md:h-8 w-[1px] bg-blue-500/50" />
          <div className="absolute bottom-4 md:bottom-10 left-4 md:left-10 w-6 md:w-8 h-[1px] bg-blue-500/50" />
          <div className="absolute bottom-4 md:bottom-10 left-4 md:left-10 h-6 md:h-8 w-[1px] bg-blue-500/50" />
          <div className="absolute bottom-4 md:bottom-10 right-4 md:right-10 w-6 md:w-8 h-[1px] bg-blue-500/50" />
          <div className="absolute bottom-4 md:bottom-10 right-4 md:right-10 h-6 md:h-8 w-[1px] bg-blue-500/50" />

        </div>
      </section>
    </>
  );
}
