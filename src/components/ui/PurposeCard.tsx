import React, { useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PurposeCardProps {
  index: number;
  title: string;
  image: string;
  description: string;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const PurposeCard: React.FC<PurposeCardProps> = ({ index, title, image, description }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Smooth tilt state
  const tiltTarget = useRef({ x: 0, y: 0 });
  const tiltCurrent = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 50, y: 50 });
  const rafId = useRef<number>(0);
  const isHovered = useRef(false);

  const tick = useCallback(() => {
    const factor = 0.08;
    tiltCurrent.current.x = lerp(tiltCurrent.current.x, tiltTarget.current.x, factor);
    tiltCurrent.current.y = lerp(tiltCurrent.current.y, tiltTarget.current.y, factor);

    const card = cardRef.current;
    if (card) {
      card.style.transform = `perspective(800px) rotateX(${tiltCurrent.current.y}deg) rotateY(${tiltCurrent.current.x}deg) scale3d(${isHovered.current ? 1.03 : 1}, ${isHovered.current ? 1.03 : 1}, 1)`;
    }

    const glow = glowRef.current;
    if (glow) {
      glow.style.background = `radial-gradient(300px circle at ${glowPos.current.x}% ${glowPos.current.y}%, rgba(99,102,241,0.20), rgba(99,102,241,0.05) 50%, transparent 80%)`;
    }

    const border = borderRef.current;
    if (border) {
      border.style.background = `radial-gradient(200px circle at ${glowPos.current.x}% ${glowPos.current.y}%, rgba(99,102,241,0.45), transparent 80%)`;
      border.style.webkitMaskImage = `radial-gradient(220px circle at ${glowPos.current.x}% ${glowPos.current.y}%, black 0%, transparent 80%)`;
      (border.style as any).maskImage = `radial-gradient(220px circle at ${glowPos.current.x}% ${glowPos.current.y}%, black 0%, transparent 80%)`;
    }

    // Image parallax shift
    const img = imgRef.current;
    if (img) {
      const px = (glowPos.current.x - 50) * 0.12;
      const py = (glowPos.current.y - 50) * 0.12;
      img.style.transform = `scale(1.15) translate(${px}px, ${py}px)`;
    }

    // Check convergence
    const dx = Math.abs(tiltCurrent.current.x - tiltTarget.current.x);
    const dy = Math.abs(tiltCurrent.current.y - tiltTarget.current.y);
    if (dx > 0.01 || dy > 0.01 || isHovered.current) {
      rafId.current = requestAnimationFrame(tick);
    } else {
      rafId.current = 0;
    }
  }, []);

  const startLoop = useCallback(() => {
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const handleMouseEnter = useCallback(() => {
    isHovered.current = true;
    // Fade in glow/border
    if (glowRef.current) glowRef.current.style.opacity = '1';
    if (borderRef.current) borderRef.current.style.opacity = '1';
    // Lighten overlay
    if (overlayRef.current) overlayRef.current.style.opacity = '0.35';
    startLoop();
  }, [startLoop]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    tiltTarget.current.x = ((x - cx) / cx) * 6; // max 6deg
    tiltTarget.current.y = -((y - cy) / cy) * 6;
    glowPos.current.x = (x / rect.width) * 100;
    glowPos.current.y = (y / rect.height) * 100;

    startLoop();
  }, [startLoop]);

  const handleMouseLeave = useCallback(() => {
    isHovered.current = false;
    tiltTarget.current = { x: 0, y: 0 };
    // Fade out glow/border
    if (glowRef.current) glowRef.current.style.opacity = '0';
    if (borderRef.current) borderRef.current.style.opacity = '0';
    // Darken overlay back
    if (overlayRef.current) overlayRef.current.style.opacity = '0.60';
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="purpose-card group relative overflow-hidden rounded-3xl cursor-pointer"
        style={{
          willChange: 'transform',
          transformStyle: 'preserve-3d',
          transition: 'box-shadow 0.4s ease',
          aspectRatio: '4 / 5',
        }}
      >
        {/* Background Image with Ken Burns drift */}
        <img
          ref={imgRef}
          src={image}
          alt={title}
          loading="lazy"
          className="purpose-card-img absolute inset-0 w-full h-full object-cover"
          style={{
            transform: 'scale(1.15)',
            transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        {/* Dark gradient overlay — lifts on hover */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.80) 100%)',
            opacity: 0.60,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Cursor-tracking radial glow */}
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl z-[2]"
          style={{
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Border beam */}
        <div
          ref={borderRef}
          aria-hidden
          className="pointer-events-none absolute inset-[1px] rounded-3xl z-[2]"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.15)',
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Content: Glassmorphism panel at bottom */}
        <div className="absolute inset-x-0 bottom-0 z-[3] p-5 sm:p-6">
          {/* Number tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-black text-cobalt-400 tracking-widest">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          {/* Title */}
          <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {title}
          </h4>

          {/* Glass description panel — expands on hover */}
          <div
            className="purpose-card-desc overflow-hidden"
            style={{
              maxHeight: '0px',
              opacity: 0,
              transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease 0.1s',
            }}
          >
            <div className="backdrop-blur-lg bg-white/10 dark:bg-white/[0.07] border border-white/15 rounded-2xl p-4 mt-2">
              <p className="text-xs sm:text-sm text-white/85 leading-[1.7]">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Ambient resting border */}
        <div className="absolute inset-0 rounded-3xl z-[4] pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
        />
      </div>
    </motion.div>
  );
};
