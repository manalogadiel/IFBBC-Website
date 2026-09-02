import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Sparkles, MoveHorizontal } from 'lucide-react';

interface VehicleShowcaseProps {
  onSelectPillar?: (title: string) => void;
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

export const VehicleShowcase: React.FC<VehicleShowcaseProps> = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // DOM Refs for direct 60fps hardware-accelerated transforms
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vehicleRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const underglowRef = useRef<HTMLDivElement>(null);

  // Physics state (pixels from center)
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const animFrameId = useRef<number>(0);
  const roadOffsetRef = useRef(0);

  // Particle system
  const particlesRef = useRef<Particle[]>([]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Main 60fps physics & particle rendering animation loop
  const updatePhysics = useCallback(() => {
    const friction = 0.92;
    const springStiffness = 0.06;
    const maxBoundsX = 320; // Max horizontal travel from center
    const maxBoundsY = 90;  // Max vertical lane change travel

    if (!isDraggingRef.current) {
      // Apply momentum damping to velocity
      velRef.current.vx *= friction;
      velRef.current.vy *= friction;

      // Soft spring boundary bounce-back if past limits
      if (posRef.current.x > maxBoundsX) {
        posRef.current.x -= (posRef.current.x - maxBoundsX) * springStiffness;
        velRef.current.vx *= 0.65;
      } else if (posRef.current.x < -maxBoundsX) {
        posRef.current.x -= (posRef.current.x + maxBoundsX) * springStiffness;
        velRef.current.vx *= 0.65;
      }

      if (posRef.current.y > maxBoundsY) {
        posRef.current.y -= (posRef.current.y - maxBoundsY) * springStiffness;
        velRef.current.vy *= 0.65;
      } else if (posRef.current.y < -maxBoundsY) {
        posRef.current.y -= (posRef.current.y + maxBoundsY) * springStiffness;
        velRef.current.vy *= 0.65;
      }

      posRef.current.x += velRef.current.vx;
      posRef.current.y += velRef.current.vy;
    }

    // Dynamic steering tilt based on vertical movement & velocity
    const targetAngle = Math.max(-14, Math.min(14, velRef.current.vy * 1.6 + velRef.current.vx * 0.25));

    // Update vehicle DOM element directly every frame for 60fps responsiveness
    if (vehicleRef.current) {
      vehicleRef.current.style.transform = `translate(-50%, -50%) translate3d(${posRef.current.x.toFixed(2)}px, ${posRef.current.y.toFixed(2)}px, 0) rotate(${targetAngle.toFixed(2)}deg)`;
    }

    // Update parallax highway backdrop
    if (parallaxBgRef.current) {
      parallaxBgRef.current.style.transform = `translateX(${(-posRef.current.x * 0.22).toFixed(2)}px)`;
    }

    // Update underglow brightness based on velocity
    if (underglowRef.current) {
      const speedMagnitude = Math.sqrt(velRef.current.vx * velRef.current.vx + velRef.current.vy * velRef.current.vy);
      underglowRef.current.style.opacity = Math.min(1, 0.75 + speedMagnitude * 0.04).toFixed(2);
    }

    // Road scroll speed based on forward surge
    const forwardSpeed = 5.0 + Math.max(-2, velRef.current.vx * 0.15);
    roadOffsetRef.current = (roadOffsetRef.current + forwardSpeed) % 2000;

    // ── Render Particles on Canvas ──
    const canvas = canvasRef.current;
    if (canvas && isExpanded) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const vCenterX = canvas.width * 0.5 + posRef.current.x;
        const vCenterY = canvas.height * 0.54 + posRef.current.y;

        // Spawn dust and neon trail particles behind Mitsubishi L300 rear tires
        if (Math.random() < 0.8) {
          const spawnX = vCenterX - 130;
          const spawnY = vCenterY + 65 + (Math.random() * 10 - 5);

          // Neon blue road streak
          particlesRef.current.push({
            x: spawnX,
            y: spawnY,
            vx: -(forwardSpeed * 1.6 + Math.random() * 2),
            vy: (Math.random() - 0.5) * 1.2,
            size: 2.5 + Math.random() * 3,
            alpha: 0.85,
            color: Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, ',
            life: 0,
            maxLife: 35 + Math.random() * 25,
          });

          // Atmospheric road dust
          particlesRef.current.push({
            x: spawnX - 15,
            y: spawnY - Math.random() * 12,
            vx: -(forwardSpeed * 1.8 + Math.random() * 3),
            vy: -0.4 - Math.random() * 0.8,
            size: 4 + Math.random() * 8,
            alpha: 0.35,
            color: 'rgba(148, 163, 184, ',
            life: 0,
            maxLife: 40 + Math.random() * 30,
          });
        }

        // Underbody neon glow particles along asphalt
        if (Math.random() < 0.45) {
          particlesRef.current.push({
            x: vCenterX + (Math.random() * 160 - 80),
            y: vCenterY + 75,
            vx: -(forwardSpeed * 2.0),
            vy: 0,
            size: 14 + Math.random() * 18,
            alpha: 0.28,
            color: 'rgba(37, 99, 235, ',
            life: 0,
            maxLife: 22,
          });
        }

        // Update and draw active particles
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
          ctx.arc(p.x, p.y, p.size * (1 + progress * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentAlpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color + '0.6)';
          ctx.fill();
          ctx.restore();
        }
      }
    }

    animFrameId.current = requestAnimationFrame(updatePhysics);
  }, [isExpanded]);

