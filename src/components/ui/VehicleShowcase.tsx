import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Sparkles, MoveHorizontal, Video, Play, Pause } from 'lucide-react';

interface VehicleShowcaseProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export const VehicleShowcase: React.FC<VehicleShowcaseProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);

  // DOM Refs for direct 60fps hardware-accelerated transforms
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vehicleRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const underglowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video Scrubbing Synchronous State (Eliminates dropped frames on rewind)
  const scrubTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const lastSeekTickRef = useRef(0);

  // Physics & Steering Motion State (Ref-based for silky 60FPS)
  const posRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    vx: 0,
    vy: 0,
    tilt: 0,
    speed: 0,
  });

  const pointerRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    prevX: 0,
    prevY: 0,
    lastTime: 0,
  });

  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // ── Spawn Dust & Light Trail Particles behind the Rear Wheels ──
  const spawnParticles = useCallback((x: number, y: number, vx: number, vy: number) => {
    const speed = Math.hypot(vx, vy);
    if (speed < 0.4) return;

    const count = Math.min(3, Math.floor(speed * 0.8));
    for (let i = 0; i < count; i++) {
      const isDust = Math.random() > 0.4;
      particlesRef.current.push({
        x: x - 120 + (Math.random() - 0.5) * 20, // Emit behind the van
        y: y + 35 + (Math.random() - 0.5) * 12,  // Near ground level
        vx: -vx * 0.35 + (Math.random() - 0.5) * 1.5,
        vy: -0.2 - Math.random() * 0.8,
        size: isDust ? 2 + Math.random() * 4 : 1.5 + Math.random() * 2,
        alpha: isDust ? 0.45 : 0.85,
        color: isDust ? 'rgba(255, 255, 255, 0.4)' : 'rgba(96, 165, 250, 0.9)',
        life: 0,
        maxLife: 25 + Math.random() * 20,
      });
    }
  }, []);

  // ── Main 60FPS Physics & Video Motion Scrubbing Loop ──
  const updatePhysics = useCallback(() => {
    const pos = posRef.current;
    const isDragging = pointerRef.current.isDown;

    if (!isDragging) {
      // Natural spring return towards center with smooth damping
      const ax = (pos.targetX - pos.x) * 0.05;
      const ay = (pos.targetY - pos.y) * 0.05;
      pos.vx = (pos.vx + ax) * 0.86;
      pos.vy = (pos.vy + ay) * 0.86;
      pos.x += pos.vx;
      pos.y += pos.vy;
    }

    // Dynamic steering tilt based on horizontal velocity
    const targetTilt = Math.max(-8, Math.min(8, pos.vx * 0.75));
    pos.tilt += (targetTilt - pos.tilt) * 0.12;

    const currentSpeed = Math.hypot(pos.vx, pos.vy);
    pos.speed = currentSpeed;

    // ── Directional Video Scrubbing: Smooth Forward & Stutter-Free Rewind ──
    if (videoRef.current) {
      const vid = videoRef.current;
      const duration = vid.duration || 10;
      const endThreshold = Math.max(0.1, duration - 0.06);

      if (pos.vx > 0.12) {
        // Moving RIGHT: Advance forward
        if (vid.currentTime >= endThreshold) {
          if (!vid.paused) vid.pause();
          vid.currentTime = endThreshold;
          scrubTimeRef.current = endThreshold;
        } else {
          if (vid.paused) {
            vid.play().catch(() => {});
          }
          const rate = Math.min(3.8, Math.max(1.1, pos.vx / 2.2));
          if (Math.abs(vid.playbackRate - rate) > 0.1) {
            vid.playbackRate = rate;
          }
          scrubTimeRef.current = vid.currentTime;
        }
      } else if (pos.vx < -0.12) {
        // Moving LEFT: Smooth backward rewind (Zero dropped frames or decoder freezes)
        if (!vid.paused) {
          vid.pause();
        }
        // Accumulate rewind delta continuously
        const dt = pos.vx * 0.016; // pos.vx is negative
        scrubTimeRef.current = Math.max(0, scrubTimeRef.current + dt);

        const now = performance.now();
        // Dispatch seek at smooth 30fps intervals (~32ms) to prevent decoder saturation
        if (now - lastSeekTickRef.current > 32 && !isSeekingRef.current) {
          isSeekingRef.current = true;
          lastSeekTickRef.current = now;
          vid.currentTime = scrubTimeRef.current;
        }
      } else {
        // Stationary: Freeze on current frame and flush final target frame
        if (!vid.paused) {
          vid.pause();
        }
        if (!isSeekingRef.current && Math.abs(vid.currentTime - scrubTimeRef.current) > 0.03) {
          isSeekingRef.current = true;
          vid.currentTime = scrubTimeRef.current;
        }
      }
    }

    // Direct inline DOM transform updates for 60fps performance
    if (vehicleRef.current) {
      vehicleRef.current.style.transform = `translate(-50%, -50%) translate3d(${pos.x}px, ${pos.y}px, 0px) rotate(${pos.tilt}deg)`;
    }

    if (underglowRef.current) {
      const glowScale = 1 + Math.min(0.35, currentSpeed * 0.03);
      const glowOpacity = 0.55 + Math.min(0.45, currentSpeed * 0.05);
      underglowRef.current.style.transform = `translateX(-50%) scale(${glowScale})`;
      underglowRef.current.style.opacity = `${glowOpacity}`;
    }

    // Subtle opposite parallax drift on background video container
    if (parallaxBgRef.current) {
      const bgX = -pos.x * 0.08;
      const bgY = -pos.y * 0.04;
      parallaxBgRef.current.style.transform = `translate3d(${bgX}px, ${bgY}px, 0px)`;
    }

    // Render particle dust & light trails
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2 + pos.x;
        const centerY = canvas.height / 2 + pos.y;

        spawnParticles(centerX, centerY, pos.vx, pos.vy);

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life++;

          const progress = p.life / p.maxLife;
          const currentAlpha = p.alpha * (1 - progress);

          if (progress >= 1) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.3), 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${currentAlpha})`);
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(updatePhysics);
  }, [spawnParticles]);

  // Start physics loop when modal opens
  useEffect(() => {
    if (isExpanded) {
      // Reset position to center
      posRef.current = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        tilt: 0,
        speed: 0,
      };
      particlesRef.current = [];
      animFrameIdRef.current = requestAnimationFrame(updatePhysics);

      // Ensure video is initially paused on frame
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isExpanded, updatePhysics]);

  // ── Drag & Touch Event Handlers ──
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      prevX: e.clientX,
      prevY: e.clientY,
      lastTime: performance.now(),
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!pointerRef.current.isDown) return;
      const now = performance.now();
      const dt = Math.max(1, now - pointerRef.current.lastTime);

      const dx = e.clientX - pointerRef.current.prevX;
      const dy = e.clientY - pointerRef.current.prevY;

      // Bound steering range so car stays inside viewport bounds
      const nextX = Math.max(-280, Math.min(280, posRef.current.x + dx * 1.2));
      const nextY = Math.max(-80, Math.min(80, posRef.current.y + dy * 0.9));

      posRef.current.vx = (dx / dt) * 16;
      posRef.current.vy = (dy / dt) * 16;
      posRef.current.x = nextX;
      posRef.current.y = nextY;

      pointerRef.current.prevX = e.clientX;
      pointerRef.current.prevY = e.clientY;
      pointerRef.current.lastTime = now;
    };

    const handleGlobalPointerUp = () => {
      pointerRef.current.isDown = false;
      // Target springs back to center smoothly
      posRef.current.targetX = 0;
      posRef.current.targetY = 0;
      if (videoRef.current && Math.abs(videoRef.current.currentTime - scrubTimeRef.current) > 0.03) {
        videoRef.current.currentTime = scrubTimeRef.current;
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* ── 1. Collapsed Banner (Full-Width under Vision & Purpose) ── */}
      <motion.div
        whileHover={{ y: -2 }}
        onClick={() => setIsExpanded(true)}
        className="group relative w-full rounded-3xl ambient-card overflow-hidden cursor-pointer border border-slate-200/80 dark:border-white/10 transition-all duration-300 shadow-md hover:shadow-2xl select-none"
      >
        <div className="relative h-44 sm:h-52 md:h-64 w-full overflow-hidden bg-slate-950">
          {/* Background church scenery with dark ambient vignette */}
          <img
            src="/hero-poster.webp"
            alt="Inicbulan FBBC Church Scenery"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-45"
          />

          {/* Vignette & Ambient Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/45 z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-[1]" />

          {/* Authentic Inicbulan FBBC Mitsubishi L300 Van Cutout on the Right */}
          <div className="absolute right-3 sm:right-8 md:right-12 bottom-2 sm:bottom-4 z-[2] w-[220px] sm:w-[320px] md:w-[380px] pointer-events-none transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1">
            {/* Ambient Underglow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-royal-500/50 dark:bg-cobalt-400/60 rounded-full blur-xl pointer-events-none group-hover:opacity-100 opacity-70 transition-opacity" />
            <img
              src="/ifbbc-l300-van.png"
              alt="Inicbulan FBBC Mitsubishi L300 Church Van"
              className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] filter brightness-[1.02]"
            />
          </div>

          {/* Banner Content Layout */}
          <div className="absolute inset-0 z-[3] p-5 sm:p-7 md:p-8 flex flex-col justify-between pointer-events-none">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-cobalt-400" />
                <span>Mitsubishi L300 • Interactive Ministry Van</span>
              </div>

              {/* Expand Action Button */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-royal-500 hover:bg-royal-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg group-hover:scale-105 transition-transform pointer-events-auto">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Steer Van</span>
              </div>
            </div>

            {/* Bottom Statement */}
            <div className="max-w-xs sm:max-w-md md:max-w-lg">
              <h4 className="text-lg sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-snug drop-shadow-md">
                Community Expedition & Outreach
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-1 text-pretty leading-relaxed drop-shadow-sm">
                The official Mitsubishi L300 ministry van reaching every barangay across Bauan and Batangas. Click to steer the van across the church grounds.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Interactive Wide-Screen Viewport (Steerable L300 + Motion-Linked Church Video) ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 overflow-hidden select-none"
          >
            {/* Viewport Container (Sleek height, fits all screen sizes with top-right X button) */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl h-[55vh] max-h-[430px] min-h-[290px] bg-slate-950 border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_70px_rgba(41,121,255,0.3)] flex flex-col select-none touch-none"
            >
              {/* Circular X Button on Right Top */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-rose-600 text-white flex items-center justify-center backdrop-blur-md border border-white/25 shadow-2xl transition-all active:scale-90 cursor-pointer"
                aria-label="Close interactive viewport"
                title="Close (Esc)"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* ── Interactive Stage Area (Touch, Drag & Steer) ── */}
              <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-black select-none"
              >
                {/* ── Background Church Video (Advances ONLY when car is moving) ── */}
                <div
                  ref={parallaxBgRef}
                  className="absolute inset-0 w-[115%] -left-[7.5%] h-full pointer-events-none"
                  style={{ willChange: 'transform' }}
                >
                  {/* Seamless Base Poster to guarantee zero black frame on entry */}
                  <img
                    src="/hero-poster.webp"
                    alt="Inicbulan FBBC Grounds"
                    className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.05]"
                  />

                  {/* Motion-Linked Church Video (Clamps at end without restarting) */}
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    preload="auto"
                    poster="/hero-poster.webp"
                    onCanPlay={() => setIsVideoActive(true)}
                    onSeeked={() => {
                      isSeekingRef.current = false;
                    }}
                    onEnded={() => {
                      if (videoRef.current) {
                        videoRef.current.pause();
                        videoRef.current.currentTime = Math.max(0, (videoRef.current.duration || 1) - 0.05);
                      }
                    }}
                    className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.05]"
                  >
                    <source src="/Background Church.webm" type="video/webm" />
                    <source src="/Background Church.mp4" type="video/mp4" />
                  </video>

                  {/* Atmospheric Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
                </div>

                {/* Dynamic Particle Dust & Light Trails Canvas */}
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={700}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />

                {/* ── Interactive Vehicle Layer (Steered & Panned in 60fps) ── */}
                <div
                  ref={vehicleRef}
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: '50%',
                    top: '54%',
                    transform: 'translate(-50%, -50%) translate3d(0px, 0px, 0px)',
                    willChange: 'transform',
                  }}
                >
                  {/* High-Intensity Ambient Neon Underglow Beneath L300 Chassis */}
                  <div
                    ref={underglowRef}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[300px] sm:w-[420px] md:w-[480px] h-10 sm:h-14 rounded-full blur-xl pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(41, 121, 255, 0.9) 0%, rgba(99, 102, 241, 0.55) 45%, transparent 75%)',
                      transition: 'opacity 0.2s ease-out',
                    }}
                  />

                  {/* Authentic Inicbulan FBBC Mitsubishi L300 Van Body Container */}
                  <div className="relative w-[300px] sm:w-[440px] md:w-[510px] aspect-[533/255] filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]">
                    <img
                      src="/ifbbc-l300-van.png"
                      alt="Inicbulan FBBC Mitsubishi L300 Church Van"
                      className="w-full h-full object-contain pointer-events-none select-none"
                    />

                    {/* Volumetric Headlamp Beam projecting from front right headlights */}
                    <div
                      className="absolute -right-20 sm:-right-32 top-[58%] -translate-y-1/2 w-36 sm:w-56 md:w-72 h-24 sm:h-32 pointer-events-none opacity-50"
                      style={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.75) 0%, rgba(190,220,255,0.25) 45%, transparent 100%)',
                        clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
                      }}
                    />
                  </div>
                </div>

                {/* Control Guidance Overlay Banner */}
                <div className="absolute bottom-3 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white font-mono text-[11px] shadow-xl">
                    <MoveHorizontal className="w-3.5 h-3.5 text-cobalt-400 animate-pulse" />
                    <span>Steer right to drive forward • Steer left to rewind frames</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
