"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 630;
const FRAME_PREFIX = "/frames/frame-";
const PRELOAD_RADIUS = 100;      // frames to load ahead + behind current position
const UNLOAD_RADIUS = 180;       // frames to keep in cache (beyond this = evicted)
const INITIAL_LOAD_SIZE = 50;
const ACTIVE_SCROLL_RANGE = 0.6; // fraction of scroll used for frame animation
const FADE_RANGE = 0.05;         // fraction of scroll used for fade-out after animation

type FrameCache = Map<number, HTMLImageElement>;

export default function FrameBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Use a Map for O(1) delete and iteration over only cached entries
  const frameCache = useRef<FrameCache>(new Map());
  const inFlight = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(0);

  // RAF handle for batching draw calls
  const rafHandle = useRef<number | null>(null);
  // Track last drawn frame to skip redundant redraws
  const lastDrawnFrame = useRef(-1);

  // ─── Frame loading ──────────────────────────────────────────────────────────

  const loadFrame = useCallback((n: number): Promise<HTMLImageElement> => {
    const cached = frameCache.current.get(n);
    if (cached) return Promise.resolve(cached);

    if (inFlight.current.has(n)) {
      // Wait for the in-flight request to complete instead of starting a duplicate
      return new Promise((resolve, reject) => {
        const check = setInterval(() => {
          const img = frameCache.current.get(n);
          if (img) { clearInterval(check); resolve(img); }
          else if (!inFlight.current.has(n)) { clearInterval(check); reject(new Error(`Frame ${n} failed`)); }
        }, 16);
      });
    }

    inFlight.current.add(n);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `${FRAME_PREFIX}${n}.webp`;
      img.onload = () => {
        frameCache.current.set(n, img);
        inFlight.current.delete(n);
        resolve(img);
      };
      img.onerror = () => {
        inFlight.current.delete(n);
        reject(new Error(`Frame ${n} load failed`));
      };
    });
  }, []);

  /**
   * Load a range of frames concurrently. Already-cached / in-flight frames are
   * skipped cheaply before touching the network.
   */
  const loadRange = useCallback(
    (start: number, end: number): Promise<void> => {
      const promises: Promise<void>[] = [];
      for (let i = Math.max(1, start); i <= Math.min(TOTAL_FRAMES, end); i++) {
        if (!frameCache.current.has(i) && !inFlight.current.has(i)) {
          promises.push(loadFrame(i).then(() => undefined).catch(() => undefined));
        }
      }
      return Promise.all(promises).then(() => undefined);
    },
    [loadFrame]
  );

  /**
   * Evict frames that are far from `center`. Runs at most once per invocation
   * and only iterates cached keys (not the full 0–630 range).
   */
  const evictDistant = useCallback((center: number) => {
    for (const [n] of frameCache.current) {
      if (Math.abs(n - center) > UNLOAD_RADIUS) {
        frameCache.current.delete(n);
      }
    }
  }, []);

  // ─── Initial load ───────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      await loadRange(1, INITIAL_LOAD_SIZE);
      setInitialLoadComplete(true);
      setLoadingProgress((INITIAL_LOAD_SIZE / TOTAL_FRAMES) * 100);
    })();
  }, [loadRange]);

  // ─── Canvas / GSAP setup ────────────────────────────────────────────────────

  useEffect(() => {
    if (!initialLoadComplete || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;


    // ── Drawing helpers ──────────────────────────────────────────────────────

    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width, ch = canvas.height;
      const ir = img.width / img.height;
      const cr = cw / ch;
      let dw: number, dh: number, ox: number, oy: number;
      if (cr > ir) {
        dw = cw; dh = dw / ir; ox = 0; oy = (ch - dh) / 2;
      } else {
        dh = ch; dw = dh * ir; ox = (cw - dw) / 2; oy = 0;
      }
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, ox, oy, dw, dh);
    };

    const drawFrame = (index: number) => {
      // index is 0-based; cache is 1-based
      if (index === lastDrawnFrame.current) return;
      const img = frameCache.current.get(index + 1);
      if (!img) return;
      drawCover(img);
      lastDrawnFrame.current = index;
    };

    const drawFade = (opacity: number) => {
      const cw = canvas.width, ch = canvas.height;
      if (opacity <= 0) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, cw, ch);
        return;
      }
      const lastImg = frameCache.current.get(TOTAL_FRAMES);
      if (lastImg) {
        drawCover(lastImg);                        // draw image at full opacity
        ctx.fillStyle = `rgba(0,0,0,${1 - opacity})`; // then dim with overlay
        ctx.fillRect(0, 0, cw, ch);
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, cw, ch);
      }
      lastDrawnFrame.current = -1; // invalidate so next frame tick repaints
    };


    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Repaint current frame after resize
      const img = frameCache.current.get(currentFrameRef.current + 1);
      if (img) drawCover(img);
    };
    resize();
    window.addEventListener("resize", resize);
    
    // ── Initial frame ────────────────────────────────────────────────────────

    drawFrame(0);

    // ── Preload scheduler ────────────────────────────────────────────────────

    let preloadTimer: ReturnType<typeof setTimeout> | null = null;

    const schedulePreload = (center: number) => {
      if (preloadTimer) return; // already scheduled
      preloadTimer = setTimeout(async () => {
        preloadTimer = null;
        const start = center - PRELOAD_RADIUS;
        const end = center + PRELOAD_RADIUS;
        await loadRange(start, end);
        evictDistant(center);
        const loaded = frameCache.current.size;
        setLoadingProgress(Math.min(100, (loaded / TOTAL_FRAMES) * 100));
      }, 50); // 50 ms debounce — tight enough to feel instant
    };

    // ── ScrollTrigger ────────────────────────────────────────────────────────

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress <= ACTIVE_SCROLL_RANGE) {
          const activeProgress = progress / ACTIVE_SCROLL_RANGE;
          const frameIndex = Math.min(
            Math.floor(activeProgress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          );
          currentFrameRef.current = frameIndex;

          // Batch all DOM writes into a single RAF
          if (rafHandle.current !== null) cancelAnimationFrame(rafHandle.current);
          rafHandle.current = requestAnimationFrame(() => {
            drawFrame(frameIndex);
            rafHandle.current = null;
          });

          schedulePreload(frameIndex + 1); // cache uses 1-based index

        } else {
          // Fade out over FADE_RANGE after the active animation ends
          const fadeProgress = Math.min(
            (progress - ACTIVE_SCROLL_RANGE) / FADE_RANGE,
            1
          );
          const opacity = 1 - fadeProgress;

          if (rafHandle.current !== null) cancelAnimationFrame(rafHandle.current);
          rafHandle.current = requestAnimationFrame(() => {
            drawFade(opacity);
            rafHandle.current = null;
          });
        }
      },
    });

    return () => {
      st.kill();
      window.removeEventListener("resize", resize);
      if (rafHandle.current !== null) cancelAnimationFrame(rafHandle.current);
      if (preloadTimer) clearTimeout(preloadTimer);
    };
  }, [initialLoadComplete, loadRange, evictDistant]);

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
      {!initialLoadComplete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <p className="font-helvetica text-xl mb-2">Initializing...</p>
            <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="font-helvetica text-sm mt-2 text-gray-400">
              {Math.round(loadingProgress)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}