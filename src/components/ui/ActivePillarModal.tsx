import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface PurposePillar {
  title: string;
  description: string;
  image: string;
}

interface ActivePillarModalProps {
  pillar: PurposePillar;
  allPillars: PurposePillar[];
  onClose: () => void;
  onSelect: (pillar: PurposePillar) => void;
}

export const ActivePillarModal: React.FC<ActivePillarModalProps> = ({
  pillar,
  allPillars,
  onClose,
  onSelect,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Physics refs for 3D tilt and floating cursor tracking
  const targetRef = useRef({
    rx: 0, // rotateX (deg)
    ry: 0, // rotateY (deg)
    tx: 0, // translateX (px)
    ty: 0, // translateY (px)
    gx: 50, // glow X (%)
    gy: 50, // glow Y (%)
  });

  const currentRef = useRef({
    rx: 0,
    ry: 0,
    tx: 0,
    ty: 0,
    gx: 50,
    gy: 50,
  });

  const rafIdRef = useRef<number | null>(null);

  // Spring physics loop with inertia decay
  const updatePhysics = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    const t = targetRef.current;
    const c = currentRef.current;

    // Spring damping factor
    const springFactor = 0.085;

    c.rx += (t.rx - c.rx) * springFactor;
    c.ry += (t.ry - c.ry) * springFactor;
    c.tx += (t.tx - c.tx) * springFactor;
    c.ty += (t.ty - c.ty) * springFactor;
    c.gx += (t.gx - c.gx) * springFactor;
    c.gy += (t.gy - c.gy) * springFactor;

    // Apply 3D tilt + floating translation to active card
    card.style.transform = `perspective(1200px) translate3d(${c.tx.toFixed(2)}px, ${c.ty.toFixed(2)}px, 0) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg)`;

    // Apply inverse parallax offset to the image for depth illusion
    if (imageRef.current) {
      const imgTx = (-c.tx * 0.45).toFixed(2);
      const imgTy = (-c.ty * 0.45).toFixed(2);
      imageRef.current.style.transform = `scale(1.08) translate3d(${imgTx}px, ${imgTy}px, 0)`;
    }

    // Dynamic cursor radial glow
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(600px circle at ${c.gx.toFixed(1)}% ${c.gy.toFixed(1)}%, rgba(99,102,241,0.2), rgba(59,130,246,0.06) 40%, transparent 70%)`;
    }

    rafIdRef.current = requestAnimationFrame(updatePhysics);
  }, []);

  // Track cursor movement across the viewport
  const handlePointerMove = useCallback((e: MouseEvent) => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Normalized offset from center (-1 to +1)
    const normX = (e.clientX - w / 2) / (w / 2);
    const normY = (e.clientY - h / 2) / (h / 2);

    // Dynamic 3D tilt values (rotateX inverse to Y, rotateY proportional to X)
    targetRef.current.rx = -normY * 9; // angles up to ±9 deg
    targetRef.current.ry = normX * 11; // angles up to ±11 deg

    // Floating translation offsets - moves in sync with cursor
    targetRef.current.tx = normX * 20; // moves up to ±20 px
    targetRef.current.ty = normY * 16; // moves up to ±16 px

    // Glow position percentage
    targetRef.current.gx = (e.clientX / w) * 100;
    targetRef.current.gy = (e.clientY / h) * 100;
  }, []);

  // Ease back to neutral on pointer leave or window blur
  const handlePointerLeave = useCallback(() => {
    targetRef.current.rx = 0;
    targetRef.current.ry = 0;
    targetRef.current.tx = 0;
    targetRef.current.ty = 0;
    targetRef.current.gx = 50;
    targetRef.current.gy = 50;
  }, []);

  // Keyboard navigation (Escape to close, Left/Right to cycle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        const idx = allPillars.findIndex((p) => p.title === pillar.title);
        const next = allPillars[(idx + 1) % allPillars.length];
        onSelect(next);
      } else if (e.key === 'ArrowLeft') {
        const idx = allPillars.findIndex((p) => p.title === pillar.title);
        const prev = allPillars[(idx - 1 + allPillars.length) % allPillars.length];
        onSelect(prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);

    // Start physics animation loop
    rafIdRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [pillar, allPillars, onClose, onSelect, handlePointerMove, handlePointerLeave, updatePhysics]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      {/* 3D Active Parallax Floating Card */}
      <motion.div
        ref={cardRef}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        style={{ willChange: 'transform' }}
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-white/20 rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_70px_rgba(99,102,241,0.3)] flex flex-col md:flex-row select-text"
      >
        {/* Dynamic Cursor Spotlight Overlay */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(600px circle at 50% 50%, rgba(99,102,241,0.18), transparent 70%)',
          }}
        />

        {/* Image Showcase with Parallax Drift */}
        <div className="relative w-full md:w-3/5 h-60 sm:h-72 md:h-auto min-h-[260px] md:min-h-[460px] overflow-hidden bg-black">
          <img
            ref={imageRef}
            src={pillar.image}
            alt={pillar.title}
            className="w-full h-full object-cover ken-burns-expanded transition-transform duration-100 ease-out"
            style={{ willChange: 'transform' }}
          />

          {/* Dark Tinted Gradient Overlay so typography & badge pop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.3) 100%)',
            }}
          />


          {/* Bottom Title on Mobile preview */}
          <div className="md:hidden absolute bottom-4 left-4 right-4 z-10">
            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {pillar.title}
            </h2>
          </div>
        </div>

        {/* Content Panel: Glassmorphic layout */}
        <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-950/90 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
                Our Purpose
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="hidden md:block text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              {pillar.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal text-pretty">
              {pillar.description}
            </p>

          </div>

          {/* Quick Switcher across all 6 Pillars with Individual Backgrounds */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block">
              All 6 Pillars
            </span>

            <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
              {allPillars.map((p) => {
                const isActive = pillar.title === p.title;
                return (
                  <button
                    key={p.title}
                    onClick={() => onSelect(p)}
                    className={`relative group overflow-hidden py-1.5 px-2 rounded-full flex items-center justify-center text-center font-bold transition-all border cursor-pointer active:scale-95 select-none ${
                      isActive
                        ? 'border-cobalt-400 shadow-[0_0_12px_rgba(99,102,241,0.5)] scale-105 z-10'
                        : 'border-white/15 hover:border-white/35'
                    }`}
                  >
                    {/* Background image */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-115 transition-transform duration-300"
                    />
                    {/* Dark semi-transparent overlay */}
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        backgroundColor: isActive ? 'rgba(79, 70, 229, 0.55)' : 'rgba(0, 0, 0, 0.65)',
                      }}
                    />
                    {/* Text */}
                    <span className="relative z-10 text-white font-bold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] truncate px-1">
                      {p.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
