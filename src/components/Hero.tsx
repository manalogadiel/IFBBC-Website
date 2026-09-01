import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Volume2 } from 'lucide-react';
import { MagneticButton } from './ui/MagneticButton';
import { LineMaskReveal } from './ui/LineMaskReveal';

// High-density frame buffer: 90 discrete frames ensures silky 60FPS scrubbing with fast texture extraction
const TOTAL_FRAMES = 90;
const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

interface HeroProps {
  onOpenVisit: () => void;
  onScrollToSermons: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenVisit, onScrollToSermons }) => {
  // ── 1. Next Sunday Gathering Countdown ─────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSunday = new Date();
      const currentDay = now.getDay();
      const daysUntilSunday = currentDay === 0 && now.getHours() < 9 ? 0 : (7 - currentDay) % 7 || 7;

      nextSunday.setDate(now.getDate() + daysUntilSunday);
      nextSunday.setHours(9, 0, 0, 0);

      const diff = nextSunday.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── 2. Canvas & Frame-Sequence Engine Refs ─────────────────────────────────
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEngineReady, setIsEngineReady] = useState(false);

  // ── 3. High-Performance Canvas Frame-Sequence Pipeline ──────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // In-memory GPU-backed texture cache
    const frameBitmaps: (ImageBitmap | null)[] = new Array(TOTAL_FRAMES).fill(null);
    let targetFrame = 0;
    let currentFrame = 0;
    let isExtracting = true;
    let rafId: number;

    // Offscreen hardware decoder instance
    const offscreenVideo = document.createElement('video');
    offscreenVideo.src = '/Background Church.mp4';
    offscreenVideo.muted = true;
    offscreenVideo.playsInline = true;
    offscreenVideo.preload = 'auto';

    // Cover Aspect-Ratio Helper (mimics object-fit: cover with zero distortion)
    const drawFrameCover = (drawable: ImageBitmap | HTMLVideoElement) => {
      if (!canvas || !ctx) return;
      const cWidth = canvas.width;
      const cHeight = canvas.height;
      const sWidth = (drawable as HTMLVideoElement).videoWidth || (drawable as ImageBitmap).width;
      const sHeight = (drawable as HTMLVideoElement).videoHeight || (drawable as ImageBitmap).height;

      if (!sWidth || !sHeight || cWidth === 0 || cHeight === 0) return;

      const canvasRatio = cWidth / cHeight;
      const sourceRatio = sWidth / sHeight;

      let renderWidth = sWidth;
      let renderHeight = sHeight;
      let sx = 0;
      let sy = 0;

      if (sourceRatio > canvasRatio) {
        renderWidth = sHeight * canvasRatio;
        sx = (sWidth - renderWidth) / 2;
      } else {
        renderHeight = sWidth / canvasRatio;
        sy = (sHeight - renderHeight) / 2;
      }

      ctx.drawImage(drawable, sx, sy, renderWidth, renderHeight, 0, 0, cWidth, cHeight);
    };

    // Canvas DPR & Sizing Adjuster
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const displayWidth = rect.width || window.innerWidth;
      const displayHeight = rect.height || window.innerHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }
      handleScroll();
    };

    // Frame Extraction Loop: Pre-captures high-res GPU bitmaps sequentially
    let extractIdx = 0;
    const extractNextFrame = () => {
      if (!isExtracting || extractIdx >= TOTAL_FRAMES || !offscreenVideo.duration) return;
      // Extract up to the last valid frame (duration - 0.04s) to avoid black frames or decoder EOF
      const time = (extractIdx / (TOTAL_FRAMES - 1)) * Math.max(0, offscreenVideo.duration - 0.04);
      offscreenVideo.currentTime = time;
    };

    offscreenVideo.addEventListener('seeked', async () => {
      if (!isExtracting || extractIdx >= TOTAL_FRAMES) return;
      try {
        const bitmap = await createImageBitmap(offscreenVideo);
        frameBitmaps[extractIdx] = bitmap;

        // Render first frame immediately so canvas isn't blank
        if (extractIdx === 0) {
          setIsEngineReady(true);
          drawFrameCover(bitmap);
        }

        extractIdx++;
        if (extractIdx < TOTAL_FRAMES) {
          extractNextFrame();
        } else {
          isExtracting = false;
        }
      } catch {
        extractIdx++;
        if (extractIdx < TOTAL_FRAMES) extractNextFrame();
      }
    });

    // ── Safeguard 1: Metadata & CanPlayThrough Loading Guard ──
    const initEngine = () => {
      if (!offscreenVideo.duration) return;
      offscreenVideo.pause();
      extractNextFrame();
      handleResize();
    };

    offscreenVideo.addEventListener('loadedmetadata', initEngine);
    offscreenVideo.addEventListener('canplaythrough', initEngine);

    // Fallback if readyState >= 1 (e.g. cached video)
    if (offscreenVideo.readyState >= 1) {
      initEngine();
    }

    // ── Safeguard 2 & 3: Extended Scroll Buffer & Explicit 100% Clamping ──
    const handleScroll = () => {
      const visionSection = document.getElementById('vision-values');
      const scrollY = window.scrollY;

      let videoCompletionDistance: number;
      if (visionSection) {
        const visionRect = visionSection.getBoundingClientRect();
        const visionTop = visionRect.top + scrollY;
        // The video finishes 100% of its frames with an extra 15% scroll buffer so the user sees the completed final frame held before unpinning
        videoCompletionDistance = Math.max(visionTop - window.innerHeight * 0.45, 380);
      } else {
        videoCompletionDistance = Math.max(hero.offsetHeight - window.innerHeight * 0.45, 380);
      }

      const normalizedProgress = Math.min(Math.max(scrollY / videoCompletionDistance, 0), 1.0);

      // Explicit End-State Clamping: Snap directly to the final frame index when 100% progress or boundary is reached
      if (normalizedProgress >= 0.995) {
        targetFrame = TOTAL_FRAMES - 1;
      } else {
        targetFrame = normalizedProgress * (TOTAL_FRAMES - 1);
      }
    };

    // 60-120 FPS High-Precision Fluid Interpolation Loop
    const renderLoop = () => {
      // Smooth floating-point spring interpolation prevents jumping over chunks of frames
      currentFrame = lerp(currentFrame, targetFrame, 0.20);
      
      // If close to the final frame or target is at maximum, snap precisely to the final keyframe
      if (targetFrame === TOTAL_FRAMES - 1 && currentFrame >= TOTAL_FRAMES - 1.2) {
        currentFrame = TOTAL_FRAMES - 1;
      }

      const frameIndex = Math.min(Math.max(Math.round(currentFrame), 0), TOTAL_FRAMES - 1);

      // Find exact or closest available frame bitmap
      let bitmap = frameBitmaps[frameIndex];
      if (!bitmap) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          if (frameIndex - offset >= 0 && frameBitmaps[frameIndex - offset]) {
            bitmap = frameBitmaps[frameIndex - offset];
            break;
          }
          if (frameIndex + offset < TOTAL_FRAMES && frameBitmaps[frameIndex + offset]) {
            bitmap = frameBitmaps[frameIndex + offset];
            break;
          }
        }
      }

      if (bitmap) {
        drawFrameCover(bitmap);
      } else if (offscreenVideo.readyState >= 2) {
        drawFrameCover(offscreenVideo);
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('load', handleResize);

    // Re-run layout calculations after web fonts load to prevent layout shift shortening
    if (document.fonts?.ready) {
      document.fonts.ready.then(handleResize).catch(() => {});
    }

    handleResize();
    rafId = requestAnimationFrame(renderLoop);

    return () => {
      isExtracting = false;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
      cancelAnimationFrame(rafId);
      offscreenVideo.removeAttribute('src');
      offscreenVideo.load();
      // Free bitmap GPU textures on unmount
      frameBitmaps.forEach((bmp) => bmp?.close());
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-visible"
    >
      {/* ── Sticky Background Viewport: Locked in Viewport Center until Vision & Values ── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden pointer-events-none z-0">
        <div className="relative w-full h-full bg-chalk-50 dark:bg-obsidian-950 flex items-center justify-center">
          {/* Hardware-Accelerated 60FPS Canvas Frame Player */}
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-cover filter grayscale-[100%] contrast-[1.10] brightness-[0.55] dark:brightness-[0.30] transition-opacity duration-700 ${isEngineReady ? 'opacity-40 dark:opacity-30' : 'opacity-0'
              }`}
          />

          {/* Neutral Site Theme Overlay (Softened for Enhanced Video Detail Visibility) */}
          <div className="absolute inset-0 bg-gradient-to-b from-chalk-50/82 via-chalk-50/65 to-chalk-50 dark:from-obsidian-950/86 dark:via-obsidian-950/72 dark:to-obsidian-950" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-chalk-50/25 to-chalk-50/65 dark:via-obsidian-950/30 dark:to-obsidian-950/75" />

          {/* Bottom Edge Dissolve Mask */}
          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent to-chalk-50 dark:to-obsidian-950" />

          {/* Architectural Swiss Grid Texture */}
          <div className="absolute inset-0 swiss-grid-pattern opacity-30 dark:opacity-20" />
        </div>
      </div>

      {/* ── Foreground Interactive Content: Scrolls normally over pinned canvas background ── */}
      <div className="relative z-10 -mt-[100vh] w-full pt-28 sm:pt-32 md:pt-32 pb-24 sm:pb-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          {/* Top Architectural Metadata Strip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-between gap-3 pb-2.5 mb-5 sm:mb-6 font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                Sunday Gatherings
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
              <span className="hidden sm:inline">9:00 AM Life Group &amp; 10:00 AM Worship</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span>Brgy. Inicbulan, Bauan, Batangas</span>
            </div>
          </motion.div>

          {/* Master Typographic Statement */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 font-mono text-xs font-bold uppercase tracking-widest mb-3.5">
              <span>HELLO!, WE ARE</span>
            </div>

            <LineMaskReveal
              as="h1"
              lines={[
                "INICBULAN FUNDAMENTAL BAPTIST",
                "BIBLE CHURCH, INCORPORATED",
              ]}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.92] text-slate-900 dark:text-white uppercase text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)]"
              lineClassName="text-slate-900 dark:text-white"
            />

            <p className="mt-4 font-mono text-sm sm:text-base md:text-lg uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
              THE CHURCH WITH AN OPEN BIBLE
            </p>
          </div>

          {/* Grid Split: Philosophy Statement & Countdown Action Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Statement & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-7"
            >
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
                  Our Purpose
                </span>
                <p className="text-base sm:text-lg lg:text-xl font-normal text-slate-600 dark:text-slate-300 leading-[1.68] tracking-tight max-w-2xl text-pretty">
                  A church that values <strong className="text-slate-900 dark:text-white font-bold">Worship</strong>, grows in <strong className="text-slate-900 dark:text-white font-bold">Fellowship</strong>, engages in <strong className="text-slate-900 dark:text-white font-bold">Evangelism</strong>, equips through <strong className="text-slate-900 dark:text-white font-bold">Discipleship</strong>, trains <strong className="text-slate-900 dark:text-white font-bold">Leaders</strong>, and develops <strong className="text-slate-900 dark:text-white font-bold">Ministries</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <MagneticButton variant="primary" size="lg" onClick={onOpenVisit}>
                  <span>Plan Your Sunday Visit</span>
                  <Calendar className="w-4 h-4 ml-1" />
                </MagneticButton>

                <MagneticButton variant="outline" size="lg" onClick={onScrollToSermons}>
                  <span>Listen to Sermons</span>
                  <Volume2 className="w-4 h-4 ml-1" />
                </MagneticButton>
              </div>

              {/* Core Pillar Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-2">
                <div className="space-y-1">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                    Location
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 block">
                    Inicbulan, Bauan
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                    Foundation
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 block">
                    Open Bible Exposition
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                    Community
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 block">
                    5 Core Groups
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Next Gathering Countdown Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 ambient-card rounded-3xl p-6 sm:p-8 lg:p-9 relative"
            >
              <div className="flex items-center justify-between pb-5 mb-6">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-royal-500 dark:text-cobalt-400 flex items-center justify-center"
                  >
                    <Users className="w-4 h-4" />
                  </motion.div>
                  <span className="font-mono text-xs uppercase font-bold text-slate-800 dark:text-slate-200 tracking-wider">
                    Next Gathering In
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold uppercase bg-royal-50 dark:bg-royal-500/10 text-royal-600 dark:text-cobalt-400 px-3 py-1 rounded-full">
                  JOIN US!
                </span>
              </div>

              {/* Countdown Grid */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center mb-6 sm:mb-7">
                {[
                  { value: timeLeft.days, label: 'Days', accent: false },
                  { value: timeLeft.hours, label: 'Hours', accent: false },
                  { value: timeLeft.minutes, label: 'Mins', accent: false },
                  { value: timeLeft.seconds, label: 'Secs', accent: true },
                ].map(({ value, label, accent }) => (
                  <div key={label} className="bg-slate-50/80 dark:bg-obsidian-850 p-3 sm:p-4 rounded-2xl">
                    <span
                      className={`font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold block ${accent ? 'text-royal-500 dark:text-cobalt-400' : 'text-slate-900 dark:text-white'
                        }`}
                    >
                      {String(value).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 block font-semibold">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sunday Schedule Preview */}
              <div className="bg-slate-50/80 dark:bg-obsidian-850 p-4 sm:p-5 rounded-2xl space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 font-bold text-xs">
                    9:00 AM - Life Group
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">Departamental</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-200/70 dark:bg-obsidian-800 text-slate-600 dark:text-slate-400 font-medium text-xs">
                    10:00 AM - Worship Service
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">Worship Hall</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
