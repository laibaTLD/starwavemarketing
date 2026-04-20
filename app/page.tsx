"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FrameBackground from "./components/FrameBackground";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLParagraphElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      // Sub-heading animation
      gsap.fromTo(
        subHeadingRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: subHeadingRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      // Paragraph animation
      gsap.fromTo(
        paragraphRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: paragraphRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <FrameBackground />
      <main className="relative min-h-[800vh] text-white">
        {/* Section 1 */}
        <section className="h-screen flex flex-col items-center justify-center px-16">
          <h1
            ref={headingRef}
            className="heading text-6xl md:text-8xl metallic-text glow-metal mb-8 text-center"
          >
            Starwave Marketing
          </h1>
        </section>

        {/* Section 2 */}
        <section className="h-screen flex flex-col items-center justify-center px-16">
          <p
            ref={subHeadingRef}
            className="font-helvetica text-2xl md:text-4xl text-metallic-gray text-center max-w-3xl"
          >
            Creative digital experiences that captivate and convert
          </p>
        </section>

        {/* Section 3 */}
        <section className="h-screen flex flex-col items-center justify-center px-16">
          <p
            ref={paragraphRef}
            className="font-fulco text-xl md:text-2xl text-white text-center max-w-2xl"
          >
            We craft immersive brand stories through cutting-edge design and technology
          </p>
        </section>
      </main>
    </>
  );
}