import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Zap, Gauge, Sparkles, Navigation, MoveHorizontal } from 'lucide-react';

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
  const [speedDisplay, setSpeedDisplay] = useState(38);
  const [steeringAngle, setSteeringAngle] = useState(0);

  // Physics state for the vehicle
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Position, velocity, target
  const posRef = useRef({ x: 0, y: 0 }); // relative offset from center in px
  const velRef = useRef({ vx: 0, vy: 0 });
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const animFrameId = useRef<number>(0);
  const roadOffsetRef = useRef(0);
  
  // Particle system
  const particlesRef = useRef<Particle[]>([]);

  // Telemetry throttling
  const lastTelemetryUpdate = useRef(0);

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

  // Main physics & particle rendering animation loop
  const updatePhysics = useCallback(() => {
    // Friction & damping factors
    const friction = 0.92;
    const springStiffness = 0.05;
    const maxBoundsX = 260; // Max horizontal travel from center
    const maxBoundsY = 60;  // Max vertical lane change travel

    if (!isDraggingRef.current) {
      // Apply damping to velocity
      velRef.current.vx *= friction;
      velRef.current.vy *= friction;

      // Soft spring boundary bounce-back if past limits
      if (posRef.current.x > maxBoundsX) {
        posRef.current.x -= (posRef.current.x - maxBoundsX) * springStiffness;
        velRef.current.vx *= 0.7;
      } else if (posRef.current.x < -maxBoundsX) {
        posRef.current.x -= (posRef.current.x + maxBoundsX) * springStiffness;
        velRef.current.vx *= 0.7;
      }

      if (posRef.current.y > maxBoundsY) {
        posRef.current.y -= (posRef.current.y - maxBoundsY) * springStiffness;
        velRef.current.vy *= 0.7;
      } else if (posRef.current.y < -maxBoundsY) {
        posRef.current.y -= (posRef.current.y + maxBoundsY) * springStiffness;
        velRef.current.vy *= 0.7;
      }

      posRef.current.x += velRef.current.vx;
      posRef.current.y += velRef.current.vy;
    }

    // Road scroll speed based on vehicle forward surge
    const forwardSpeed = 4.5 + Math.max(-2, velRef.current.vx * 0.15);
    roadOffsetRef.current = (roadOffsetRef.current + forwardSpeed) % 2000;

    // Calculate steering angle based on vertical movement & velocity
    const targetAngle = Math.max(-12, Math.min(12, velRef.current.vy * 1.8 + velRef.current.vx * 0.3));
    
    // Update live telemetry display periodically to save render cost
    const now = performance.now();
    if (now - lastTelemetryUpdate.current > 120) {
      lastTelemetryUpdate.current = now;
      const calculatedSpeed = Math.round(35 + forwardSpeed * 4.2);
      setSpeedDisplay(calculatedSpeed);
      setSteeringAngle(Math.round(targetAngle));
    }

    // --- RENDER PARTICLES ON CANVAS ---
    const canvas = canvasRef.current;
    if (canvas && isExpanded) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn new dust and light-trail particles behind the vehicle
        // Vehicle center is roughly at canvas.width/2 + posRef.current.x, canvas.height/2 + posRef.current.y
        const vCenterX = canvas.width * 0.48 + posRef.current.x;
        const vCenterY = canvas.height * 0.52 + posRef.current.y;
        
        // Spawn particles from rear tire contacts
        if (Math.random() < 0.75) {
          const spawnX = vCenterX - 140; // Behind rear wheel
          const spawnY = vCenterY + 55 + (Math.random() * 8 - 4);
          
          // Light trail particle
          particlesRef.current.push({
            x: spawnX,
            y: spawnY,
            vx: -(forwardSpeed * 1.5 + Math.random() * 2),
            vy: (Math.random() - 0.5) * 1.2,
            size: 2 + Math.random() * 3,
            alpha: 0.8,
            color: Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, ',
            life: 0,
            maxLife: 35 + Math.random() * 25,
          });

          // Atmospheric road dust
          particlesRef.current.push({
            x: spawnX - 20,
            y: spawnY - Math.random() * 15,
            vx: -(forwardSpeed * 1.8 + Math.random() * 3),
            vy: -0.4 - Math.random() * 0.8,
            size: 4 + Math.random() * 8,
            alpha: 0.35,
            color: 'rgba(148, 163, 184, ',
            life: 0,
            maxLife: 40 + Math.random() * 30,
          });
        }

        // Underglow light streaks along the asphalt
        if (Math.random() < 0.4) {
          particlesRef.current.push({
            x: vCenterX + (Math.random() * 160 - 80),
            y: vCenterY + 68,
            vx: -(forwardSpeed * 2.2),
            vy: 0,
            size: 14 + Math.random() * 16,
            alpha: 0.25,
            color: 'rgba(37, 99, 235, ',
            life: 0,
            maxLife: 20,
          });
        }

        // Update and draw existing particles
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

  // Start animation loop
  useEffect(() => {
    animFrameId.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animFrameId.current);
  }, [updatePhysics]);

  // Pointer drag/touch handling for vehicle steering
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    lastPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    velRef.current = { vx: 0, vy: 0 };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    // Apply movement with natural steering sensitivity
    posRef.current.x += dx * 1.1;
    posRef.current.y += dy * 0.9;

    // Track instantaneous release velocity for damping
    velRef.current.vx = (dx / dt) * 16;
    velRef.current.vy = (dy / dt) * 16;

    lastPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: now,
    };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Handled if capture was already released
    }
  };

  return (
    <div className="w-full">
      {/* ── 1. Collapsed Banner (Full-Width directly underneath Vision & Purpose) ── */}
      <motion.div
        whileHover={{ y: -2 }}
        onClick={() => setIsExpanded(true)}
        className="group relative w-full rounded-3xl ambient-card overflow-hidden cursor-pointer border border-slate-200/80 dark:border-white/10 transition-all duration-300 shadow-md hover:shadow-2xl"
      >
        {/* Background panoramic image preview */}
        <div className="relative h-44 sm:h-52 md:h-60 w-full overflow-hidden bg-slate-950">
          <img
            src="/mission-vehicle.jpg"
            alt="Community Expedition Mission Vehicle"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-85"
          />

          {/* Vignette & Ambient Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent z-[1]" />

          {/* Ambient Blue Neon Underglow Effect in banner */}
          <div className="absolute bottom-4 left-1/4 w-96 h-12 bg-royal-500/25 dark:bg-cobalt-400/30 rounded-full blur-2xl pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" />

          {/* Banner Content Layout */}
          <div className="absolute inset-0 z-[2] p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cobalt-400" />
                <span>Mission In Motion Fleet</span>
              </div>

              {/* Expand Action Button */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-royal-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg group-hover:scale-105 transition-transform">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Launch Viewport</span>
              </div>
            </div>

            {/* Bottom Statement */}
            <div className="max-w-xl">
              <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-snug drop-shadow-md">
                Community Expedition & Outreach
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-1 text-pretty leading-relaxed">
                Reaching every barangay across Bauan and beyond. Click to enter the interactive wide-screen viewport and steer the journey.
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85"
          >
            {/* Viewport Card with Depth Blur & Shadow */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="relative w-full max-w-6xl aspect-[16/10] sm:aspect-[16/9] max-h-[92vh] bg-slate-950 border border-white/20 rounded-3xl overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.9),0_0_80px_rgba(41,121,255,0.25)] flex flex-col select-none touch-none"
            >
              {/* HUD Header Bar */}
              <div className="relative z-30 px-5 sm:px-8 py-3.5 sm:py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                    IFBBC Mission Telemetry // Active Fleet
                  </span>
                </div>

                {/* Center HUD Stats */}
                <div className="hidden md:flex items-center gap-6 font-mono text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-cobalt-400" />
                    <span>Speed: <strong className="text-white font-mono">{speedDisplay} MPH</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-royal-400" />
                    <span>Steering: <strong className="text-white font-mono">{steeringAngle > 0 ? `+${steeringAngle}` : steeringAngle}°</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Drive: <strong className="text-emerald-400 font-mono">MISSION AWD</strong></span>
                  </div>
                </div>

                {/* Close Viewport Button */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline font-mono text-[10px] text-slate-400 uppercase tracking-widest mr-2">
                    Esc to exit
                  </span>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-90"
                    aria-label="Exit interactive viewport"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Interactive Stage Area ── */}
              <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-black"
              >
                {/* Parallax Background Highway & Cityscape */}
                <div
                  className="absolute inset-0 w-[120%] -left-[10%] h-full pointer-events-none"
                  style={{
                    transform: `translateX(${-posRef.current.x * 0.2}px)`,
                    transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease-out',
                  }}
                >
                  <img
                    src="/mission-vehicle.jpg"
                    alt="Panoramic Mission Route"
                    className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
                </div>

                {/* Dynamic Particle Dust & Light Trails Canvas */}
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={700}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />

                {/* Interactive Vehicle Layer (Steered & Panned by User) */}
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: '50%',
                    top: '52%',
                    transform: `translate(-50%, -50%) translate(${posRef.current.x}px, ${posRef.current.y}px) rotate(${steeringAngle * 0.4}deg)`,
                    transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
                  }}
                >
                  {/* High-Intensity Ambient Neon Underglow Beneath Car */}
                  <div
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[340px] sm:w-[460px] h-16 sm:h-20 rounded-full blur-2xl pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(41, 121, 255, 0.75) 0%, rgba(99, 102, 241, 0.45) 45%, transparent 75%)',
                      opacity: 0.85 + Math.abs(velRef.current.vx) * 0.05,
                    }}
                  />

                  {/* Vehicle Body Container with Floating Motion */}
                  <div className="relative w-[340px] sm:w-[480px] md:w-[560px] aspect-[16/9] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]">
                    <img
                      src="/mission-vehicle.jpg"
                      alt="Steerable Mission Van"
                      className="w-full h-full object-contain rounded-2xl"
                    />

                    {/* Dynamic Headlight Volumetric Beam */}
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/3 w-64 h-32 pointer-events-none opacity-45"
                      style={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(200,230,255,0.1) 60%, transparent 100%)',
                        clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
                      }}
                    />
                  </div>
                </div>

                {/* Control Guidance Overlay Banner */}
                <div className="absolute bottom-5 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 text-white font-mono text-xs shadow-2xl">
                    <MoveHorizontal className="w-4 h-4 text-cobalt-400 animate-pulse" />
                    <span>Drag, swipe or touch anywhere to steer and pan the vehicle across the lane</span>
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