  // Start physics animation loop
  useEffect(() => {
    animFrameId.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animFrameId.current);
  }, [updatePhysics]);

  // Window-level mouse/touch drag handlers so fast swipes never detach
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    lastPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    velRef.current = { vx: 0, vy: 0 };
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastPointerRef.current.time);
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;

      // Real-time steering & panning sensitivity
      posRef.current.x += dx * 1.15;
      posRef.current.y += dy * 0.95;

      // Instantaneous release velocity for natural momentum coasting
      velRef.current.vx = (dx / dt) * 16;
      velRef.current.vy = (dy / dt) * 16;

      lastPointerRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: now,
      };
    };

    const handleGlobalPointerUp = () => {
      isDraggingRef.current = false;
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
    <div className="w-full">
      {/* ── 1. Collapsed Banner (Full-Width under Vision & Purpose) ── */}
      <motion.div
        whileHover={{ y: -2 }}
        onClick={() => setIsExpanded(true)}
        className="group relative w-full rounded-3xl ambient-card overflow-hidden cursor-pointer border border-slate-200/80 dark:border-white/10 transition-all duration-300 shadow-md hover:shadow-2xl"
      >
        {/* Background panoramic preview with scenic road and official church van */}
        <div className="relative h-44 sm:h-52 md:h-64 w-full overflow-hidden bg-slate-950">
          {/* Parallax Road Background */}
          <img
            src="/mitsubishi-l300-mission.jpg"
            alt="Mission Road"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-50"
          />

          {/* Vignette & Ambient Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/40 z-[1]" />
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
                <span>Mitsubishi L300 • Ministry Fleet</span>
              </div>

              {/* Expand Action Button */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-royal-500 hover:bg-royal-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg group-hover:scale-105 transition-transform pointer-events-auto">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Launch Viewport</span>
              </div>
            </div>

            {/* Bottom Statement */}
            <div className="max-w-xs sm:max-w-md md:max-w-lg">
              <h4 className="text-lg sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-snug drop-shadow-md">
                Community Expedition & Outreach
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-1 text-pretty leading-relaxed drop-shadow-sm">
                The official Mitsubishi L300 ministry van reaching every barangay across Bauan and Batangas. Click to enter the interactive viewport and steer the van.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Interactive Wide-Screen Viewport (Expanded Modal) ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 overflow-hidden"
          >
            {/* Viewport Container (Sleek reduced height, fits all screens) */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl h-[55vh] max-h-[420px] min-h-[280px] bg-slate-950 border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_70px_rgba(41,121,255,0.3)] flex flex-col select-none touch-none"
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
                {/* Parallax Highway & Church Plaza Backdrop */}
                <div
                  ref={parallaxBgRef}
                  className="absolute inset-0 w-[125%] -left-[12.5%] h-full pointer-events-none"
                  style={{ willChange: 'transform' }}
                >
                  <img
                    src="/mitsubishi-l300-mission.jpg"
                    alt="Panoramic Mission Route"
                    className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[0.5px]" />
                </div>

                {/* Dynamic Particle Dust & Light Trails Canvas */}
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={700}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />

                {/* Interactive Vehicle Layer (Steered & Panned in 60fps) */}
                <div
                  ref={vehicleRef}
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: '50%',
                    top: '52%',
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

                    {/* Volumetric Headlamp Beam projecting from the front right headlights */}
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
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-white font-mono text-[11px] shadow-xl">
                    <MoveHorizontal className="w-3.5 h-3.5 text-cobalt-400 animate-pulse" />
                    <span>Drag or swipe anywhere to steer the Mitsubishi L300</span>
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
