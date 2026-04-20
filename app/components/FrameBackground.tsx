"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 630;
const FRAME_PREFIX = "/frames/frame-";

export default function FrameBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const images: HTMLImageElement[] = [];
      let loadedCount = 0;

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `${FRAME_PREFIX}${i}.png`;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === TOTAL_FRAMES) {
            setImagesLoaded(true);
          }
        };
        images.push(img);
      }
      imagesRef.current = images;
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const images = imagesRef.current;
    const obj = { frame: 0 };

    // Function to draw image with object-cover behavior
    const drawImageCover = (img: HTMLImageElement) => {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      // Scale to fill entire canvas, crop if necessary
      if (canvasRatio > imgRatio) {
        // Canvas is wider than image - scale image to fill width
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        // Image is wider than canvas - scale image to fill height
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }
      
      // Fill background with black first
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw image - it will extend beyond canvas edges
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Draw first frame
    if (images[0]) {
      drawImageCover(images[0]);
    }

    // GSAP scroll animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          Math.floor(self.progress * (TOTAL_FRAMES - 1)),
          TOTAL_FRAMES - 1
        );
        obj.frame = frameIndex;

        if (images[frameIndex]) {
          drawImageCover(images[frameIndex]);
        }
      },
    });

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const currentFrame = obj.frame;
      if (images[currentFrame]) {
        drawImageCover(images[currentFrame]);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      scrollTrigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [imagesLoaded]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ height: "800vh" }}
    >
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full object-cover"
      />
      {!imagesLoaded && (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
          <p className="font-helvetica text-xl">Loading...</p>
        </div>
      )}
    </div>
  );
}
